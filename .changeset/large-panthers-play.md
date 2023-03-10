---
'@crystallize/import-utilities': minor
---

Certain internals in the items area are now running in parallel for the spec creation. This increases the speed of spec creation of items with roughly 40%.

This also introduces an internal load balancing mechanism, which is designed to keep the request counts below the threshold of Crystallize APIs
