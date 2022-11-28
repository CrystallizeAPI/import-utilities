---
'@crystallize/import-utilities': minor
---

Handle item components with id "src". This was previously mistaken for a media
item, and an upload was attempted, resulting in the bootstrapper to silently
fail.
