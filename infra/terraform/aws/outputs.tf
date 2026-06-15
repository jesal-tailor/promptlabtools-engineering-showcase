output "project_name" {
  description = "Project label for this planning scaffold."
  value       = var.project_name
}

output "environment" {
  description = "Environment label for this planning scaffold."
  value       = var.environment
}

output "placeholder_resources_enabled" {
  description = "Whether placeholder resources are enabled. Should remain false for the public showcase."
  value       = var.create_placeholder_resources
}

output "productionisation_notes" {
  description = "Future architecture notes. These are documentation outputs, not live integrations."
  value       = local.productionisation_notes
}
