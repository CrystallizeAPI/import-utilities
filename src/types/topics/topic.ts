import { TopicChildInput } from './topic.child.input'

export interface TopicInput {
  tenantId: string
  parentId?: string
  name: string
  children?: TopicChildInput[]
}
