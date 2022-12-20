---
'@crystallize/import-utilities': patch
---

Fixed an issue with `bootstrapper.createSpec` with `basePath` being set as it only returned the _first_ matching item. It now returns _all_  items that has a `cataloguePath` that starts with the `basePath`.
