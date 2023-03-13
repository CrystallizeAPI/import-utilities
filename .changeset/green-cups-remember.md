---
'@crystallize/import-utilities': minor
---

`includeDescendantsOfUnpublishedFolders` option for items is introduced to give you the possibility to include published items that are located under an published folders for `bootstrapper.createSpec()`.

This is only useful if you're targeting the `published` version of items. Example:
```
const spec = await bootstrapper.createSpec({
    ...
    items: {
      version: 'published',
      includeDescendantsOfUnpublishedFolders: true,
    }
  })
```

**Beware**
Unpublished folders will appear with an invalid shape identifier in the export, which makes it unsuitable for import. The real value here is if you combine this with another `createSpec` where you target the `current` or `draft` version of items, which together gives the correct image of the current item tree state.
