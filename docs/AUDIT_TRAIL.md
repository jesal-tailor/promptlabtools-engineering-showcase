# Audit Trail

Stage 4 adds deterministic mock audit events for approval decisions.

## Audit Event Design

Audit events are created in `src/lib/approvals/approvalAuditLog.ts`.

Each event includes:

- Audit event id.
- Event type.
- Approval id.
- Run id.
- Step id.
- Previous status.
- New status.
- Decision.
- Workflow action.
- Reviewer comment.
- Mock reviewer identity.
- Timestamp.
- Public-safety note.

## Example

```json
{
  "id": "audit_approval_test_approved",
  "type": "approval_decision_recorded",
  "previousStatus": "pending_review",
  "newStatus": "approved",
  "workflowAction": "continue_workflow"
}
```

## Why It Is Mocked

Real approval audit logs can contain sensitive identity, comments, timestamps, workflow payloads, and operational details. This public repository uses fixture-quality data only.

## Production Differences

A production audit trail would add:

- Durable database writes.
- Immutable or append-only storage.
- Authenticated actor identity.
- Request ids and correlation ids.
- IP/device metadata where appropriate.
- Redaction and retention controls.
- Export and compliance review workflows.
