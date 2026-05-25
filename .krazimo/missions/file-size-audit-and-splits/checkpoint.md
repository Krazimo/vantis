# Checkpoint — file-size-audit-and-splits

## Status: COMPLETE

## All tasks completed

| # | Files changed | Description |
|---|---|---|
| 1 | govern/scanner/ | ScannerQueue + ScannerAssessment + scanner.data |
| 2 | govern/projects/[id]/ | FinancialTab + ActionsTab + QPRTab |
| 3 | govern/notices/ | NoticeForm + NoticePreview + notices.data + notices.utils |
| 4 | govern/projects/[id]/ | DocumentsTab lazy-loaded |
| 5 | govern/notices/ | — (included in commit 3) |
| 6 | govern/qpr/ | QPRTable + BatchNoticeModal + qpr-tracker.data + qpr-tracker.utils |
| 7 | complaint/file/ | Step1/2/3Form + ComplaintHeader + StepIndicator + SuccessScreen + file-complaint.data |
| 8 | complaint/track/ + govern/layout/ | ComplaintResult + track-complaint.data + SidebarNav + LoginScreen + govern-layout.data |
| 9 | govern/page + predictive/ + risk/ | DistrictPanel + LiveFeeds + PredictiveTable + predictive.data + DeveloperCard + risk.data |
| 10 | homebuyer/ + settings/ + litigation/ + rrc/ | HomebuyerTable + DataFreshnessSection + DemoModeSection + LitigationCard + RRCCard + data files |
| 11 | certificate/[id]/ + developer/[id]/ | VerificationList + certificate.data + DeveloperProjects + developer.data |
| 12 | components/govern/ + components/shared/ | RiskDetailPanel + risk-timeline.data + ChatPanel + chatbot.utils |
| 13 | app/page + project/[id]/ + govern/projects/ | SearchDropdown + portal.data + ScoreBar + QPRDots + ProjectLitigation + project-profile.data + ProjectTable + project-registry.data |
| 14 | govern/complaints/ | ComplaintExpandedDetail extracted from ComplaintsTable |
| 15 | app/page.tsx | Lint fix: unused filterKeys import |

## CI gates
- `bunx tsc --noEmit`: PASS
- `bun lint`: PASS
- `bun run build`: PASS (37/37 routes)
- `bun test`: PASS (2 tests)

## File count
- 0 files over 150 lines in src/app/** and src/components/** (excluding src/components/ui/**)
