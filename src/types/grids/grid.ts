export interface GridColumnLayout {
  rowspan: number
  colspan: number
}

export interface GridColumn {
  itemId: string
  layout: GridColumnLayout
}

export interface GridRow {
  columns: GridColumn[]
}

export interface Grid {
  id: string
  name: string
  rows: GridRow[]
}
