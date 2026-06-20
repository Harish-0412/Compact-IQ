from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.errors import AppError, ErrorResponse
from app.db.models import RuleCandidate
from app.db.session import get_db
from app.repositories.rule_candidate_repository import RuleCandidateRepository
from app.schemas.rule_candidate import RuleCandidateResponse
from app.services.normalization_service import NormalizationService

router = APIRouter(prefix="/rule-candidates", tags=["Rule Candidates"], responses={404: {"model": ErrorResponse}})


@router.get("", response_model=list[RuleCandidateResponse])
def list_rule_candidates(db: Session = Depends(get_db)) -> list[RuleCandidate]:
    return RuleCandidateRepository(db).list_all()


@router.get("/{candidate_id}", response_model=RuleCandidateResponse)
def get_rule_candidate(candidate_id: int, db: Session = Depends(get_db)) -> RuleCandidate:
    candidate = RuleCandidateRepository(db).get_by_id(candidate_id)
    if candidate is None:
        raise AppError(
            code="rule_candidate_not_found",
            message="Rule candidate was not found.",
            status_code=404,
            details={"candidate_id": candidate_id},
        )
    return candidate


@router.post("/{candidate_id}/normalize", response_model=RuleCandidateResponse)
def normalize_rule_candidate(candidate_id: int, db: Session = Depends(get_db)) -> RuleCandidate:
    repository = RuleCandidateRepository(db)
    candidate = repository.get_by_id(candidate_id)
    if candidate is None:
        raise AppError(
            code="rule_candidate_not_found",
            message="Rule candidate was not found.",
            status_code=404,
            details={"candidate_id": candidate_id},
        )

    NormalizationService().normalize_candidate(candidate)
    return repository.save(candidate)
