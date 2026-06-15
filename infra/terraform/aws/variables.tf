variable "aws_region" {
  description = "Placeholder AWS region for future production planning."
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Public-safe project label used for placeholder resource names."
  type        = string
  default     = "promptlabtools-engineering-showcase"
}

variable "environment" {
  description = "Placeholder environment label."
  type        = string
  default     = "planning"
}

variable "create_placeholder_resources" {
  description = "Keep false for the public showcase. Set true only in a private productionisation exercise."
  type        = bool
  default     = false
}
