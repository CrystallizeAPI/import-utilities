export interface Component {
  id: string
  name: string
  type:
    | 'boolean'
    | 'componentChoice'
    | 'contentChunk'
    | 'datetime'
    | 'gridRelations'
    | 'images'
    | 'itemRelations'
    | 'location'
    | 'numeric'
    | 'paragraphCollection'
    | 'propertiesTable'
    | 'richText'
    | 'selection'
    | 'singleLine'
    | 'videos'
  description?: string
  config?: any
}
