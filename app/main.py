from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chunks import router as chunks_router
from app.api.debug import router as debug_router
from app.api.documents import router as documents_router
from app.api.export import router as export_router
from app.api.frontend_compat import router as frontend_compat_router
from app.api.health import router as health_router
from app.api.rule_candidates import router as rule_candidates_router
from app.core.config import get_settings
from app.core.errors import AppError, app_error_handler
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.app_debug)

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        debug=settings.app_debug,
        openapi_tags=[
            {"name": "Health", "description": "Service, database, and LLM health checks."},
            {"name": "Documents", "description": "Upload, profile, extract, and run document intelligence."},
            {"name": "Chunks", "description": "Read extracted document chunks."},
            {"name": "Rule Candidates", "description": "Read, normalize, and export rule candidates."},
            {"name": "Debug", "description": "Demo and diagnostics endpoints."},
            {"name": "Export", "description": "Integration export endpoints for teammate services."},
        ],
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_exception_handler(AppError, app_error_handler)
    app.include_router(health_router, prefix="/api")
    app.include_router(documents_router, prefix="/api")
    app.include_router(chunks_router, prefix="/api")
    app.include_router(debug_router, prefix="/api")
    app.include_router(export_router, prefix="/api")
    app.include_router(rule_candidates_router, prefix="/api")
    app.include_router(frontend_compat_router, prefix="/api")

    return app


app = create_app()
