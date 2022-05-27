export class InvalidItemRelationShapeIdentifier extends Error {
  constructor(identifier: string) {
    super(identifier)
    this.name = 'InvalidItemRelationShapeIdentifier'
  }
}
