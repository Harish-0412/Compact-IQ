import json
from typing import Any, Protocol

import httpx

from app.core.config import Settings, get_settings
from app.core.errors import AppError
from app.services.json_repair import repair_json


class LLMService(Protocol):
    provider: str

    def generate_json(
        self,
        prompt: str,
        *,
        timeout_seconds: int | None = None,
        format_schema: dict[str, Any] | None = None,
        options: dict[str, Any] | None = None,
    ) -> dict:
        ...


class MockLLMService:
    provider = "mock"

    def __init__(self, model: str = "mock-gemma") -> None:
        self.model = model

    def generate_json(
        self,
        prompt: str,
        *,
        timeout_seconds: int | None = None,
        format_schema: dict[str, Any] | None = None,
        options: dict[str, Any] | None = None,
    ) -> dict:
        return {
            "rule_candidates": [
                {
                    "rule_type": "min_version_constraint",
                    "condition_logic": "AND",
                    "conditions": [
                        {
                            "component_type": "os",
                            "component_name": self._detect_subject(prompt),
                            "component_family": None,
                            "vendor": None,
                            "operator": "installed",
                            "value_raw": self._detect_subject(prompt),
                            "version_raw": None,
                            "version_scheme": None,
                        }
                    ],
                    "requirements": [
                        {
                            "component_type": "bios",
                            "component_name": "System BIOS",
                            "component_family": None,
                            "vendor": None,
                            "operator": ">=",
                            "value_raw": None,
                            "version_raw": self._detect_version(prompt),
                            "version_scheme": "semantic",
                            "requirement_kind": "min_version",
                        }
                    ],
                    "exceptions": [],
                    "severity": "warning",
                    "confidence_score": 0.8,
                    "confidence_reason": "Deterministic mock response for local tests and demos.",
                    "remediation_hint": "Use the required BIOS version or later.",
                }
            ]
        }

    def _detect_subject(self, prompt: str) -> str:
        lowered = prompt.lower()
        if "windows server 2012" in lowered:
            return "Windows Server 2012"
        if "product a" in lowered:
            return "Product A"
        return "compatibility document"

    def _detect_version(self, prompt: str) -> str:
        search_text = prompt
        lower_prompt = prompt.lower()
        if "chunk text:" in lower_prompt:
            start = lower_prompt.index("chunk text:") + len("chunk text:")
            search_text = prompt[start:]
        elif "from:" in lower_prompt:
            start = lower_prompt.index("from:") + len("from:")
            search_text = prompt[start:]

        for token in search_text.replace(",", " ").split():
            stripped = token.strip(".:;()")
            if any(char.isdigit() for char in stripped) and "." in stripped:
                return stripped
        return "1.0"

    def _excerpt(self, prompt: str) -> str:
        source_marker = "source excerpt:"
        lower_prompt = prompt.lower()
        if source_marker in lower_prompt:
            start = lower_prompt.index(source_marker) + len(source_marker)
            remainder = prompt[start:].strip()
            return remainder.split("\n\n", 1)[0].strip()[:500]
        marker = "from:"
        if marker in lower_prompt:
            start = lower_prompt.index(marker) + len(marker)
            return prompt[start:].strip()[:500]
        return prompt.strip()[:500]


class OllamaCloudLLMService:
    provider = "ollama"

    def __init__(self, settings: Settings | None = None, client: httpx.Client | None = None) -> None:
        self.settings = settings or get_settings()
        self.client = client

    def generate_json(
        self,
        prompt: str,
        *,
        timeout_seconds: int | None = None,
        format_schema: dict[str, Any] | None = None,
        options: dict[str, Any] | None = None,
    ) -> dict:
        timeout = timeout_seconds or self.settings.ollama_timeout_seconds
        url = self._generate_url()
        headers = {"Content-Type": "application/json"}
        if self.settings.ollama_api_key:
            headers["Authorization"] = f"Bearer {self.settings.ollama_api_key}"

        payload = {
            "model": self.settings.ollama_model,
            "prompt": prompt,
            "stream": False,
            "format": format_schema or "json",
        }
        if options:
            payload["options"] = options

        try:
            if self.client is not None:
                response = self.client.post(url, json=payload, headers=headers, timeout=timeout)
            else:
                with httpx.Client() as client:
                    response = client.post(url, json=payload, headers=headers, timeout=timeout)
        except httpx.TimeoutException as exc:
            raise self._adapter_error("llm_timeout", "Ollama request timed out.", details={"timeout_seconds": timeout}) from exc
        except httpx.HTTPError as exc:
            raise self._adapter_error("llm_connection_error", "Ollama request failed before a response was received.") from exc

        if response.status_code in {401, 403}:
            raise self._adapter_error(
                "llm_auth_failed",
                "Ollama rejected the request. Check your Ollama credentials.",
                status_code=502,
                details={"http_status": response.status_code},
            )
        if response.status_code == 404:
            raise self._adapter_error(
                "llm_endpoint_not_found",
                "Ollama endpoint was not found. Check OLLAMA_GENERATE_PATH.",
                status_code=502,
                details={"http_status": response.status_code, "generate_path": self.settings.ollama_generate_path},
            )
        if response.status_code >= 400:
            raise self._adapter_error(
                "llm_http_error",
                "Ollama returned an error response.",
                status_code=502,
                details={"http_status": response.status_code},
            )

        try:
            payload_json = response.json()
        except json.JSONDecodeError as exc:
            raise self._adapter_error("llm_invalid_json", "Ollama returned a non-JSON response.", status_code=502) from exc

        return self._extract_json_payload(payload_json)

    def _extract_json_payload(self, payload: dict) -> dict:
        if not isinstance(payload, dict):
            raise self._adapter_error("llm_invalid_json", "Ollama response JSON was not an object.", status_code=502)

        if "response" in payload:
            response_value = payload["response"]
            if isinstance(response_value, dict):
                return response_value
            if isinstance(response_value, str):
                try:
                    parsed = json.loads(response_value)
                except json.JSONDecodeError as exc:
                    repair_result = repair_json(response_value)
                    if repair_result.ok and isinstance(repair_result.data, dict):
                        return repair_result.data
                    raise self._adapter_error(
                        "llm_invalid_json",
                        "Ollama response field did not contain JSON.",
                        details={"response_preview": response_value[:300]},
                    ) from exc
                if isinstance(parsed, dict):
                    return parsed
                raise self._adapter_error("llm_invalid_json", "Ollama response field JSON was not an object.")

        message = payload.get("message")
        if isinstance(message, dict) and isinstance(message.get("content"), str):
            try:
                parsed = json.loads(message["content"])
            except json.JSONDecodeError as exc:
                raise self._adapter_error("llm_invalid_json", "Ollama message content did not contain JSON.") from exc
            if isinstance(parsed, dict):
                return parsed

        return payload

    def _generate_url(self) -> str:
        base_url = self.settings.ollama_base_url.rstrip("/")
        path = self.settings.ollama_generate_path
        if not path.startswith("/"):
            path = f"/{path}"
        return f"{base_url}{path}"

    def _adapter_error(
        self,
        code: str,
        message: str,
        status_code: int = 502,
        details: dict | None = None,
    ) -> AppError:
        safe_details = {
            "provider": self.provider,
            "model": self.settings.ollama_model,
            **(details or {}),
        }
        return AppError(code=code, message=message, status_code=status_code, details=safe_details)


class LLMServiceFactory:
    @staticmethod
    def create(settings: Settings | None = None) -> LLMService:
        resolved_settings = settings or get_settings()
        if resolved_settings.use_mock_llm:
            return MockLLMService(model=resolved_settings.ollama_model)
        return OllamaCloudLLMService(settings=resolved_settings)
