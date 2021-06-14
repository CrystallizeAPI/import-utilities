export interface Language {
  system: boolean
  name: string
  code: string
}

export interface LanguageInputInput {
  name: string
  code: string
}

export interface LanguageInput {
  tenantId: string
  input: LanguageInputInput
}
