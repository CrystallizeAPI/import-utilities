export interface VatType {
  name: string
  percent: number
}

export interface VatTypeInputInput {
  tenantId: string
  name: string
  percent: number
}

export interface VatTypeInput {
  input: VatTypeInputInput
}
