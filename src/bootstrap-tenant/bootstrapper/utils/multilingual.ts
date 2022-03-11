export const translationFieldIdentifier =
  'this is a safe string used for identifying translation fields in the spec'

export function trFactory(language: string) {
  return (value: any, id: string) => ({
    [translationFieldIdentifier]: id,
    [language]: value,
  })
}

export function mergeInTranslations(targetThing: any, sourceThing: any) {
  function handleThing(thing: any) {
    if (Array.isArray(thing)) {
      thing.forEach(handleThing)
    } else if (thing && typeof thing === 'object') {
      try {
        const trId = thing[translationFieldIdentifier]
        if (trId) {
          const target = findInTarget(trId)
          if (target) {
            Object.assign(target, thing)
          }
        } else {
          Object.values(thing).forEach(handleThing)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  function findInTarget(id: string) {
    let found: any = null

    function search(thing: any) {
      if (found) {
        return
      }

      if (Array.isArray(thing)) {
        thing.forEach(search)
      } else if (thing && typeof thing === 'object') {
        try {
          const trId = thing[translationFieldIdentifier]
          if (trId) {
            if (trId === id) {
              found = thing
            }
          } else {
            Object.values(thing).forEach(search)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }

    search(targetThing)

    return found
  }

  handleThing(sourceThing)

  return targetThing
}
