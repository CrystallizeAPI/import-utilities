// import {  shapeTypes } from '../../types/shapes'

export interface Shape {
  type: 'product' | 'document' | 'folder'
}

export interface JsonSpec {
  shapes: Shape[]
}