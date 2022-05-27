import test from 'ava'
import { Component, Shape } from '../../../types'
import { InvalidItemRelationShapeIdentifier } from '../errors'
import {
  buildComponentConfigInput,
  ComponentConfigInputSettings,
} from './build-component-config-input'

interface testCase {
  name: string
  input: {
    component: Component
    existingShapes?: Shape[]
    isDeferred?: boolean
  }
  expected?: ComponentConfigInputSettings | null
  error?: Error
}

const testCases: testCase[] = [
  {
    name: 'has no config when config is not provided',
    input: {
      component: {
        type: 'itemRelations',
      } as Component,
    },
    expected: null,
  },
  {
    name: 'sets min and max config',
    input: {
      component: {
        type: 'itemRelations',
        config: {
          min: 1,
          max: 3,
        },
      } as Component,
      existingShapes: [],
    },
    expected: {
      config: {
        itemRelations: {
          min: 1,
          max: 3,
        },
      },
    },
  },
  {
    name: 'does not defer update when shapes exist',
    input: {
      component: {
        type: 'itemRelations',
        config: {
          acceptedShapeIdentifiers: ['foo'],
        },
      } as Component,
      existingShapes: [{ identifier: 'foo' } as Shape],
    },
    expected: {
      config: {
        itemRelations: {
          acceptedShapeIdentifiers: ['foo'],
        },
      },
    },
  },
  {
    name: 'defers update when config contains a non-existent shape identifier',
    input: {
      component: {
        type: 'itemRelations',
        config: {
          acceptedShapeIdentifiers: ['foo', 'bar'],
        },
      } as Component,
      existingShapes: [{ identifier: 'bar' } as Shape],
    },
    expected: {
      config: {
        itemRelations: {},
      },
      deferUpdate: true,
    },
  },
  {
    name:
      'throws an error when config contains a non-existent shape identifier and request is already deferred',
    input: {
      component: {
        type: 'itemRelations',
        config: {
          acceptedShapeIdentifiers: ['foo', 'bar'],
        },
      } as Component,
      existingShapes: [{ identifier: 'bar' } as Shape],
      isDeferred: true,
    },
    error: new InvalidItemRelationShapeIdentifier('foo'),
  },
  {
    name:
      'does not throw an error when config contains a shape identifier and request is already deferred',
    input: {
      component: {
        type: 'itemRelations',
        config: {
          acceptedShapeIdentifiers: ['foo', 'bar'],
        },
      } as Component,
      existingShapes: [
        { identifier: 'foo' } as Shape,
        { identifier: 'bar' } as Shape,
      ],
      isDeferred: true,
    },
    expected: {
      config: {
        itemRelations: {
          acceptedShapeIdentifiers: ['foo', 'bar'],
        },
      },
    },
  },
]

testCases.forEach((tc) =>
  test(`${tc.input.component.type} - ${tc.name}`, (t) => {
    try {
      const actual = buildComponentConfigInput(
        tc.input.component,
        tc.input.existingShapes || [],
        tc.input.isDeferred || false
      )
      if (tc.error) {
        t.fail('test case should throw an error')
      }
      t.deepEqual(actual, tc.expected)
    } catch (err) {
      if (!tc.error) {
        return t.fail('test case should not throw an error')
      }
      t.deepEqual(err, tc.error)
    }
  })
)
