import { Component } from './components/component'

export interface Shape {
  id?: string
  identifier: string
  name: string
  type: 'document' | 'folder' | 'product'
  components?: Component[]
}
