from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import RuleCandidate


class RuleCandidateRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_rule_candidate(self, candidate: RuleCandidate) -> RuleCandidate:
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def create_many(self, candidates: list[RuleCandidate]) -> list[RuleCandidate]:
        self.db.add_all(candidates)
        self.db.commit()
        for candidate in candidates:
            self.db.refresh(candidate)
        return candidates

    def list_by_document(self, document_id: str) -> list[RuleCandidate]:
        statement = (
            select(RuleCandidate)
            .where(RuleCandidate.document_id == document_id)
            .order_by(RuleCandidate.created_at.desc(), RuleCandidate.candidate_id.desc())
        )
        return list(self.db.scalars(statement).all())

    def list_all(self) -> list[RuleCandidate]:
        statement = select(RuleCandidate).order_by(RuleCandidate.created_at.desc(), RuleCandidate.candidate_id.desc())
        return list(self.db.scalars(statement).all())

    def get_by_id(self, candidate_id: int) -> RuleCandidate | None:
        return self.db.get(RuleCandidate, candidate_id)

    def save(self, candidate: RuleCandidate) -> RuleCandidate:
        self.db.commit()
        self.db.refresh(candidate)
        return candidate
