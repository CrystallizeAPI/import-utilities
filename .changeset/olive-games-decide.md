---
'@crystallize/import-utilities': minor
---

Support fileName for media input. This allows you to define what the final fileName for an image should be, instead of just using the source image url. Example json spec:

```
{
  "items": [
    ...
      "images": [
        {
          "src": "https://example.com/some-file.jpg",
          "fileName": "my-own-name-here.jpg"
        }
      ]
    ...
  ]
}
```
