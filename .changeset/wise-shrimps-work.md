---
'@crystallize/import-utilities': patch
---

Disable config.shapeComponents for now since it will clear component data for in
the catalogue api for existing components, forcing a new publish of items.
Falling back to the default option of "amend".
