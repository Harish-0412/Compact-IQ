import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
// SVG icon components
const Icons = {
  Overview: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Documents: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Inventory: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Compliance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Analysis: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Assistant: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2m0 16v2m8-10h2M2 12H0m15.54-6.46 1.41-1.41M5.05 18.95l-1.41 1.41M18.95 18.95l1.41 1.41M5.05 5.05 3.64 3.64"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  AuditLog: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const navItems = [
  { id: "Overview",   label: "Overview",   Icon: Icons.Overview   },
  { id: "Documents",  label: "Documents",   Icon: Icons.Documents  },
  { id: "Inventory",  label: "Inventory",   Icon: Icons.Inventory  },
  { id: "Compliance", label: "Compliance",  Icon: Icons.Compliance },
  { id: "Analysis",   label: "Analysis",    Icon: Icons.Analysis   },
  { id: "Assistant",  label: "Assistant",   Icon: Icons.Assistant  },
  { id: "AuditLog",   label: "Audit Log",   Icon: Icons.AuditLog   },
];

const workflowStages = [
  {
    id: "doc_processing",
    title: "Document Processing",
    description: "PDF ingestion, OCR, structure parsing and metadata extraction",
    detail: "Parsed 5 documents · 1,248 pages · 3 vendors",
    duration: "2m 14s",
    timestamp: "18 Jun 2026, 09:12",
  },
  {
    id: "rule_extraction",
    title: "Rule Extraction",
    description: "AI identifies compatibility constraints, dependencies and exclusions",
    detail: "8 rule candidates extracted · Avg confidence 91%",
    duration: "1m 48s",
    timestamp: "18 Jun 2026, 09:14",
  },
  {
    id: "rule_validation",
    title: "Rule Validation",
    description: "Human review of extracted candidates in the Review Queue",
    detail: "6 approved · 1 needs clarification · 1 rejected",
    duration: "Manual step",
    timestamp: "18 Jun 2026, 11:03",
  },
  {
    id: "kb_generation",
    title: "Knowledge Base Generation",
    description: "Approved rules written to the compliance knowledge graph",
    detail: "8 rules indexed · 12 entity relationships mapped",
    duration: "0m 32s",
    timestamp: "18 Jun 2026, 11:05",
  },
  {
    id: "inventory_sync",
    title: "Inventory Sync",
    description: "Pull device records from PostgreSQL and normalise schema",
    detail: "247 devices · 3 sites · Last sync 4h ago",
    duration: "0m 58s",
    timestamp: "18 Jun 2026, 11:06",
  },
  {
    id: "compliance_analysis",
    title: "Compliance Analysis",
    description: "Match every device against all approved rules",
    detail: "214 compliant · 33 violations · 4 critical",
    duration: "3m 07s",
    timestamp: "18 Jun 2026, 11:09",
  },
  {
    id: "root_cause",
    title: "Root Cause Analysis",
    description: "Trace violations back to source evidence and dependency chains",
    detail: "19 dependency chains resolved · 4 root causes identified",
    duration: "1m 22s",
    timestamp: "18 Jun 2026, 11:10",
  },
  {
    id: "remediation",
    title: "Remediation Planning",
    description: "Generate ordered remediation steps for each violation group",
    detail: "11 remediation plans generated · Estimated 6h total effort",
    duration: "0m 44s",
    timestamp: "18 Jun 2026, 11:11",
  },
];

const documentStatusLabels = {
  uploaded: "Uploaded",
  profiled: "Processing",
  extracted: "Processing",
  rules_extracted: "Ready For Review",
  approved: "Approved",
  completed: "Completed",
};

const documentStatusTone = {
  uploaded: "info",
  profiled: "warning",
  extracted: "warning",
  rules_extracted: "success",
  approved: "success",
  completed: "success",
};

const processingSteps = [
  { label: "Uploaded", description: "Document received and stored securely." },
  { label: "Document Analysis", description: "Parsing structure, tables, and metadata." },
  { label: "Content Extraction", description: "Extracting text blocks and semantic content." },
  { label: "Rule Discovery", description: "Identifying compatibility requirements and constraints." },
  { label: "Rule Structuring", description: "Normalising candidates into structured rule format." },
  { label: "Ready For Review", description: "All candidates queued for human validation." },
];

const MOCK_RULE_CANDIDATES = [
  {
    id: "RC-001", ruleType: "Dependency", severity: "Critical", confidence: 98,
    status: "pending_review",
    subject: "BIOS 6.4.2", predicate: "REQUIRES", object: "Firmware >= 8.2.0",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 4, section: "Compatibility Requirements",
    evidence: "System BIOS 6.4.2 requires System Firmware 8.2.0 or later to ensure platform stability and feature compatibility across all PowerEdge R-series platforms.",
  },
  {
    id: "RC-002", ruleType: "Exclusion", severity: "High", confidence: 91,
    status: "pending_review",
    subject: "iDRAC 9.5.0", predicate: "INCOMPATIBLE_WITH", object: "BIOS < 6.0.0",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 7, section: "Known Issues",
    evidence: "iDRAC 9.5.0 is not compatible with BIOS versions earlier than 6.0.0 due to secure boot validation changes introduced in BIOS 6.0.0.",
  },
  {
    id: "RC-003", ruleType: "Recommendation", severity: "Medium", confidence: 84,
    status: "needs_clarification",
    subject: "NVMe Driver 4.1", predicate: "RECOMMENDS", object: "OS Kernel >= 5.15",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 12, section: "Driver Notes",
    evidence: "For optimal NVMe 4.1 performance, Dell recommends using OS kernel 5.15 or later. Earlier kernels may experience reduced throughput on high-density NVMe configurations.",
  },
  {
    id: "RC-004", ruleType: "Dependency", severity: "Critical", confidence: 99,
    status: "pending_review",
    subject: "PERC H755 Firmware", predicate: "REQUIRES", object: "StorCLI 007.1916.0000.0000+",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 15, section: "Storage Compatibility",
    evidence: "PERC H755 firmware update operations require StorCLI tool version 007.1916.0000.0000 or greater. Using earlier versions may result in failed firmware updates.",
  },
  {
    id: "RC-005", ruleType: "Exclusion", severity: "Critical", confidence: 97,
    status: "rejected",
    subject: "OpenManage 10.1", predicate: "INCOMPATIBLE_WITH", object: "Windows Server 2012",
    document: "Dell_OME_v10.1.pdf", page: 3, section: "System Requirements",
    evidence: "Dell OpenManage Enterprise 10.1 does not support Windows Server 2012 or Windows Server 2012 R2. Customers must upgrade to Windows Server 2016 or later.",
  },
  {
    id: "RC-006", ruleType: "Dependency", severity: "High", confidence: 88,
    status: "pending_review",
    subject: "iSM 5.3.0", predicate: "REQUIRES", object: "iDRAC >= 9.4.0",
    document: "Dell_iSM_v5.3.pdf", page: 6, section: "Prerequisites",
    evidence: "iDRAC Service Module 5.3.0 requires iDRAC firmware version 9.4.0 or later to enable all management features including SupportAssist integration.",
  },
  {
    id: "RC-007", ruleType: "Recommendation", severity: "Low", confidence: 76,
    status: "needs_clarification",
    subject: "PowerEdge R750", predicate: "RECOMMENDS", object: "Dual PSU Configuration",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 21, section: "Hardware Best Practices",
    evidence: "For production workloads, Dell recommends dual redundant PSU configuration on PowerEdge R750 to maintain uptime during power supply events.",
  },
  {
    id: "RC-008", ruleType: "Dependency", severity: "High", confidence: 93,
    status: "edited",
    subject: "CPLD v1.0.4", predicate: "REQUIRES", object: "BIOS >= 6.2.0",
    document: "Dell_ReleaseNotes_v6.4.pdf", page: 9, section: "CPLD Notes",
    evidence: "Complex Programmable Logic Device (CPLD) firmware v1.0.4 requires BIOS version 6.2.0 or later for correct initialization during POST.",
  },
];

const MOCK_APPROVED_RULES = [
  {
    id: "R-001", subject: "BIOS 6.4.2", predicate: "REQUIRES", object: "Firmware >= 8.2.0",
    severity: "Critical", ruleType: "Dependency", vendor: "Dell", product: "PowerEdge R750",
    approvedDate: "2026-06-18", document: "Dell_ReleaseNotes_v6.4.pdf",
    evidence: "System BIOS 6.4.2 requires System Firmware 8.2.0 or later to ensure platform stability.",
    affectedDevices: ["PE-R750-001", "PE-R750-002", "PE-R740-003"],
    relatedRules: ["R-002", "R-005"], dependencies: ["Firmware package v8.2.0+"],
  },
  {
    id: "R-002", subject: "iDRAC 9.5.0", predicate: "INCOMPATIBLE_WITH", object: "BIOS < 6.0.0",
    severity: "High", ruleType: "Exclusion", vendor: "Dell", product: "PowerEdge R640",
    approvedDate: "2026-06-18", document: "Dell_ReleaseNotes_v6.4.pdf",
    evidence: "iDRAC 9.5.0 is not compatible with BIOS versions earlier than 6.0.0.",
    affectedDevices: ["PE-R640-007"], relatedRules: ["R-001"], dependencies: ["BIOS >= 6.0.0"],
  },
  {
    id: "R-003", subject: "PERC H755", predicate: "REQUIRES", object: "StorCLI >= 007.1916",
    severity: "Critical", ruleType: "Dependency", vendor: "Dell", product: "PowerEdge R750xs",
    approvedDate: "2026-06-17", document: "Dell_ReleaseNotes_v6.4.pdf",
    evidence: "PERC H755 firmware requires StorCLI 007.1916.0000.0000 or greater.",
    affectedDevices: ["PE-R750XS-010", "PE-R750XS-011"], relatedRules: ["R-001"], dependencies: ["StorCLI 007.1916+"],
  },
  {
    id: "R-004", subject: "OpenManage 10.1", predicate: "REQUIRES", object: "Windows Server 2016+",
    severity: "High", ruleType: "Dependency", vendor: "Dell", product: "OpenManage Enterprise",
    approvedDate: "2026-06-17", document: "Dell_OME_v10.1.pdf",
    evidence: "Dell OpenManage Enterprise 10.1 requires Windows Server 2016 or later.",
    affectedDevices: [], relatedRules: [], dependencies: ["Windows Server 2016+", ".NET 4.8+"],
  },
  {
    id: "R-005", subject: "iSM 5.3.0", predicate: "REQUIRES", object: "iDRAC >= 9.4.0",
    severity: "High", ruleType: "Dependency", vendor: "Dell", product: "iDRAC Service Module",
    approvedDate: "2026-06-16", document: "Dell_iSM_v5.3.pdf",
    evidence: "iDRAC Service Module 5.3.0 requires iDRAC firmware version 9.4.0 or later.",
    affectedDevices: ["PE-R750-001", "PE-R640-007"], relatedRules: ["R-002"], dependencies: ["iDRAC 9.4.0+"],
  },
  {
    id: "R-006", subject: "CPLD v1.0.4", predicate: "REQUIRES", object: "BIOS >= 6.2.0",
    severity: "High", ruleType: "Dependency", vendor: "Dell", product: "PowerEdge Platform",
    approvedDate: "2026-06-16", document: "Dell_ReleaseNotes_v6.4.pdf",
    evidence: "CPLD firmware v1.0.4 requires BIOS version 6.2.0 or later for correct POST initialization.",
    affectedDevices: ["PE-R750-001", "PE-R750-002"], relatedRules: ["R-001"], dependencies: ["BIOS >= 6.2.0"],
  },
  {
    id: "R-007", subject: "Mellanox NIC FW 22.35", predicate: "REQUIRES", object: "Driver >= 5.8",
    severity: "Medium", ruleType: "Dependency", vendor: "Dell", product: "PowerEdge Network",
    approvedDate: "2026-06-15", document: "Dell_NetworkDriver_v22.pdf",
    evidence: "Mellanox ConnectX-6 NIC firmware 22.35 requires OFED driver version 5.8 or later for full SR-IOV support.",
    affectedDevices: ["PE-R750-001"], relatedRules: [], dependencies: ["OFED Driver 5.8+"],
  },
  {
    id: "R-008", subject: "SupportAssist 4.0", predicate: "INCOMPATIBLE_WITH", object: "iDRAC < 9.3.0",
    severity: "Medium", ruleType: "Exclusion", vendor: "Dell", product: "SupportAssist Enterprise",
    approvedDate: "2026-06-15", document: "Dell_SA_v4.0_ReleaseNotes.pdf",
    evidence: "SupportAssist Enterprise 4.0 automated case creation feature is not compatible with iDRAC firmware versions earlier than 9.3.0.",
    affectedDevices: ["PE-R640-007"], relatedRules: ["R-002", "R-005"], dependencies: ["iDRAC >= 9.3.0"],
  },
];

// ─────────────────────────────────────────────
// Audit Log demo data
// ─────────────────────────────────────────────
const AUDIT_LOG_DATA = [
  {
    id: "AUD-001", timestamp: "2026-06-20 11:11:32", user: "dharani.admin",
    action: "PIPELINE_COMPLETE", entityType: "Pipeline", entityId: "PIPE-2026-001",
    status: "Success",
    notes: "Full pipeline completed in 10m 45s",
    prevState: "Running", currState: "Completed",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-002", timestamp: "2026-06-20 11:10:14", user: "dharani.admin",
    action: "ROOT_CAUSE_COMPLETE", entityType: "Analysis", entityId: "ANA-011",
    status: "Success",
    notes: "19 dependency chains resolved, 4 root causes identified",
    prevState: "Running", currState: "Completed",
    relatedDoc: null, relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-003", timestamp: "2026-06-20 11:09:07", user: "system",
    action: "COMPLIANCE_SCAN", entityType: "Compliance", entityId: "SCAN-099",
    status: "Warning",
    notes: "214 compliant, 33 violations, 4 critical",
    prevState: null, currState: "33 violations found",
    relatedDoc: null, relatedRule: null, relatedDevice: "PE-R640-007",
  },
  {
    id: "AUD-004", timestamp: "2026-06-20 11:06:44", user: "system",
    action: "INVENTORY_SYNC", entityType: "Inventory", entityId: "SYNC-047",
    status: "Success",
    notes: "247 devices synced across 3 sites",
    prevState: "240 devices", currState: "247 devices",
    relatedDoc: null, relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-005", timestamp: "2026-06-20 11:05:21", user: "system",
    action: "KB_UPDATE", entityType: "Knowledge Base", entityId: "KB-v3.9",
    status: "Success",
    notes: "8 rules indexed, 12 entity relationships mapped",
    prevState: "v3.8 (0 rules)", currState: "v3.9 (8 rules)",
    relatedDoc: null, relatedRule: "R-001", relatedDevice: null,
  },
  {
    id: "AUD-006", timestamp: "2026-06-20 11:03:55", user: "priya.reviewer",
    action: "RULE_REJECTED", entityType: "Rule Candidate", entityId: "RC-005",
    status: "Info",
    notes: "Duplicate of existing R-004, rejected after clarification",
    prevState: "pending_review", currState: "rejected",
    relatedDoc: "Dell_OME_v10.1.pdf", relatedRule: "RC-005", relatedDevice: null,
  },
  {
    id: "AUD-007", timestamp: "2026-06-20 10:58:03", user: "dharani.admin",
    action: "RULE_APPROVED", entityType: "Rule", entityId: "R-001",
    status: "Success",
    notes: "Approved with evidence verified from page 4",
    prevState: "pending_review", currState: "approved",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: "R-001", relatedDevice: null,
  },
  {
    id: "AUD-008", timestamp: "2026-06-20 10:55:41", user: "dharani.admin",
    action: "RULE_APPROVED", entityType: "Rule", entityId: "R-002",
    status: "Success",
    notes: "iDRAC exclusion confirmed against known issues section",
    prevState: "pending_review", currState: "approved",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: "R-002", relatedDevice: null,
  },
  {
    id: "AUD-009", timestamp: "2026-06-20 10:48:19", user: "priya.reviewer",
    action: "RULE_EDITED", entityType: "Rule Candidate", entityId: "RC-008",
    status: "Info",
    notes: "Corrected BIOS version from 6.1.0 to 6.2.0 per errata",
    prevState: "BIOS >= 6.1.0", currState: "BIOS >= 6.2.0",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: "RC-008", relatedDevice: null,
  },
  {
    id: "AUD-010", timestamp: "2026-06-20 09:14:22", user: "system",
    action: "RULE_EXTRACTION", entityType: "Document", entityId: "DOC-001",
    status: "Success",
    notes: "8 rule candidates extracted, avg confidence 91%",
    prevState: "profiled", currState: "rules_extracted",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-011", timestamp: "2026-06-20 09:12:05", user: "system",
    action: "DOC_PROCESSED", entityType: "Document", entityId: "DOC-001",
    status: "Success",
    notes: "1,248 pages parsed, structure and metadata extracted",
    prevState: "uploaded", currState: "profiled",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-012", timestamp: "2026-06-20 09:09:47", user: "dharani.admin",
    action: "DOC_UPLOAD", entityType: "Document", entityId: "DOC-005",
    status: "Success",
    notes: "Uploaded via web interface, file size 4.2 MB",
    prevState: null, currState: "uploaded",
    relatedDoc: "Dell_SA_v4.0_ReleaseNotes.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-013", timestamp: "2026-06-19 16:30:11", user: "system",
    action: "DOC_PROCESSED", entityType: "Document", entityId: "DOC-002",
    status: "Success",
    notes: "OME v10.1 Admin Guide parsed successfully",
    prevState: "uploaded", currState: "profiled",
    relatedDoc: "Dell_OME_v10.1.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-014", timestamp: "2026-06-19 14:12:33", user: "dharani.admin",
    action: "DOC_UPLOAD", entityType: "Document", entityId: "DOC-002",
    status: "Success",
    notes: "OME Admin Guide uploaded, 312 pages",
    prevState: null, currState: "uploaded",
    relatedDoc: "Dell_OME_v10.1.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-015", timestamp: "2026-06-18 11:22:08", user: "priya.reviewer",
    action: "RULE_APPROVED", entityType: "Rule", entityId: "R-007",
    status: "Success",
    notes: "Mellanox NIC firmware rule confirmed via NIC documentation cross-reference",
    prevState: "pending_review", currState: "approved",
    relatedDoc: "Dell_NetworkDriver_v22.pdf", relatedRule: "R-007", relatedDevice: null,
  },
  {
    id: "AUD-016", timestamp: "2026-06-18 10:05:50", user: "system",
    action: "COMPLIANCE_SCAN", entityType: "Compliance", entityId: "SCAN-098",
    status: "Failure",
    notes: "Scan failed: inventory data stale by more than 24h",
    prevState: null, currState: "Failed — stale inventory",
    relatedDoc: null, relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-017", timestamp: "2026-06-17 15:44:29", user: "dharani.admin",
    action: "RULE_APPROVED", entityType: "Rule", entityId: "R-005",
    status: "Success",
    notes: "iSM prerequisite rule validated against product documentation",
    prevState: "pending_review", currState: "approved",
    relatedDoc: "Dell_iSM_v5.3.pdf", relatedRule: "R-005", relatedDevice: null,
  },
  {
    id: "AUD-018", timestamp: "2026-06-17 09:30:00", user: "system",
    action: "DOC_UPLOAD", entityType: "Document", entityId: "DOC-003",
    status: "Success",
    notes: "iSM v5.3 Release Notes uploaded",
    prevState: null, currState: "uploaded",
    relatedDoc: "Dell_iSM_v5.3.pdf", relatedRule: null, relatedDevice: null,
  },
  {
    id: "AUD-019", timestamp: "2026-06-16 14:21:17", user: "priya.reviewer",
    action: "RULE_CLARIFICATION", entityType: "Rule Candidate", entityId: "RC-003",
    status: "Info",
    notes: "Sent for clarification — OS kernel version range unclear",
    prevState: "pending_review", currState: "needs_clarification",
    relatedDoc: "Dell_ReleaseNotes_v6.4.pdf", relatedRule: "RC-003", relatedDevice: null,
  },
  {
    id: "AUD-020", timestamp: "2026-06-14 08:00:00", user: "dharani.admin",
    action: "DOC_UPLOAD", entityType: "Document", entityId: "DOC-004",
    status: "Success",
    notes: "Network driver guide uploaded to bootstrap library",
    prevState: null, currState: "uploaded",
    relatedDoc: "Dell_NetworkDriver_v22.pdf", relatedRule: null, relatedDevice: null,
  },
];

// ─────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────
function App() {
  const [page, setPage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // DB connection state
  const [dbUrl, setDbUrl] = useState("");
  const [showDbModal, setShowDbModal] = useState(false);

  // Shared compliance analysis run state
  const [analysisRun, setAnalysisRun] = useState(false);

  const openDbModal  = () => setShowDbModal(true);
  const closeDbModal = () => setShowDbModal(false);
  const saveDbUrl    = (url) => { setDbUrl(url); setShowDbModal(false); };

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      {/* ── Dark navy collapsible sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`} aria-label="Primary navigation">

        {/* Brand header */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <div className="logo-mark">CIQ</div>
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-name">CompatIQ</span>
                <span className="logo-sub">Enterprise</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              id={`nav-${id.toLowerCase()}`}
              className={`sidebar-item ${id === page ? "active" : ""}`}
              onClick={() => setPage(id)}
              title={!sidebarOpen ? label : undefined}
            >
              <span className="sidebar-icon"><Icon /></span>
              {sidebarOpen && <span className="sidebar-label">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="sidebar-workspace">
              <span className="status-dot neutral-dot" />
              <span>Not configured</span>
            </div>
          )}
          <button
            className="sidebar-settings-btn"
            title={!sidebarOpen ? "Settings" : undefined}
          >
            <Icons.Settings />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* ── Sidebar toggle — lives OUTSIDE the sidebar so overflow:hidden can't clip it ── */}
      <button
        className={`sidebar-toggle ${sidebarOpen ? "open" : "closed"}`}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
      </button>

      {/* ── Main work area ── */}
      <div className="workarea">
        <header className="topbar">
          <div>
            <div className="breadcrumb">CompatIQ / {page === "AuditLog" ? "Audit Log" : page}</div>
            <h1>{page === "AuditLog" ? "Audit Log" : page}</h1>
          </div>
          <div className="topbar-actions">
            <input className="global-search" placeholder="Search across all records…" disabled />
            <button
              className={`secondary-button ${page === "AuditLog" ? "active" : ""}`}
              id="audit-log-btn"
              onClick={() => setPage("AuditLog")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:5,verticalAlign:"middle"}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Audit Log
            </button>
            {/* Connect Data button — Documents and Inventory pages */}
            {(page === "Documents" || page === "Inventory") && (
              <button
                className={`primary-button connect-data-btn ${dbUrl ? "connected" : ""}`}
                id="connect-data-btn"
                onClick={openDbModal}
              >
                <span className="connect-dot" />
                {dbUrl ? "Connected" : "Connect Data"}
              </button>
            )}
          </div>
        </header>
        <main className="main-content">
          {page === "Overview"   && <Overview />}
          {page === "Documents"  && <Documents dbUrl={dbUrl} />}
          {page === "Inventory"  && <Inventory dbUrl={dbUrl} />}
          {page === "Compliance" && <Compliance analysisRun={analysisRun} setAnalysisRun={setAnalysisRun} />}
          {page === "Analysis"   && <Analysis analysisRun={analysisRun} />}
          {page === "Assistant"  && <Assistant analysisRun={analysisRun} />}
          {page === "AuditLog"   && <AuditLogPage analysisRun={analysisRun} />}
        </main>
      </div>

      {/* DB Connection modal */}
      {showDbModal && (
        <ConnectDataModal
          currentUrl={dbUrl}
          onSave={saveDbUrl}
          onClose={closeDbModal}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Connect Data Modal
// ─────────────────────────────────────────────
function ConnectDataModal({ currentUrl, onSave, onClose }) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(currentUrl);
  const [error,   setError]     = useState("");

  const startEdit   = () => { setDraft(currentUrl); setEditing(true); setError(""); };
  const cancelEdit  = () => { setDraft(currentUrl); setEditing(false); setError(""); };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) { setError("Please enter a database URL."); return; }
    onSave(trimmed);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal db-modal" onClick={(e) => e.stopPropagation()} id="db-modal">

        {/* Header */}
        <div className="modal-header">
          <div className="db-modal-title">
            <span className="db-modal-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </span>
            <div>
              <h2>Database Connection</h2>
              <p>{currentUrl ? "Active connection" : "No database connected"}</p>
            </div>
          </div>
          {/* ✕ circle close button */}
          <button className="db-close-btn" onClick={onClose} id="db-close-btn" aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="db-modal-body">

          {/* Current connection display */}
          <div className="db-current-block">
            <div className="db-field-label">Current Database URL</div>
            <div className={`db-url-display ${currentUrl ? "has-url" : "empty-url"}`}>
              {currentUrl ? (
                <>
                  <span className="db-status-dot connected" />
                  <span className="db-url-text">{currentUrl}</span>
                </>
              ) : (
                <>
                  <span className="db-status-dot disconnected" />
                  <span className="db-url-text muted">No database connected</span>
                </>
              )}
            </div>
          </div>

          {/* Edit field — shown only when editing */}
          {editing && (
            <div className="db-edit-block">
              <div className="db-field-label">New Database URL</div>
              <div className="db-input-wrap">
                <input
                  id="db-url-input"
                  className={`db-url-input ${error ? "input-error" : ""}`}
                  type="text"
                  value={draft}
                  onChange={(e) => { setDraft(e.target.value); setError(""); }}
                  placeholder="postgresql://user:password@host:5432/dbname"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                {/* Inline ✕ clear */}
                {draft && (
                  <button className="db-input-clear" onClick={() => setDraft("")} tabIndex={-1}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
              {error && <p className="db-error">{error}</p>}
              <p className="db-hint">Supports PostgreSQL, MySQL, and SQLite connection strings.</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="db-modal-footer">
          {!editing ? (
            <>
              <button className="secondary-button" onClick={onClose}>Close</button>
              <button className="primary-button" id="change-db-btn" onClick={startEdit}>Change DB</button>
            </>
          ) : (
            <>
              <button className="secondary-button" id="cancel-db-btn" onClick={cancelEdit}>Cancel</button>
              <button className="primary-button" id="save-db-btn" onClick={handleSave}>Save Connection</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Audit Log Drawer
// ─────────────────────────────────────────────
// Audit Log Page
// ─────────────────────────────────────────────
const ACTION_COLORS = {
  DOC_UPLOAD:         { label: "Document Upload",       tone: "info"    },
  DOC_PROCESSED:      { label: "Document Processed",    tone: "success" },
  RULE_EXTRACTION:    { label: "Rule Extraction",       tone: "success" },
  RULE_APPROVED:      { label: "Rule Approved",         tone: "success" },
  RULE_REJECTED:      { label: "Rule Rejected",         tone: "error"   },
  RULE_EDITED:        { label: "Rule Edited",           tone: "warning" },
  RULE_CLARIFICATION: { label: "Rule Clarification",    tone: "warning" },
  COMPLIANCE_SCAN:    { label: "Compliance Scan",       tone: "info"    },
  INVENTORY_SYNC:     { label: "Inventory Sync",        tone: "info"    },
  KB_UPDATE:          { label: "KB Update",             tone: "success" },
  PIPELINE_COMPLETE:  { label: "Pipeline Complete",     tone: "success" },
  ROOT_CAUSE_COMPLETE:{ label: "Root Cause Analysis",   tone: "success" },
};

const STATUS_TONE = { Success:"success", Warning:"warning", Failure:"error", Info:"info" };

function AuditLogPage({ analysisRun }) {
  const [search,     setSearch]     = useState("");
  const [filterUser, setFilterUser] = useState("All Users");
  const [filterAct,  setFilterAct]  = useState("All Actions");
  const [filterEnt,  setFilterEnt]  = useState("All Entity Types");
  const [filterStat, setFilterStat] = useState("All Statuses");
  const [filterDate, setFilterDate] = useState("All Dates");
  const [expanded,   setExpanded]   = useState(null);

  const activeLogs = analysisRun ? AUDIT_LOG_DATA : [];

  const users      = ["All Users",      ...new Set(activeLogs.map(r => r.user))];
  const actions    = ["All Actions",    ...new Set(activeLogs.map(r => r.action))];
  const entities   = ["All Entity Types",...new Set(activeLogs.map(r => r.entityType))];
  const statuses   = ["All Statuses",   "Success","Warning","Failure","Info"];
  const dateOpts   = ["All Dates", "Today (Jun 20)", "Yesterday (Jun 19)", "Jun 18", "Jun 17", "Jun 16", "Jun 14"];

  const DATE_MAP = {
    "Today (Jun 20)":    "2026-06-20",
    "Yesterday (Jun 19)":"2026-06-19",
    "Jun 18":"2026-06-18","Jun 17":"2026-06-17","Jun 16":"2026-06-16","Jun 14":"2026-06-14",
  };

  const filtered = activeLogs.filter(r => {
    const q = search.toLowerCase();
    if (q && !`${r.id} ${r.user} ${r.action} ${r.entityType} ${r.entityId} ${r.notes}`.toLowerCase().includes(q)) return false;
    if (filterUser !== "All Users"        && r.user       !== filterUser) return false;
    if (filterAct  !== "All Actions"      && r.action     !== filterAct)  return false;
    if (filterEnt  !== "All Entity Types" && r.entityType !== filterEnt)  return false;
    if (filterStat !== "All Statuses"     && r.status     !== filterStat) return false;
    if (filterDate !== "All Dates"        && !r.timestamp.startsWith(DATE_MAP[filterDate] || "")) return false;
    return true;
  });

  const exportCSV = () => {
    const header = "ID,Timestamp,User,Action,Entity Type,Entity ID,Status,Notes\n";
    const rows   = filtered.map(r =>
      `${r.id},"${r.timestamp}",${r.user},${r.action},${r.entityType},${r.entityId},${r.status},"${r.notes}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "compatiq_audit_log.csv"; a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "compatiq_audit_log.json"; a.click();
  };

  return (
    <div className="content-stack">
      <section className="panel">
        <PanelHeader
          title="System Operations Audit Log"
          meta={`${filtered.length} of ${activeLogs.length} events logged`}
        >
          <div className="audit-header-actions" style={{ display: "flex", gap: "8px" }}>
            <button className="secondary-button" onClick={exportCSV} title="Export CSV">CSV</button>
            <button className="secondary-button" onClick={exportJSON} title="Export JSON">JSON</button>
            <button className="secondary-button" title="Export PDF (planned)" disabled>PDF</button>
          </div>
        </PanelHeader>

        {/* Planned feature notice */}
        <div className="audit-notice" style={{ padding: "10px 16px", background: "var(--success-bg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--success)" }}>
          <span className="audit-notice-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
          <span><strong>Local Database Sandbox</strong> — Displaying mock audit trails. Real-time REST endpoints will sync when active workspace database is connected.</span>
        </div>

        {/* Filters */}
        <div className="audit-filters-bar">
          <input
            className="audit-search"
            placeholder="Search ID, user, action, notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="audit-filter-row">
            {[
              [filterDate, setFilterDate, dateOpts,   "Date"],
              [filterUser, setFilterUser, users,      "User"],
              [filterAct,  setFilterAct,  actions,    "Action"],
              [filterEnt,  setFilterEnt,  entities,   "Entity"],
              [filterStat, setFilterStat, statuses,   "Status"],
            ].map(([val, set, opts, label]) => (
              <select key={label} className="audit-select" value={val} onChange={e => set(e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
            <button className="secondary-button" style={{fontSize:11,height:30,padding:"0 10px"}}
              onClick={() => { setSearch(""); setFilterUser("All Users"); setFilterAct("All Actions"); setFilterEnt("All Entity Types"); setFilterStat("All Statuses"); setFilterDate("All Dates"); }}
            >Clear</button>
          </div>
        </div>

        {/* Table */}
        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr>
                <th>ID</th><th>Timestamp</th><th>User</th>
                <th>Action</th><th>Entity</th><th>Status</th><th>Notes</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{textAlign:"center",padding:32,color:"var(--muted)"}}>
                  No audit records match the selected filters.
                </td></tr>
              ) : filtered.map(row => {
                const isOpen = expanded === row.id;
                const act = ACTION_COLORS[row.action] || { label: row.action, tone: "neutral" };
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`audit-row ${isOpen ? "open" : ""}`}
                      onClick={() => setExpanded(isOpen ? null : row.id)}
                    >
                      <td><code className="audit-id">{row.id}</code></td>
                      <td><span className="audit-ts">{row.timestamp}</span></td>
                      <td><span className="audit-user">{row.user}</span></td>
                      <td><span className={`badge ${act.tone}`}>{act.label}</span></td>
                      <td>
                        <span className="audit-entity-type">{row.entityType}</span>
                        <span className="audit-entity-id"> · {row.entityId}</span>
                      </td>
                      <td><span className={`badge ${STATUS_TONE[row.status] || "neutral"}`}>{row.status}</span></td>
                      <td className="audit-notes-cell">{row.notes}</td>
                      <td><span className={`wf-chevron ${isOpen ? "open" : ""}`} style={{paddingTop:0}}>›</span></td>
                    </tr>
                    {isOpen && (
                      <tr className="audit-detail-row">
                        <td colSpan={8}>
                          <div className="audit-detail">
                            <div className="audit-detail-grid">
                              {/* State change */}
                              <div className="audit-detail-block">
                                <div className="audit-detail-block-title">State Change</div>
                                <div className="audit-state-row">
                                  <div className="audit-state-box prev">
                                    <span className="audit-state-label">Previous State</span>
                                    <span>{row.prevState ?? <em style={{color:"var(--muted)"}}>None (new entity)</em>}</span>
                                  </div>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                  <div className="audit-state-box curr">
                                    <span className="audit-state-label">Current State</span>
                                    <span>{row.currState}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Related entities */}
                              <div className="audit-detail-block">
                                <div className="audit-detail-block-title">Related Entities</div>
                                <div className="audit-related">
                                  {row.relatedDoc    && <div className="audit-rel-chip doc"    ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:"middle"}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>{row.relatedDoc}</div>}
                                  {row.relatedRule   && <div className="audit-rel-chip rule"   ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:"middle"}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>{row.relatedRule}</div>}
                                  {row.relatedDevice && <div className="audit-rel-chip device" ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:"middle"}}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/></svg>{row.relatedDevice}</div>}
                                  {!row.relatedDoc && !row.relatedRule && !row.relatedDevice &&
                                    <span style={{color:"var(--muted)",fontSize:12}}>No related entities</span>}
                                </div>
                              </div>

                              {/* Event summary */}
                              <div className="audit-detail-block full-width">
                                <div className="audit-detail-block-title">Event Summary</div>
                                <div className="audit-summary-row">
                                  <div className="audit-meta-item"><span>User</span><strong>{row.user}</strong></div>
                                  <div className="audit-meta-item"><span>Action</span><strong>{act.label}</strong></div>
                                  <div className="audit-meta-item"><span>Entity</span><strong>{row.entityType} / {row.entityId}</strong></div>
                                  <div className="audit-meta-item"><span>Timestamp</span><strong>{row.timestamp}</strong></div>
                                </div>
                                <div className="audit-notes-full">{row.notes}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
const ACTIVITY_LOG = [
  { time: "11:11", label: "Remediation planning completed",       type: "success" },
  { time: "11:10", label: "Root cause analysis finished",          type: "success" },
  { time: "11:09", label: "Compliance analysis: 33 violations",    type: "warning" },
  { time: "11:06", label: "Inventory sync: 247 devices loaded",    type: "success" },
  { time: "11:05", label: "Knowledge base updated with 8 rules",   type: "success" },
  { time: "11:03", label: "RC-005 rejected in review queue",       type: "error"   },
  { time: "10:58", label: "RC-001 approved → R-009 created",       type: "success" },
  { time: "09:14", label: "Rule extraction complete — 8 candidates",type: "success" },
  { time: "09:12", label: "5 documents processed successfully",    type: "success" },
  { time: "09:08", label: "Dell_SA_v4.0_ReleaseNotes.pdf uploaded",type: "info"    },
];

const HEALTH_SERVICES = [
  { name: "Document Engine",   status: "Operational",  tone: "success" },
  { name: "Rule Engine",       status: "Operational",  tone: "success" },
  { name: "Compliance Engine", status: "Operational",  tone: "success" },
  { name: "Knowledge Base",    status: "Operational",  tone: "success" },
  { name: "Assistant",         status: "Degraded",     tone: "warning" },
];

function Overview() {
  // -1 = not started, 0..7 = stages completed up to index, 8 = all done
  const [progress, setProgress] = useState(-1);
  const [running,  setRunning]  = useState(false);
  const [expanded, setExpanded] = useState(null);

  const reset = () => { setProgress(-1); setRunning(false); };

  const runPipeline = () => {
    if (running) return;
    setProgress(-1);
    setRunning(true);
    let step = 0;
    const tick = () => {
      setProgress(step);
      step += 1;
      if (step <= workflowStages.length) {
        setTimeout(tick, 900);
      } else {
        setRunning(false);
      }
    };
    setTimeout(tick, 400);
  };

  // Derived stats
  const completedCount = progress >= workflowStages.length ? workflowStages.length
                       : progress >= 0 ? progress : 0;
  const allDone = progress >= workflowStages.length;

  const getStepState = (idx) => {
    if (progress < 0) return "pending";
    if (idx < progress) return "completed";
    if (idx === progress && running) return "running";
    if (idx === progress && !running && progress < workflowStages.length) return "running";
    if (allDone) return "completed";
    return "pending";
  };

  return (
    <div className="overview-wrapper">
      {/* ── Summary metric strip ── */}
      <div className="overview-metrics">
        <OverviewMetric 
          label="Documents Processed" 
          value={allDone ? "5" : completedCount >= 1 ? "5" : "0"} 
          tone={completedCount >= 1 ? "success" : "neutral"} 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} 
        />
        <OverviewMetric 
          label="Rules Extracted" 
          value={allDone ? "8" : completedCount >= 2 ? "8" : "0"} 
          tone={completedCount >= 2 ? "info"    : "neutral"} 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>} 
        />
        <OverviewMetric 
          label="Rules Approved" 
          value={allDone ? "8" : completedCount >= 4 ? "8" : "0"} 
          tone={completedCount >= 4 ? "success" : "neutral"} 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>} 
        />
        <OverviewMetric 
          label="Devices Analyzed" 
          value={allDone ? "247" : completedCount >= 6 ? "247" : "0"} 
          tone={completedCount >= 6 ? "primary" : "neutral"} 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/><line x1="10" y1="6" x2="10.01" y2="6"/><line x1="10" y1="18" x2="10.01" y2="18"/></svg>} 
        />
        <OverviewMetric 
          label="Violations Found" 
          value={allDone ? "33" : completedCount >= 6 ? "33" : "0"} 
          tone={completedCount >= 6 ? "warning" : "neutral"} 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} 
        />
        <OverviewMetric 
          label="Pipeline Stage" 
          value={`${completedCount} / ${workflowStages.length}`} 
          tone="neutral" 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} 
        />
      </div>

      <div className="overview-body">
        {/* ── Workflow timeline ── */}
        <section className="panel overview-timeline-panel">
          <PanelHeader
            title="Workflow Timeline"
            meta={allDone ? `Last run: 18 Jun 2026, 11:11 · Total: 10m 45s` : running ? "Pipeline running…" : "Ready to run"}
          >
            {!running && !allDone && (
              <button className="primary-button" id="run-pipeline-btn" onClick={runPipeline}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Pipeline
              </button>
            )}
            {allDone && (
              <>
                <button className="secondary-button" onClick={reset}>Reset Demo</button>
                <button className="primary-button" id="run-pipeline-btn" onClick={runPipeline}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Re-run Pipeline
                </button>
              </>
            )}
            {running && (
              <button className="secondary-button" disabled style={{ opacity: .6 }}>
                <span className="spinner" style={{ display:"inline-block", marginRight:6, verticalAlign:"middle" }} />
                Running…
              </button>
            )}
          </PanelHeader>

          {/* Overall progress bar */}
          <div className="pipeline-progress-bar">
            <div
              className="pipeline-progress-fill"
              style={{ width: `${(completedCount / workflowStages.length) * 100}%` }}
            />
          </div>

          {/* Vertical stage list */}
          <div className="wf-timeline">
            {workflowStages.map((stage, idx) => {
              const state = getStepState(idx);
              const isExpanded = expanded === idx;
              return (
                <div
                  key={stage.id}
                  className={`wf-stage ${state} ${isExpanded ? "expanded" : ""}`}
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                >
                  {/* Left connector line */}
                  <div className="wf-connector" />

                  {/* Status marker */}
                  <div className={`wf-marker ${state}`}>
                    {state === "completed" && <span className="wf-check">✓</span>}
                    {state === "running"   && <span className="spinner wf-spin" />}
                    {state === "pending"   && <span className="wf-num">{idx + 1}</span>}
                  </div>

                  {/* Content */}
                  <div className="wf-content">
                    <div className="wf-title-row">
                      <strong className="wf-title">{stage.title}</strong>
                      <div className="wf-badges">
                        {state === "completed" && <Badge value="Completed" tone="success" />}
                        {state === "running"   && <Badge value="Running"   tone="warning" />}
                        {state === "pending"   && <Badge value="Pending"   tone="neutral" />}
                        {state === "completed" && (
                          <span className="wf-duration">{stage.duration}</span>
                        )}
                      </div>
                    </div>
                    <span className="wf-desc">{stage.description}</span>

                    {/* Expanded detail */}
                    {isExpanded && state === "completed" && (
                      <div className="wf-detail">
                        <div className="wf-detail-row">
                          <span className="wf-detail-label">Result</span>
                          <span className="wf-detail-value">{stage.detail}</span>
                        </div>
                        <div className="wf-detail-row">
                          <span className="wf-detail-label">Completed</span>
                          <span className="wf-detail-value">{stage.timestamp}</span>
                        </div>
                        <div className="wf-detail-row">
                          <span className="wf-detail-label">Duration</span>
                          <span className="wf-detail-value">{stage.duration}</span>
                        </div>
                      </div>
                    )}
                    {isExpanded && state !== "completed" && (
                      <div className="wf-detail pending-detail">
                        This stage will start automatically after the previous stage completes.
                      </div>
                    )}
                  </div>

                  {/* Expand chevron */}
                  <span className={`wf-chevron ${isExpanded ? "open" : ""}`}>›</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Right column ── */}
        <div className="overview-right">
          {/* Recent Activity */}
          <section className="panel">
            <PanelHeader title="Recent Activity" meta={`${ACTIVITY_LOG.length} events`} />
            <div className="activity-feed">
              {ACTIVITY_LOG.map((entry, i) => (
                <div key={i} className="activity-entry">
                  <span className={`activity-dot ${entry.type}`} />
                  <div className="activity-text">
                    <span>{entry.label}</span>
                    <time>{entry.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System Health */}
          <section className="panel">
            <PanelHeader title="System Health" meta="Service status" />
            <div className="health-list">
              {HEALTH_SERVICES.map((svc) => (
                <div className="health-row" key={svc.name}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{svc.name}</span>
                  <Badge value={svc.status} tone={svc.tone} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewMetric({ label, value, tone, icon }) {
  const colors = {
    success: { text: "var(--success)", bg: "var(--success-bg)", border: "var(--success-bd)" },
    info:    { text: "var(--primary-light)", bg: "var(--info-bg)", border: "var(--info-bd)" },
    warning: { text: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-bd)" },
    primary: { text: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    neutral: { text: "var(--muted)", bg: "var(--surface-2)", border: "var(--border)" },
  };

  const theme = colors[tone] || colors.neutral;

  return (
    <div className="ov-metric" style={{ borderColor: theme.border }}>
      <div className="ov-metric-icon-box" style={{ color: theme.text, backgroundColor: theme.bg }}>
        {icon}
      </div>
      <div>
        <div className="ov-metric-value" style={{ color: theme.text }}>{value}</div>
        <div className="ov-metric-label">{label}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Demo seed data (pre-loaded so all tabs are populated)
// ─────────────────────────────────────────────
const DEMO_DOCUMENTS = [
  { id: "DOC-001", name: "Dell_ReleaseNotes_v6.4.pdf",      vendor: "Dell", type: "Release Notes",   uploadDate: "18 Jun 2026", status: "rules_extracted" },
  { id: "DOC-002", name: "Dell_OME_v10.1.pdf",              vendor: "Dell", type: "Admin Guide",     uploadDate: "17 Jun 2026", status: "rules_extracted" },
  { id: "DOC-003", name: "Dell_iSM_v5.3.pdf",              vendor: "Dell", type: "Release Notes",   uploadDate: "16 Jun 2026", status: "approved"       },
  { id: "DOC-004", name: "Dell_NetworkDriver_v22.pdf",       vendor: "Dell", type: "Driver Guide",   uploadDate: "15 Jun 2026", status: "completed"      },
  { id: "DOC-005", name: "Dell_SA_v4.0_ReleaseNotes.pdf",   vendor: "Dell", type: "Release Notes",   uploadDate: "14 Jun 2026", status: "uploaded"       },
];

const DEMO_PROCESSING_STATE = {
  "DOC-001": { step: 5, done: true  },
  "DOC-002": { step: 5, done: true  },
  "DOC-003": { step: 5, done: true  },
  "DOC-004": { step: 5, done: true  },
};

// ─────────────────────────────────────────────
// Documents — top-level tab controller
// ─────────────────────────────────────────────
function Documents() {
  const [section, setSection] = useState("Document Library");
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [processingState, setProcessingState] = useState({});
  const [ruleCandidates, setRuleCandidates] = useState([]);
  const [approvedRules, setApprovedRules] = useState([]);

  const tabs = [
    "Document Library",
    "Processing Workspace",
    "Review Queue",
    "Approved Rules Repository",
  ];

  const navigateTo = (tab, doc) => {
    if (doc) setSelectedDocument(doc);
    setSection(tab);
  };

  const addDocument = (name) => {
    const maxId = documents.reduce((m, d) => Math.max(m, parseInt(d.id.split("-")[1] || 0)), 0);
    const doc = {
      id: `DOC-${String(maxId + 1).padStart(3, "0")}`,
      name: name || "Release Notes.pdf",
      vendor: "Dell",
      type: "Release Notes",
      uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "uploaded",
    };
    setDocuments((prev) => [doc, ...prev]);
    setSelectedDocument(doc);
    return doc;
  };

  const processDocument = (doc) => {
    if (!doc) return;
    const steps = processingSteps.length;
    let currentStep = 0;
    setProcessingState((prev) => ({ ...prev, [doc.id]: { step: 0, done: false } }));
    setDocuments((items) =>
      items.map((d) => (d.id === doc.id ? { ...d, status: "profiled" } : d))
    );
    const advance = () => {
      currentStep += 1;
      if (currentStep >= steps - 1) {
        setProcessingState((prev) => ({ ...prev, [doc.id]: { step: steps - 1, done: true } }));
        setDocuments((items) =>
          items.map((d) => (d.id === doc.id ? { ...d, status: "rules_extracted" } : d))
        );
        if (selectedDocument?.id === doc.id) {
          setSelectedDocument((d) => (d ? { ...d, status: "rules_extracted" } : d));
        }
        setRuleCandidates(MOCK_RULE_CANDIDATES);
      } else {
        setProcessingState((prev) => ({ ...prev, [doc.id]: { step: currentStep, done: false } }));
        const statuses = ["profiled", "profiled", "extracted", "extracted", "rules_extracted"];
        setDocuments((items) =>
          items.map((d) => (d.id === doc.id ? { ...d, status: statuses[currentStep] || "extracted" } : d))
        );
        setTimeout(advance, 900);
      }
    };
    setTimeout(advance, 900);
  };

  const approveRule = (candidateId) => {
    const candidate = ruleCandidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    setRuleCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: "approved" } : c))
    );
    const maxRuleId = approvedRules.reduce((m, r) => Math.max(m, parseInt(r.id.split("-")[1] || 0)), 0);
    const newRule = {
      id: `R-${String(maxRuleId + 1).padStart(3, "0")}`,
      subject: candidate.subject,
      predicate: candidate.predicate,
      object: candidate.object,
      severity: candidate.severity,
      ruleType: candidate.ruleType,
      vendor: "Dell",
      product: "PowerEdge Series",
      approvedDate: new Date().toLocaleDateString("en-CA"),
      document: candidate.document,
      evidence: candidate.evidence,
      affectedDevices: [],
      relatedRules: [],
      dependencies: [],
    };
    setApprovedRules((prev) => [newRule, ...prev]);
  };

  const rejectRule = (candidateId) => {
    setRuleCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: "rejected" } : c))
    );
  };

  const clarifyRule = (candidateId) => {
    setRuleCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: "needs_clarification" } : c))
    );
  };

  const editRuleCandidate = (id, newValues) => {
    setRuleCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...newValues, status: "edited" } : c))
    );
  };

  return (
    <div className="content-stack">
      {/* Sub-navigation tabs */}
      <div className="workspace-tabbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab.replace(/\s+/g, "-").toLowerCase()}`}
            className={section === tab ? "workspace-tab active" : "workspace-tab"}
            onClick={() => setSection(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {section === "Document Library" && (
        <DocumentLibrary
          documents={documents}
          addDocument={addDocument}
          navigateTo={navigateTo}
          setSelectedDocument={setSelectedDocument}
        />
      )}
      {section === "Processing Workspace" && (
        <ProcessingWorkspace
          selectedDocument={selectedDocument}
          processingState={processingState[selectedDocument?.id]}
          processDocument={processDocument}
          navigateTo={navigateTo}
        />
      )}
      {section === "Review Queue" && (
        <ReviewQueue
          candidates={ruleCandidates}
          onApprove={approveRule}
          onReject={rejectRule}
          onClarify={clarifyRule}
          onEdit={editRuleCandidate}
        />
      )}
      {section === "Approved Rules Repository" && (
        <ApprovedRulesRepository rules={approvedRules} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Page 1 — Document Library
// ─────────────────────────────────────────────
function DocumentLibrary({ documents, addDocument, navigateTo, setSelectedDocument }) {
  const [uploadName, setUploadName] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = () => {
    const name = uploadName.trim() || "Dell_Release_Notes_v6.4.pdf";
    addDocument(name);
    setUploadName("");
    setShowUpload(false);
  };

  const handleFilePick = (e) => {
    const file = e.target.files[0];
    if (file) setUploadName(file.name);
  };

  return (
    <div className="content-stack">
      {/* Upload modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} id="upload-modal">
            <div className="modal-header">
              <h2>Upload Release Notes</h2>
              <button className="modal-close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) setUploadName(file.name);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <div className="drop-icon">📄</div>
              <p>{uploadName ? uploadName : "Drop PDF here or click to browse"}</p>
              <span>PDF files only · Max 50 MB</span>
              <input ref={fileRef} type="file" accept=".pdf" hidden onChange={handleFilePick} />
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="primary-button" id="upload-btn" onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      )}

      <section className="panel">
        <PanelHeader
          title="Documents"
          meta={`${documents.length} document${documents.length !== 1 ? "s" : ""} · Central library for uploaded release notes and compatibility documents`}
        >
          <button className="primary-button" id="open-upload-btn" onClick={() => setShowUpload(true)}>
            + Upload Document
          </button>
        </PanelHeader>

        <DataTable
          id="doc-library-table"
          columns={["Document Name", "Vendor", "Document Type", "Upload Date", "Status", "Actions"]}
          rows={documents.map((doc) => [
            <span key={`${doc.id}-name`} style={{ fontWeight: 600 }}>{doc.name}</span>,
            doc.vendor || <span style={{ color: "var(--muted)" }}>—</span>,
            <span key={`${doc.id}-type`} className="type-pill">{doc.type}</span>,
            doc.uploadDate,
            <Badge key={`${doc.id}-s`} value={documentStatusLabels[doc.status]} tone={documentStatusTone[doc.status]} />,
            <div key={`${doc.id}-a`} className="row-actions">
              <button className="link-button" onClick={() => { setSelectedDocument(doc); }}>Open</button>
              <button className="link-button" onClick={() => navigateTo("Processing Workspace", doc)}>View Progress</button>
              <button className="link-button danger">Delete</button>
            </div>,
          ])}
          emptyTitle="No documents uploaded"
          emptyText="Upload a release notes PDF to begin the governance workflow."
        />
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page 2 — Processing Workspace
// ─────────────────────────────────────────────
function ProcessingWorkspace({ selectedDocument, processingState, processDocument, navigateTo }) {
  const step = processingState?.step ?? -1;
  const done = processingState?.done ?? false;
  const hasDoc = !!selectedDocument;
  const canProcess = hasDoc && step === -1;
  const canRetry = hasDoc && (done || step > 0);

  const getStepState = (idx) => {
    if (!hasDoc) return "pending";
    if (done || idx < step) return "completed";
    if (idx === step) return "running";
    return "pending";
  };

  return (
    <section className="panel processing-panel">
      <PanelHeader
        title="Document Processing"
        meta={selectedDocument ? selectedDocument.name : "Select a document from the library to begin"}
      >
        {canProcess && (
          <button className="primary-button" id="process-doc-btn" onClick={() => processDocument(selectedDocument)}>
            Process Document
          </button>
        )}
        {canRetry && (
          <button className="secondary-button" onClick={() => processDocument(selectedDocument)}>
            Retry Processing
          </button>
        )}
        {done && (
          <button
            className="primary-button"
            style={{ background: "var(--success)", borderColor: "var(--success)" }}
            onClick={() => navigateTo("Review Queue")}
          >
            Go to Review Queue →
          </button>
        )}
      </PanelHeader>

      <div className="process-timeline">
        {processingSteps.map((s, idx) => {
          const state = getStepState(idx);
          return (
            <div className={`process-step ${state}`} key={s.label}>
              <div className="process-connector" />
              <div className={`process-marker ${state}`}>
                {state === "completed" ? "✓" : state === "running" ? <span className="spinner" /> : ""}
              </div>
              <div className="process-text">
                <strong>{s.label}</strong>
                <span>{state === "running" ? "In progress…" : state === "completed" ? s.description : "Waiting…"}</span>
              </div>
              <div className="process-state-badge">
                {state === "completed" && <Badge value="Completed" tone="success" />}
                {state === "running" && <Badge value="Running" tone="warning" />}
                {state === "pending" && <Badge value="Pending" tone="neutral" />}
              </div>
            </div>
          );
        })}
      </div>

      {!hasDoc && (
        <div style={{ padding: "0 0 16px" }}>
          <EmptyState
            title="No document selected"
            text="Open a document from the library or upload a new PDF to start processing."
            compact
          />
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// Page 3 — Review Queue
// ─────────────────────────────────────────────
function ReviewQueue({ candidates, onApprove, onReject, onClarify, onEdit }) {
  const [activeFilter, setActiveFilter] = useState("Pending Review");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({});

  const filterMap = {
    "Pending Review": "pending_review",
    "Needs Clarification": "needs_clarification",
    "Edited": "edited",
    "Rejected": "rejected",
  };

  const filtered = candidates.filter((c) => c.status === filterMap[activeFilter]);

  const selectCandidate = (c) => {
    setSelectedCandidate(c);
    setEditMode(false);
    setEditValues({ subject: c.subject, predicate: c.predicate, object: c.object, severity: c.severity });
  };

  const handleApprove = () => {
    if (!selectedCandidate) return;
    onApprove(selectedCandidate.id);
    setSelectedCandidate(null);
  };

  const handleReject = () => {
    if (!selectedCandidate) return;
    onReject(selectedCandidate.id);
    setSelectedCandidate(null);
  };

  const handleClarify = () => {
    if (!selectedCandidate) return;
    onClarify(selectedCandidate.id);
    setSelectedCandidate(null);
  };

  const pendingCount = candidates.filter((c) => c.status === "pending_review").length;

  const approveAll = () => {
    filtered.forEach((c) => onApprove(c.id));
    setSelectedCandidate(null);
  };

  const rejectAll = () => {
    filtered.forEach((c) => onReject(c.id));
    setSelectedCandidate(null);
  };

  return (
    <div className="content-stack">
      {/* Queue table */}
      <section className="panel">
        <PanelHeader
          title="Review Queue"
          meta={`${pendingCount} candidate${pendingCount !== 1 ? "s" : ""} pending review · Human validation before rules enter the knowledge base`}
        >
          {filtered.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className="primary-button" 
                style={{ background: "var(--success)" }} 
                onClick={approveAll}
              >
                ✓ Approve All ({filtered.length})
              </button>
              <button 
                className="secondary-button" 
                style={{ color: "var(--error)", borderColor: "var(--error-bd)" }} 
                onClick={rejectAll}
              >
                ✕ Reject All ({filtered.length})
              </button>
            </div>
          )}
        </PanelHeader>
        <Toolbar
          filters={["Pending Review", "Needs Clarification", "Edited", "Rejected"]}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          placeholder="Search review queue"
        />
        <DataTable
          id="review-queue-table"
          columns={["Candidate ID", "Rule Type", "Severity", "Confidence", "Review Status"]}
          rows={filtered.map((c) => [
            <button key={c.id} className="link-button candidate-id" onClick={() => selectCandidate(c)}>
              {c.id}
            </button>,
            c.ruleType,
            <SeverityBadge key={`${c.id}-sev`} value={c.severity} />,
            <ConfidenceBar key={`${c.id}-conf`} value={c.confidence} />,
            <StatusPill key={`${c.id}-stat`} value={c.status} />,
          ])}
          emptyTitle={candidates.length === 0 ? "No rules ready for review" : "No candidates in this filter"}
          emptyText={candidates.length === 0
            ? "Process a document to generate reviewable rule candidates."
            : "Switch filter to see candidates in other states."}
        />
      </section>

      {/* Evidence + Rule side-by-side */}
      <div className="review-grid">
        {/* Evidence panel */}
        <section className="panel">
          <PanelHeader title="Source Evidence" meta={selectedCandidate ? `${selectedCandidate.document}` : "No candidate selected"} />
          <div className="evidence-panel">
            {selectedCandidate ? (
              <>
                <div className="evidence-meta-row">
                  <Field label="Document" value={selectedCandidate.document} />
                  <Field label="Page" value={selectedCandidate.page} />
                  <Field label="Section" value={selectedCandidate.section} />
                </div>
                <div className="evidence-quote">
                  <span className="quote-mark">"</span>
                  {selectedCandidate.evidence}
                  <span className="quote-mark">"</span>
                </div>
              </>
            ) : (
              <EmptyState
                title="Select a candidate"
                text="Click any row in the queue above to review its source evidence and extracted rule side-by-side."
                compact
              />
            )}
          </div>
        </section>

        {/* Rule panel */}
        <section className="panel">
          <PanelHeader title="Extracted Rule" meta={selectedCandidate ? `Candidate ${selectedCandidate.id}` : "Rule Candidate"} />
          <div className="rule-panel">
            {selectedCandidate ? (
              editMode ? (
                <div className="edit-form">
                  {["subject", "predicate", "object", "severity"].map((field) => (
                    <div className="edit-field" key={field}>
                      <label htmlFor={`edit-${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        id={`edit-${field}`}
                        value={editValues[field]}
                        onChange={(e) => setEditValues((v) => ({ ...v, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="review-actions" style={{ display: "flex", gap: "8px" }}>
                    <button 
                      className="primary-button" 
                      style={{ flex: 1 }}
                      onClick={() => { 
                        onEdit(selectedCandidate.id, editValues); 
                        setEditMode(false); 
                        setSelectedCandidate(null); 
                      }}
                    >
                      Save Changes
                    </button>
                    <button className="secondary-button" style={{ flex: 1 }} onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rule-fields">
                    <RuleField label="Subject" value={selectedCandidate.subject} highlight />
                    <RuleField label="Predicate" value={selectedCandidate.predicate} />
                    <RuleField label="Object" value={selectedCandidate.object} highlight />
                    <RuleField label="Severity" value={<SeverityBadge value={selectedCandidate.severity} />} />
                    <RuleField label="Confidence" value={<ConfidenceBar value={selectedCandidate.confidence} showLabel />} />
                  </div>
                  <div className="review-actions" style={{ display: "flex", gap: "8px" }}>
                    <button className="primary-button" style={{ flex: 1 }} onClick={() => setEditMode(true)}>✏ Edit Rule</button>
                    <button className="secondary-button" style={{ flex: 1 }} onClick={handleClarify}>? Needs Review</button>
                  </div>
                </>
              )
            ) : (
              <EmptyState
                title="No rule selected"
                text="Select a candidate from the queue to see the extracted rule and take a review action."
                compact
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page 4 — Approved Rules Repository
// ─────────────────────────────────────────────
function ApprovedRulesRepository({ rules }) {
  const [selectedRule, setSelectedRule] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ vendor: "All", severity: "All", type: "All" });

  const filtered = rules.filter((r) => {
    if (activeFilters.vendor !== "All" && r.vendor !== activeFilters.vendor) return false;
    if (activeFilters.severity !== "All" && r.severity !== activeFilters.severity) return false;
    if (activeFilters.type !== "All" && r.ruleType !== activeFilters.type) return false;
    return true;
  });

  return (
    <div className="split-layout">
      <section className="panel">
        <PanelHeader
          title="Approved Rules"
          meta={`${rules.length} rule${rules.length !== 1 ? "s" : ""} · Official source of truth for compliance, inventory validation, and the knowledge graph`}
        />
        {/* Filter bar */}
        <div className="filter-bar">
          <FilterSelect label="Vendor" value={activeFilters.vendor}
            options={["All", ...new Set(rules.map((r) => r.vendor))]}
            onChange={(v) => setActiveFilters((f) => ({ ...f, vendor: v }))}
          />
          <FilterSelect label="Severity" value={activeFilters.severity}
            options={["All", "Critical", "High", "Medium", "Low"]}
            onChange={(v) => setActiveFilters((f) => ({ ...f, severity: v }))}
          />
          <FilterSelect label="Rule Type" value={activeFilters.type}
            options={["All", "Dependency", "Exclusion", "Recommendation"]}
            onChange={(v) => setActiveFilters((f) => ({ ...f, type: v }))}
          />
        </div>
        <DataTable
          id="approved-rules-table"
          columns={["Rule ID", "Subject", "Predicate", "Object", "Severity", "Approved Date"]}
          rows={filtered.map((r) => [
            <button key={r.id} className="link-button rule-id" onClick={() => setSelectedRule(r)}>
              {r.id}
            </button>,
            <span key={`${r.id}-sub`} style={{ fontWeight: 600 }}>{r.subject}</span>,
            <span key={`${r.id}-pred`} className="predicate-pill">{r.predicate}</span>,
            r.object,
            <SeverityBadge key={`${r.id}-sev`} value={r.severity} />,
            r.approvedDate,
          ])}
          emptyTitle="No approved rules"
          emptyText="Approved rules will appear here after review decisions are completed."
        />
      </section>

      {/* Detail drawer */}
      <aside className="detail-panel open" style={{ top: 90 }}>
        <div className="drawer-content">
          <PanelHeader title="Rule Detail" meta={selectedRule ? selectedRule.id : "No rule selected"} />
          {selectedRule ? (
            <div className="drawer-sections">
              <DrawerSection title="Rule Information">
                <Field label="Subject" value={selectedRule.subject} />
                <Field label="Predicate" value={selectedRule.predicate} />
                <Field label="Object" value={selectedRule.object} />
                <Field label="Severity" value={<SeverityBadge value={selectedRule.severity} />} />
                <Field label="Type" value={selectedRule.ruleType} />
                <Field label="Vendor" value={selectedRule.vendor} />
                <Field label="Product" value={selectedRule.product} />
              </DrawerSection>
              <DrawerSection title="Source Document">
                <Field label="Document" value={selectedRule.document} />
                <Field label="Approved" value={selectedRule.approvedDate} />
              </DrawerSection>
              <DrawerSection title="Source Evidence">
                <div className="evidence-quote compact">{selectedRule.evidence}</div>
              </DrawerSection>
              <DrawerSection title="Dependencies">
                {selectedRule.dependencies.length > 0
                  ? selectedRule.dependencies.map((d) => <div key={d} className="dep-chip">{d}</div>)
                  : <span style={{ color: "var(--muted)", fontSize: 12 }}>None recorded</span>}
              </DrawerSection>
              <DrawerSection title="Related Rules">
                {selectedRule.relatedRules.length > 0
                  ? selectedRule.relatedRules.map((r) => <span key={r} className="dep-chip">{r}</span>)
                  : <span style={{ color: "var(--muted)", fontSize: 12 }}>None</span>}
              </DrawerSection>
              <DrawerSection title="Affected Devices">
                {selectedRule.affectedDevices.length > 0
                  ? selectedRule.affectedDevices.map((d) => <div key={d} className="dep-chip device">{d}</div>)
                  : <span style={{ color: "var(--muted)", fontSize: 12 }}>None linked</span>}
              </DrawerSection>
            </div>
          ) : (
            <EmptyState title="No rule selected" text="Click a Rule ID in the table to view detailed information." compact />
          )}
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────
// Other top-level pages (unchanged structure)
// ─────────────────────────────────────────────
const MOCK_DEVICES = [
  { hostname: "srv-pe-r750-01", manufacturer: "Dell", bios: "1.4.8", firmware: "8.2.0", os: "RedHat Enterprise Linux 8.6", status: "Compliant" },
  { hostname: "srv-pe-r650-02", manufacturer: "Dell", bios: "6.4.0", firmware: "8.1.1", os: "VMware ESXi 7.0 U3", status: "At Risk" },
  { hostname: "srv-pe-r740-03", manufacturer: "Dell", bios: "2.12.0", firmware: "7.0.2", os: "Windows Server 2019", status: "Compliant" },
  { hostname: "srv-pe-r750-04", manufacturer: "Dell", bios: "1.3.1", firmware: "8.0.0", os: "RedHat Enterprise Linux 9.0", status: "Review" },
  { hostname: "srv-pe-r740xd-05", manufacturer: "Dell", bios: "2.11.2", firmware: "6.8.0", os: "Ubuntu Server 20.04", status: "At Risk" },
  { hostname: "srv-pe-r940-06", manufacturer: "Dell", bios: "2.14.0", firmware: "7.1.0", os: "Windows Server 2022", status: "Compliant" },
];

function Inventory({ dbUrl }) {
  const [filter, setFilter] = useState("All Devices");
  const [search, setSearch] = useState("");
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);

  const filtered = MOCK_DEVICES.filter(d => {
    if (filter !== "All Devices" && d.status !== filter) return false;
    if (search && !d.hostname.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeDevices = dbUrl ? filtered : [];
  const selectedDevice = dbUrl ? activeDevices[selectedDeviceIndex] : null;

  return (
    <div className="content-stack">
      <section className="panel">
        <PanelHeader title="Device Inventory" meta="Enterprise host inventory synchronized from PostgreSQL">
          <button className="secondary-button" onClick={() => { setFilter("All Devices"); setSearch(""); setSelectedDeviceIndex(0); }}>Reset Filters</button>
        </PanelHeader>
        <Toolbar 
          filters={["All Devices", "Compliant", "At Risk", "Review"]} 
          activeFilter={filter}
          onFilter={(f) => { setFilter(f); setSelectedDeviceIndex(0); }}
          placeholder="Search devices by hostname…" 
          searchQuery={search}
          onSearch={(s) => { setSearch(s); setSelectedDeviceIndex(0); }}
        />
        <DataTable
          columns={["Hostname", "Manufacturer", "BIOS", "Firmware", "Operating System", "Status"]}
          rows={activeDevices.map(d => [
            d.hostname,
            d.manufacturer,
            d.bios,
            d.firmware,
            d.os,
            <Badge value={d.status} tone={d.status === "Compliant" ? "success" : d.status === "At Risk" ? "warning" : "info"} />
          ])}
          emptyTitle={dbUrl ? "No devices found" : "No database connected"}
          emptyText={dbUrl ? "No devices match the active search and filter criteria." : "Connect a PostgreSQL database via the top-right button to synchronize host inventory."}
          onRowClick={(row, ri) => setSelectedDeviceIndex(ri)}
          selectedRowIndex={dbUrl ? selectedDeviceIndex : -1}
        />
      </section>
      <section className="panel">
        <PanelHeader title="Device Detail View" meta={selectedDevice ? `Inspecting ${selectedDevice.hostname}` : "Select a device to inspect component details"} />
        <div className="detail-grid" style={{ padding: 16 }}>
          {selectedDevice ? (
            <>
              <div className="metric-card">
                <span>Hardware Model</span>
                <strong>Dell PowerEdge R750 Server</strong>
              </div>
              <div className="metric-card">
                <span>System BIOS</span>
                <strong style={{ color: selectedDevice.status === "At Risk" ? "var(--warning)" : "var(--text)" }}>
                  {selectedDevice.bios} {selectedDevice.status === "At Risk" && " (Upgrade Needed)"}
                </strong>
              </div>
              <div className="metric-card">
                <span>iDRAC Firmware</span>
                <strong>{selectedDevice.firmware}</strong>
              </div>
              <div className="metric-card">
                <span>Network Driver</span>
                <strong>Intel 10GbE v22.3.1</strong>
              </div>
              <div className="metric-card">
                <span>Security Integrity</span>
                <strong style={{ color: "var(--success)" }}>Verified Secure</strong>
              </div>
              <div className="metric-card">
                <span>Scan History</span>
                <strong>Today at 14:10 PM</strong>
              </div>
            </>
          ) : (
            ["Hardware", "BIOS", "Firmware", "Drivers", "Security Agents", "Compliance History"].map((item) => (
              <div className="metric-card" key={item}>
                <span>{item}</span>
                <strong>—</strong>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Compliance({ analysisRun, setAnalysisRun }) {
  const [running, setRunning] = useState(false);

  const triggerAnalysis = () => {
    if (running) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setAnalysisRun(true);
    }, 1500);
  };

  const MOCK_VIOLATIONS = [
    ["srv-pe-r650-02", "R-001: System BIOS v6.4.2", "Critical", "BIOS >= 6.4.2", "BIOS 6.4.0", "Open"],
    ["srv-pe-r650-02", "R-002: iDRAC Validation", "High", "BIOS >= 6.0.0", "BIOS 5.8.2", "Open"],
    ["srv-pe-r750-04", "R-004: PERC Storage Firmware", "Critical", "StorCLI >= 007.19", "StorCLI 007.12", "Open"],
    ["srv-pe-r740xd-05", "R-005: OpenManage Support", "Medium", "OS >= Server 2016", "Server 2012 R2", "Open"]
  ];

  return (
    <div className="content-stack">
      <section className="panel">
        <PanelHeader title="Run Compliance Analysis" meta="Inventory and approved rules are required to execute analysis">
          {!analysisRun && !running && (
            <button className="primary-button" onClick={triggerAnalysis}>Run Compliance Analysis</button>
          )}
          {running && (
            <button className="secondary-button" disabled style={{ opacity: .6 }}>
              <span className="spinner" style={{ display:"inline-block", marginRight:6, verticalAlign:"middle" }} />
              Running Analysis…
            </button>
          )}
          {analysisRun && !running && (
            <>
              <button className="secondary-button" onClick={() => setAnalysisRun(false)}>Reset Analysis</button>
              <button className="primary-button" onClick={triggerAnalysis}>Re-run Analysis</button>
            </>
          )}
        </PanelHeader>
        <div className="summary-grid" style={{ padding: 16 }}>
          <Metric label="Devices Analyzed" value={analysisRun ? "247" : "0"} />
          <Metric label="Compliant" value={analysisRun ? "214" : "0"} />
          <Metric label="Open Violations" value={analysisRun ? "33" : "0"} />
          <Metric label="Rules Applied" value={analysisRun ? "8" : "0"} />
        </div>
      </section>
      <section className="panel">
        <PanelHeader title="Violations Table" meta="Validation results based on active rules" />
        <DataTable
          columns={["Device", "Rule", "Severity", "Expected", "Observed", "Status"]}
          rows={analysisRun ? MOCK_VIOLATIONS.map(v => [
            v[0],
            v[1],
            <SeverityBadge value={v[2]} />,
            <code style={{ background: "var(--surface-2)", padding: "2px 4px", borderRadius: 4 }}>{v[3]}</code>,
            <code style={{ background: "var(--error-bg)", color: "var(--error)", padding: "2px 4px", borderRadius: 4 }}>{v[4]}</code>,
            <Badge value={v[5]} tone="error" />
          ]) : []}
          emptyTitle="No violations found"
          emptyText="Run compliance analysis to populate validation results."
        />
      </section>
    </div>
  );
}

function Analysis({ analysisRun }) {
  return (
    <div className="page-grid">
      <section className="panel span-8">
        <PanelHeader title="Dependency Chain Visualization" meta="Root cause paths and dependent version requirements" />
        {analysisRun ? (
          <div className="dependency-chain-container">
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: "var(--text)" }}>Violation Path 1: System BIOS Version Mismatch</div>
            <div className="dependency-chain-flow">
              <div className="dependency-node" style={{ borderLeftColor: "var(--error)" }}>
                <span className="dependency-node-title">Device Host</span>
                <span className="dependency-node-value">srv-pe-r650-02</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--warning)" }}>
                <span className="dependency-node-title">Component</span>
                <span className="dependency-node-value">System BIOS v6.4.0</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--muted)" }}>
                <span className="dependency-node-title">Active Rule</span>
                <span className="dependency-node-value" style={{ textDecoration: "line-through", color: "var(--muted)" }}>R-001 (Req &gt;= 6.4.2)</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--primary-light)" }}>
                <span className="dependency-node-title">Required By</span>
                <span className="dependency-node-value">iDRAC v8.2.0 Firmware</span>
              </div>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, marginTop: 14, color: "var(--text)" }}>Violation Path 2: Storage Utility Version Mismatch</div>
            <div className="dependency-chain-flow">
              <div className="dependency-node" style={{ borderLeftColor: "var(--error)" }}>
                <span className="dependency-node-title">Device Host</span>
                <span className="dependency-node-value">srv-pe-r750-04</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--warning)" }}>
                <span className="dependency-node-title">Component</span>
                <span className="dependency-node-value">StorCLI Utility v007.12</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--muted)" }}>
                <span className="dependency-node-title">Active Rule</span>
                <span className="dependency-node-value" style={{ textDecoration: "line-through", color: "var(--muted)" }}>R-004 (Req &gt;= 007.19)</span>
              </div>
              <div className="dependency-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div className="dependency-node" style={{ borderLeftColor: "var(--primary-light)" }}>
                <span className="dependency-node-title">Required By</span>
                <span className="dependency-node-value">PERC H755 Storage Card</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="No dependency chain available" text="Run compliance analysis and root cause analysis to generate device-to-rule tracebacks." />
        )}
      </section>

      <section className="panel span-4">
        <PanelHeader title="Impact Analysis" meta="Aggregated impact of detected conflicts" />
        <div style={{ padding: 16 }}>
          <Metric label="Impacted Devices" value={analysisRun ? "33" : "0"} />
          <Metric label="Dependent Rules" value={analysisRun ? "3" : "0"} />
          <Metric label="Estimated Remediation" value={analysisRun ? "6.5 hours" : "0 hours"} />
        </div>
      </section>

      <section className="panel span-6">
        <PanelHeader title="Rule Traceback" meta="Source release notes and citation trace" />
        {analysisRun ? (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: "var(--muted)" }}>Cited Document</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--primary)" }}>Dell_ReleaseNotes_v6.4.pdf (Page 4, Section 3)</div>
            
            <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: "var(--muted)", marginTop: 8 }}>Text Evidence</div>
            <blockquote style={{ margin: 0, padding: "8px 12px", borderLeft: "3px solid var(--primary-light)", background: "var(--surface-2)", fontSize: 12.5, fontStyle: "italic", lineHeight: 1.5, color: "var(--secondary)" }}>
              "System BIOS 6.4.2 requires System Firmware 8.2.0 or later to ensure platform stability and feature compatibility across all PowerEdge R-series platforms."
            </blockquote>
          </div>
        ) : (
          <EmptyState title="No traceback selected" text="Select a compliance finding to inspect source document and chunk lineage." compact />
        )}
      </section>

      <section className="panel span-6">
        <PanelHeader title="Knowledge Graph View" meta="Connected entities and constraints in compliance knowledge base" />
        <div className="graph-visualization" style={{ padding: "16px 20px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "185px", background: "var(--surface)", position: "relative" }}>
          {analysisRun ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: "500px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ padding: "6px 10px", background: "var(--info-bg)", border: "1px solid var(--info-bd)", borderRadius: "6px", textAlign: "center", flex: 1, marginRight: 8 }}>
                  <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Telemetry</div>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--primary)" }}>System BIOS / iDRAC</div>
                </div>
                <div style={{ padding: "6px 10px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "6px", textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Inventory</div>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#7c3aed" }}>247 Scanned Hosts</div>
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "10px", background: "var(--success-bg)", border: "1px solid var(--success-bd)", borderRadius: "8px", position: "relative" }}>
                <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Central Rules Repository</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--success)" }}>8 Active Compliance Rules</div>
                
                {/* Connecting lines indicators */}
                <div style={{ position: "absolute", top: "-18px", left: "25%", borderLeft: "2px dashed var(--border)", height: "18px" }} />
                <div style={{ position: "absolute", top: "-18px", right: "25%", borderLeft: "2px dashed var(--border)", height: "18px" }} />
                <div style={{ position: "absolute", bottom: "-18px", left: "50%", borderLeft: "2px dashed var(--border)", height: "18px" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "6px 10px", background: "var(--error-bg)", border: "1px solid var(--error-bd)", borderRadius: "6px", textAlign: "center", width: "70%" }}>
                  <div style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>Compliance Output</div>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--error)" }}>33 Out-of-Spec Version Anomalies</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, width: "100%", justifyContent: "center" }}>
              {["Devices", "Components", "Rules", "Dependencies", "Evidence"].map((node) => (
                <div className="graph-node empty" key={node} style={{ flex: "1 1 80px", minHeight: "50px", border: "1px solid var(--border)", display: "grid", placeItems: "center", borderRadius: "8px" }}>{node}</div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Assistant({ analysisRun }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const suggestedResponses = {
    "Summarize current compliance posture": 
      "Based on the latest compliance analysis run, we scanned **247 devices** against **8 approved rules**.\n\n" +
      "* **Compliant**: 214 devices (86.6%)\n" +
      "* **At Risk/Review**: 33 devices (13.4%)\n\n" +
      "The primary issues are related to Outdated BIOS versions (Rule R-001) on ESXi nodes and PERC H755 utility requirements (Rule R-004).",
    
    "Trace a rule to source evidence":
      "**Rule R-001 (BIOS >= 6.4.2 Requirement) Traceback**:\n\n" +
      "* **Source Document**: `Dell_ReleaseNotes_v6.4.pdf`, Page 4.\n" +
      "* **Evidence Block**: *\"System BIOS 6.4.2 requires System Firmware 8.2.0 or later to ensure platform stability and feature compatibility.\"*\n" +
      "* **Affected Component**: PowerEdge R-Series System BIOS.",

    "List devices with missing data":
      "The compliance scanner detected **2 devices** with incomplete check telemetry:\n\n" +
      "1. `srv-pe-r750-04`: Missing the required StorCLI utility packages required for storage BIOS checks.\n" +
      "2. `srv-pe-r740xd-05`: OpenManage agent service was not responding during inventory sync.",

    "Prepare remediation steps":
      "**Recommended Action Items** (Estimated effort: 6.5 hours):\n\n" +
      "1. **R-001**: Upgrade BIOS on `srv-pe-r650-02` to version `6.4.2` or later.\n" +
      "2. **R-004**: Install StorCLI package `007.1916.0000.0000+` on `srv-pe-r750-04`.\n" +
      "3. **R-005**: Upgrade OS environment on server `srv-pe-r740xd-05` to Windows Server 2016+."
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const responseText = suggestedResponses[text] || 
        `I have received your query: "${text}". Compliance analysis data is active. If you would like to run tracebacks or get specific component metrics, please let me know.`;
      const aiMsg = { sender: "assistant", content: responseText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  // Helper to format the message contents securely
  const formatMessageText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bold bullet with text
      if (line.trim().startsWith("* **")) {
        const match = line.match(/^\*\s*\*\*(.*?)\*\*:(.*)$/);
        if (match) {
          return (
            <li key={idx} style={{ marginLeft: 16, marginBottom: 4, listStyleType: "square", fontSize: "13px" }}>
              <strong>{match[1]}:</strong>{match[2]}
            </li>
          );
        }
        const match2 = line.match(/^\*\s*\*\*(.*?)\*\*(.*)$/);
        if (match2) {
          return (
            <li key={idx} style={{ marginLeft: 16, marginBottom: 4, listStyleType: "square", fontSize: "13px" }}>
              <strong>{match2[1]}</strong>{match2[2]}
            </li>
          );
        }
      }
      // Simple bullet
      if (line.trim().startsWith("* ")) {
        return (
          <li key={idx} style={{ marginLeft: 16, marginBottom: 4, listStyleType: "square", fontSize: "13px" }}>
            {line.trim().substring(2)}
          </li>
        );
      }
      // Numbered bold
      if (/^\d+\.\s+\*\*/.test(line.trim())) {
        const match = line.match(/^(\d+\.\s+)\*\*(.*?)\*\*:(.*)$/);
        if (match) {
          return (
            <div key={idx} style={{ marginLeft: 8, marginBottom: 6, fontSize: "13px" }}>
              <strong>{match[1]}{match[2]}:</strong>{match[3]}
            </div>
          );
        }
        const match2 = line.match(/^(\d+\.\s+)\*\*(.*?)\*\*(.*)$/);
        if (match2) {
          return (
            <div key={idx} style={{ marginLeft: 8, marginBottom: 6, fontSize: "13px" }}>
              <strong>{match[1]}{match[2]}</strong>{match[3]}
            </div>
          );
        }
      }
      // Simple number
      if (/^\d+\.\s+/.test(line.trim())) {
        return (
          <div key={idx} style={{ marginLeft: 8, marginBottom: 6, fontSize: "13px" }}>
            {line.trim()}
          </div>
        );
      }
      // Inline bold
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={idx} style={{ margin: "0 0 8px 0", lineHeight: 1.5, fontSize: "13px" }}>
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: "var(--primary)" }}>{part}</strong> : part)}
          </p>
        );
      }
      return line.trim() ? (
        <p key={idx} style={{ margin: "0 0 8px 0", lineHeight: 1.5, fontSize: "13px" }}>{line}</p>
      ) : <div key={idx} style={{ height: 6 }} />;
    });
  };

  return (
    <div className="split-layout">
      {/* Main Chat Panel */}
      <section className="panel chat-panel" style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
        <PanelHeader 
          title="Compliance Copilot AI" 
          meta={analysisRun ? "Knowledge index active • 8 rules loaded" : "Database offline • Connect source database"} 
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge success" style={{ height: 24, fontSize: 10.5 }}>
              <span className="status-dot success-dot" style={{ width: 6, height: 6, marginRight: 6 }} />
              On-Prem LLM
            </span>
          </div>
        </PanelHeader>
        
        {/* Chat History View */}
        <div className="chat-history-scrollable" style={{ flex: 1, overflowY: "auto" }}>
          {messages.length === 0 ? (
            <div className="assistant-welcome-container">
              <div className="assistant-welcome-header">
                <h3>CompatIQ Secure Copilot</h3>
                <p>An on-prem compliance reasoning assistant linked to active rule evidence, PDF specifications, and server configuration databases. Query compatibility status or extract remediation steps below.</p>
              </div>
              
              <div className="assistant-features-grid">
                <div className="assistant-feature-card">
                  <div className="assistant-feature-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Rule Validation
                  </div>
                  <div className="assistant-feature-card-desc">Ask how specific BIOS/firmware specifications impact the ESXi or R-series nodes.</div>
                </div>
                <div className="assistant-feature-card">
                  <div className="assistant-feature-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Evidence Retrieval
                  </div>
                  <div className="assistant-feature-card-desc">Trace compliance rule origins directly back to indexed release notes and PDF evidence chunks.</div>
                </div>
                <div className="assistant-feature-card">
                  <div className="assistant-feature-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Patch Remediation
                  </div>
                  <div className="assistant-feature-card-desc">Request step-by-step upgrade procedures, StorCLI installs, and labor effort estimates.</div>
                </div>
              </div>
              
              <div style={{ marginTop: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>
                  Suggested Starting Queries
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.keys(suggestedResponses).map((prompt) => (
                    <button 
                      className="prompt-button" 
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      disabled={typing}
                      style={{ padding: "6px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--secondary)" }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`chat-message-container ${m.sender}`}>
                <div className="chat-avatar">
                  {m.sender === "user" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/>
                    </svg>
                  )}
                </div>
                
                <div className="chat-bubble-wrapper">
                  <div className="chat-bubble-meta">
                    <strong>{m.sender === "user" ? "Administrator" : "CompatIQ Copilot"}</strong>
                    <span>{m.timestamp}</span>
                  </div>
                  <div className="chat-bubble-content">
                    {m.sender === "user" ? m.content : formatMessageText(m.content)}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {typing && (
            <div className="chat-message-container assistant">
              <div className="chat-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/>
                </svg>
              </div>
              <div className="chat-bubble-wrapper">
                <div className="chat-bubble-meta">
                  <strong>CompatIQ Copilot</strong>
                  <span>Analyzing...</span>
                </div>
                <div className="typing-indicator-dots">
                  <span className="typing-indicator-dot" />
                  <span className="typing-indicator-dot" />
                  <span className="typing-indicator-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts footer (if messages exist) */}
        {messages.length > 0 && (
          <div className="suggested-prompts" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", display: "flex", gap: 8, padding: "10px 20px", overflowX: "auto" }}>
            {Object.keys(suggestedResponses).map((prompt) => (
              <button 
                className="prompt-button" 
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={typing}
                style={{ padding: "4px 8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "var(--secondary)" }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* User message input */}
        <div className="message-input-container">
          <input 
            placeholder="Ask about documents, rules, devices, or compliance results..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            disabled={typing}
          />
          <button 
            className="primary-button" 
            onClick={() => handleSend(inputText)} 
            disabled={typing || !inputText.trim()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px" }}
          >
            Send
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Right Sidebar Info Panel */}
      <aside className="panel detail-panel" style={{ position: "sticky", top: 88, maxHeight: "calc(100vh - 110px)", overflowY: "auto" }}>
        <div className="drawer-sections">
          
          <div className="drawer-section" style={{ background: "#0f172a", color: "#e2e8f0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="drawer-section-title" style={{ background: "rgba(255,255,255,0.02)", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Gemma LLM Reasoning Node
            </div>
            <div className="drawer-section-body" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
                  Gemma 2 (9B Instruction)
                </span>
                <span className="badge" style={{ background: "rgba(37,99,235,0.15)", color: "#60a5fa", borderColor: "rgba(37,99,235,0.3)", fontSize: 9.5, height: 18, padding: "0 6px" }}>
                  LOCAL INT4
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                <div>
                  <div style={{ textTransform: "uppercase", fontSize: 9, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Context Window</div>
                  <div style={{ fontWeight: 600, color: "#cbd5e1" }}>8,192 tokens</div>
                </div>
                <div>
                  <div style={{ textTransform: "uppercase", fontSize: 9, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Temperature</div>
                  <div style={{ fontWeight: 600, color: "#cbd5e1" }}>0.0 (Strict spec)</div>
                </div>
                <div>
                  <div style={{ textTransform: "uppercase", fontSize: 9, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>Precision</div>
                  <div style={{ fontWeight: 600, color: "#cbd5e1" }}>4-bit Q4_K_M</div>
                </div>
                <div>
                  <div style={{ textTransform: "uppercase", fontSize: 9, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>System Prompt</div>
                  <div style={{ fontWeight: 600, color: "#cbd5e1" }}>Dell Compliance v1</div>
                </div>
              </div>
              
              {/* Telemetry metrics bar */}
              <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", marginBottom: 4 }}>
                  <span>Token Generation Rate</span>
                  <span style={{ color: "#cbd5e1", fontWeight: 600 }}>48.5 tok/s</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "78%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-title">Active Knowledge Sources</div>
            <div className="drawer-section-body" style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {analysisRun ? (
                <>
                  <div className="audit-rel-chip doc" style={{ display: "flex", width: "100%", padding: "6px 10px", margin: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Dell_ReleaseNotes_v6.4.pdf
                  </div>
                  <div className="audit-rel-chip rule" style={{ display: "flex", width: "100%", padding: "6px 10px", margin: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
                    </svg>
                    8 Active Compliance Rules
                  </div>
                  <div className="audit-rel-chip device" style={{ display: "flex", width: "100%", padding: "6px 10px", margin: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                    247 Devices Synchronized
                  </div>
                </>
              ) : (
                <span style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", padding: "4px 0" }}>No knowledge index loaded. Connect database and run compliance scan.</span>
              )}
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-title">Environment Statistics</div>
            <div className="drawer-section-body" style={{ padding: "12px 16px" }}>
              <div className="assistant-info-stat-row">
                <span className="assistant-info-stat-label">Total Hosts Scanned</span>
                <span className="assistant-info-stat-val">247</span>
              </div>
              <div className="assistant-info-stat-row">
                <span className="assistant-info-stat-label">Compliant Nodes</span>
                <span className="assistant-info-stat-val" style={{ color: "var(--success)" }}>214 (86.6%)</span>
              </div>
              <div className="assistant-info-stat-row">
                <span className="assistant-info-stat-label">Out of Spec Findings</span>
                <span className="assistant-info-stat-val" style={{ color: "var(--error)" }}>33 (13.4%)</span>
              </div>
              <div className="assistant-info-stat-row">
                <span className="assistant-info-stat-label">Open Compliance Incidents</span>
                <span className="assistant-info-stat-val" style={{ color: "var(--warning)" }}>4 Issues</span>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-title">Operational Tips</div>
            <div className="drawer-section-body" style={{ padding: "12px 16px", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "var(--muted)", lineHeight: 1.45 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--primary-light)", borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                Ask for rules like "remediation steps for ESXi nodes" to get direct tasks list.
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "var(--muted)", lineHeight: 1.45 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--primary-light)", borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                Ask about "source evidence for Rule R-001" to audit the specific document origin details.
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "var(--muted)", lineHeight: 1.45 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--primary-light)", borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                Verify device model ranges such as PowerEdge H755 or Dell R750 specs directly in the chatbot.
              </div>
            </div>
          </div>
          
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared Components
// ─────────────────────────────────────────────
function PanelHeader({ title, meta, children }) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        {meta && <p>{meta}</p>}
      </div>
      {children && <div className="panel-actions">{children}</div>}
    </div>
  );
}

function Badge({ value, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{value}</span>;
}

function SeverityBadge({ value }) {
  const tone = value === "Critical" ? "error" : value === "High" ? "warning" : value === "Medium" ? "info" : "neutral";
  return <Badge value={value} tone={tone} />;
}

function StatusPill({ value }) {
  const labels = {
    pending_review: "Pending Review",
    needs_clarification: "Needs Clarification",
    edited: "Edited",
    rejected: "Rejected",
    approved: "Approved",
  };
  const tones = {
    pending_review: "warning",
    needs_clarification: "info",
    edited: "info",
    rejected: "error",
    approved: "success",
  };
  return <Badge value={labels[value] || value} tone={tones[value] || "neutral"} />;
}

function ConfidenceBar({ value, showLabel }) {
  const color = value >= 90 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--error)";
  return (
    <div className="confidence-wrap">
      <div className="confidence-bar">
        <div className="confidence-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: 12 }}>{value}%</span>
    </div>
  );
}

function Toolbar({ filters, activeFilter, onFilter, placeholder, searchQuery, onSearch }) {
  return (
    <div className="toolbar">
      <input 
        placeholder={placeholder} 
        value={searchQuery || ""} 
        onChange={(e) => onSearch?.(e.target.value)} 
      />
      <div className="filter-row">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter ? "filter-button active" : "filter-button"}
            key={filter}
            onClick={() => onFilter?.(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="filter-select-wrap">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="filter-select">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function DataTable({ id, columns, rows = [], emptyTitle, emptyText, onRowClick, selectedRowIndex }) {
  return (
    <div className="table-wrap" id={id}>
      <table>
        <thead>
          <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, ri) => (
              <tr 
                key={ri} 
                onClick={() => onRowClick && onRowClick(row, ri)} 
                className={selectedRowIndex === ri ? "selected-row" : ""}
                style={onRowClick ? { cursor: "pointer" } : {}}
              >
                {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} text={emptyText} compact />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
    </div>
  );
}

function RuleField({ label, value, highlight }) {
  return (
    <div className={`rule-field-row ${highlight ? "highlight" : ""}`}>
      <span className="rule-field-label">{label}</span>
      <span className="rule-field-value">{value}</span>
    </div>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div className="drawer-section">
      <div className="drawer-section-title">{title}</div>
      <div className="drawer-section-body">{children}</div>
    </div>
  );
}

function DetailPanel({ title, children }) {
  return (
    <aside className="detail-panel open">
      <div className="drawer-content">
        <PanelHeader title={title} meta="No record selected" />
        {children}
      </div>
    </aside>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ title, text, compact = false }) {
  return (
    <div className={compact ? "empty-state compact" : "empty-state"}>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default App;
