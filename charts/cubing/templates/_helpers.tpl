{{/*
Labels for a component. Usage:
include "cubing.componentLabels" (dict "context" $ "component" "frontend")
*/}}
{{- define "cubing.componentLabels" -}}
{{ include "cubing.labels" .context }}
app.kubernetes.io/component: {{ .component }}
{{- end }}

{{- define "cubing.componentSelectorLabels" -}}
{{ include "cubing.selectorLabels" .context }}
app.kubernetes.io/component: {{ .component }}
{{- end }}

{{/*
Build the component name from fullName + component. Usage:
include "cubing.componentName" (dict "context" $ "component" "frontend")
*/}}
{{- define "cubing.componentName" -}}
{{- printf "%s-%s" (include "cubing.fullname" .context) .component | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Expand the name of the chart.
*/}}
{{- define "cubing.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "cubing.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cubing.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cubing.labels" -}}
helm.sh/chart: {{ include "cubing.chart" . }}
{{ include "cubing.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "cubing.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cubing.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
