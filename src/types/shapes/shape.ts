import { Component } from './components/component'

export interface Shape {
  id: string
  name: string
  type: string
  components: Component[]
}
