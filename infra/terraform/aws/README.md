# AWS Terraform Scaffold

This AWS scaffold demonstrates cloud platform planning. It is not applied by default and is not required for the public-safe demo.

## What It Models

- Static/app hosting option.
- API/runtime service option.
- Logging/monitoring placeholder.
- Secrets Manager placeholder.
- Database placeholder.
- Queue placeholder.

## What It Does Not Do

- It does not include real account IDs.
- It does not include secrets.
- It does not connect to PromptLabTools production systems.
- It does not deploy the current public-safe demo.
- It does not require paid infrastructure unless someone intentionally changes defaults and applies it.

## Safe Review

For interview/review purposes, read the files only:

```bash
ls infra/terraform/aws
```

Do not run `terraform apply` for the public showcase.

## Production Path

A production version would add:

- Environment-specific remote state.
- Protected deployment roles.
- VPC/subnet design.
- Database migrations.
- Observability dashboards.
- Secret rotation.
- CI/CD deployment approvals.
