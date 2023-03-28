import { JSONItem, JSONFolder } from '../../../json-spec'

export function getOnlyItemsWithPathStartingWith(
  basePath: string,
  allCatalogueItemsForLanguage: JSONItem[]
): JSONItem[] {
  if (basePath === '/') {
    return allCatalogueItemsForLanguage
  }

  const ret: JSONItem[] = []

  let foundExactFolderMatch = false

  function handleLevel(item: JSONItem) {
    if (!foundExactFolderMatch) {
      if (item.cataloguePath?.startsWith(basePath)) {
        if ('children' in item) {
          foundExactFolderMatch = true
        }

        ret.push(item)
      } else {
        const f = item as JSONFolder
        if (f.children) {
          f.children.forEach(handleLevel)
        }
      }
    }
  }

  allCatalogueItemsForLanguage.forEach(handleLevel)

  return ret
}

/**
 * Delete fields from object where the unpublishedFolderFieldIndicator
 * is part of an object. E.g.:
 * "name": {
 *   "en": "__unpublished_folder_indicator",
 *   "no-nb": "Toppmappe (updated)"
 * },
 * ... becomes ...
 * * "name": {
 *   "no-nb": "Toppmappe (updated)"
 * },
 */
export const unpublishedFolderFieldIndicator = '__unpublished_folder_indicator'

export function removeUnpublishedFolderFieldIndicator(
  items: JSONItem[]
): JSONItem[] {
  function handleItem(item: JSONItem): JSONItem {
    // We only need to delete this from the translated fields, "name" for now
    if (typeof item.name === 'object') {
      const filteredName: Record<string, string> = {}

      Object.keys(item.name).forEach((language) => {
        const value = (item.name as Record<string, string>)[language]

        if (value !== unpublishedFolderFieldIndicator) {
          filteredName[language] = value
        }
      })
      item.name = filteredName
    }

    if ('children' in item) {
      item.children = item.children?.map(handleItem)
    }

    return item
  }

  return items.map(handleItem)
}

export function buildPathShouldBeIncludedValidator(basePath = '') {
  return function validate(path: string): {
    thisItem: boolean
    descendants: boolean
  } {
    if (!basePath || basePath === '/') {
      return {
        thisItem: true,
        descendants: true,
      }
    }

    const p = path || ''

    const thisItem = p.startsWith(basePath)

    return {
      thisItem,
      descendants: thisItem || basePath.startsWith(p),
    }
  }
}

export function getItemById(items: JSONItem[], id: string): JSONItem | null {
  let found: JSONItem | null = null

  function search(item: JSONItem) {
    if (!found) {
      if (item.id === id) {
        found = item
      } else {
        if ('children' in item) {
          item.children?.forEach(search)
        }
      }
    }
  }

  items.forEach(search)

  return found
}

export function byTreePosition(a: JSONItem, b: JSONItem) {
  const aP = a.treePosition as number
  const bP = b.treePosition as number

  if (aP > bP) {
    return 1
  }
  if (aP < bP) {
    return -1
  }
  return 0
}
