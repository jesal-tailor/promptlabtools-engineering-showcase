# Human Approval Flow

Stage 4 models human approval as a deterministic state machine.

## Approval Statuses

- `pending_review`
- `approved`
- `rejected`
- `needs_changes`
- `completed`
- `archived`

## Approval Decisions

The mock reviewer can choose:

- `approved`
- `rejected`
- `needs_changes`

## State Transitions

```text
pending_review
  | approved
  v
approved

pending_review
  | rejected
  v
rejected

pending_review
  | needs_changes
  v
needs_changes
```

Invalid transitions are rejected. For example, an already approved item cannot be rejected again through the mock decision path.

## Workflow Actions

Approval decisions map to deterministic workflow actions:

| Decision | Workflow action | Behaviour |
| --- | --- | --- |
| `approved` | `continue_workflow` | Generate final mock publish package and append `approval_approved` plus `workflow_completed` trace events |
| `rejected` | `stop_workflow` | Do not generate a final package and append `approval_rejected` plus `workflow_stopped` trace events |
| `needs_changes` | `return_to_drafting` | Do not generate a final package and append `approval_needs_changes` plus `workflow_returned_to_drafting` trace events |

## Public-Safe Boundary

This flow does not persist decisions, notify users, call approval tools, or execute production workflow actions. It returns deterministic mock JSON and UI examples only.

## Production Differences

A production flow would add:

- Login and reviewer identity verification.
- Approval permissions by role and workflow.
- Persistent decision history.
- Comment retention.
- Notification and escalation rules.
- Idempotent decision APIs.
- Server-side enforcement before live side effects.
