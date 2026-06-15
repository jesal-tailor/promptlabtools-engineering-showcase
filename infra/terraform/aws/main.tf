locals {
  name_prefix = "${var.project_name}-${var.environment}"

  productionisation_notes = {
    app_hosting      = "Future option: Vercel, S3/CloudFront, ECS, App Runner, or equivalent."
    runtime_service  = "Future option: API/runtime service with queue-driven workflow execution."
    logging          = "Future option: central logs, metrics, traces, dashboards, and alerts."
    secrets          = "Future option: secret manager for AI provider keys and integration credentials."
    database         = "Future option: Supabase/Postgres or managed relational database."
    queue            = "Future option: queue for async workflow steps and retries."
    object_storage   = "Future option: object storage for artifacts and trace attachments."
    public_safe_note = "This scaffold is not applied by default and is not required for the public demo."
  }
}

# Placeholder logging resource. Disabled by default.
resource "aws_cloudwatch_log_group" "workflow_runtime" {
  count             = var.create_placeholder_resources ? 1 : 0
  name              = "/${local.name_prefix}/workflow-runtime"
  retention_in_days = 14

  tags = {
    Project     = var.project_name
    Environment = var.environment
    PublicSafe  = "true"
  }
}

# Placeholder queue resource. Disabled by default.
resource "aws_sqs_queue" "workflow_events" {
  count = var.create_placeholder_resources ? 1 : 0
  name  = "${local.name_prefix}-workflow-events"

  tags = {
    Project     = var.project_name
    Environment = var.environment
    PublicSafe  = "true"
  }
}

# Placeholder secret container. No secret value is stored here. Disabled by default.
resource "aws_secretsmanager_secret" "integration_credentials_placeholder" {
  count       = var.create_placeholder_resources ? 1 : 0
  name        = "${local.name_prefix}-integration-credentials-placeholder"
  description = "Placeholder only. Do not store public repo secrets here."

  tags = {
    Project     = var.project_name
    Environment = var.environment
    PublicSafe  = "true"
  }
}

# Placeholder object storage option. Disabled by default.
resource "aws_s3_bucket" "artifact_storage_placeholder" {
  count  = var.create_placeholder_resources ? 1 : 0
  bucket = "${local.name_prefix}-artifacts-placeholder"

  tags = {
    Project     = var.project_name
    Environment = var.environment
    PublicSafe  = "true"
  }
}

# Database and API/runtime service are intentionally documented rather than provisioned here.
# A private production scaffold could add RDS/Supabase, ECS/App Runner/Lambda, VPC networking,
# IAM roles, alarms, dashboards, remote state, and deployment pipelines.
