import { Component } from './components/component'

export interface Shape {
  identifier: string
  name: string
  type: string
  components: Component[]
}
