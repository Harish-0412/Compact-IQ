from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.errors import AppError, ErrorResponse
from app.db.models import RuleCandidate
from app.db.session import get_db
from app.repositories.rule_candidate_repository import RuleCandidateRepository
from app.schemas.rule_candidate import RuleCandidateResponse, RuleCandidateReviewRequest, RuleCandidateReviewResponse
from app.services.normalization_service import NormalizationService

router = APIRouter(prefix="/rule-candidates", tags=["Rule Candidates"], responses={404: {"model": ErrorResponse}})

ALLOWED_REVIEW_STATUSES = {"pending_review", "approved", "rejected", "needs_clarification"}


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


@router.patch("/{candidate_id}/review", response_model=RuleCandidateReviewResponse)
def update_rule_candidate_review(
    candidate_id: int,
    payload: RuleCandidateReviewRequest,
    db: Session = Depends(get_db),
) -> RuleCandidateReviewResponse:
    return _set_review_status(candidate_id, payload.review_status, db)


@router.post("/{candidate_id}/approve", response_model=RuleCandidateReviewResponse)
def approve_rule_candidate(candidate_id: int, db: Session = Depends(get_db)) -> RuleCandidateReviewResponse:
    return _set_review_status(candidate_id, "approved", db)


@router.post("/{candidate_id}/reject", response_model=RuleCandidateReviewResponse)
def reject_rule_candidate(candidate_id: int, db: Session = Depends(get_db)) -> RuleCandidateReviewResponse:
    return _set_review_status(candidate_id, "rejected", db)


@router.post("/{candidate_id}/clarify", response_model=RuleCandidateReviewResponse)
def clarify_rule_candidate(candidate_id: int, db: Session = Depends(get_db)) -> RuleCandidateReviewResponse:
    return _set_review_status(candidate_id, "needs_clarification", db)


def _set_review_status(candidate_id: int, review_status: str, db: Session) -> RuleCandidateReviewResponse:
    if review_status not in ALLOWED_REVIEW_STATUSES:
        raise AppError(
            code="invalid_review_status",
            message="Review status is not supported.",
            status_code=400,
            details={"review_status": review_status, "allowed": sorted(ALLOWED_REVIEW_STATUSES)},
        )

    repository = RuleCandidateRepository(db)
    candidate = repository.get_by_id(candidate_id)
    if candidate is None:
        raise AppError(
            code="rule_candidate_not_found",
            message="Rule candidate was not found.",
            status_code=404,
            details={"candidate_id": candidate_id},
        )

    # TODO: Replace this temporary review-status update with full approved-rule promotion flow.
    candidate.review_status = review_status
    repository.save(candidate)
    return RuleCandidateReviewResponse(
        candidate_id=candidate.candidate_id,
        review_status=candidate.review_status,
        message="Review status updated. Full approved-rule promotion is pending backend integration.",
        is_temporary_review_flow=True,
    )
