import { ExecutionContext } from 'ava'

export const validateObject = (
  t: ExecutionContext<unknown>,
  actual: any,
  input: any
) => {
  Object.keys(input).map((key: string) => {
    if (typeof input[key] === 'object') {
      return validateObject(t, actual[key] as any, input[key] as any)
    }
    t.is(actual[key], input[key])
  })
}
