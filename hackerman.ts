import { config } from 'dotenv'
config()

import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

async function hackerman() {
  const books: any[] = []

  function handleItem(item: any) {
    if (
      item.shape === 'book' &&
      !item.cataloguePath?.startsWith('/boker/sys')
    ) {
      books.push({
        name: item.name,
        path: item.cataloguePath,
        _tags: (item.topics || []).map((t: any) => ({ name: t.name })),
        defaultVariant: {
          attributes: [],
          sku: item.variants[0].sku,
          name: item.variants[0].name,
          image: {
            url: item.variants[0].images?.[0]?.src,
          },
          price: item.variants[0].price?.default,
        },
      })
    } else {
      item.children?.forEach(handleItem)
    }
  }

  try {
    const jsonSpec = JSON.parse(
      await readFile(resolve(__dirname, './json-spec/books.json'), 'utf-8')
    )

    jsonSpec.items.forEach(handleItem)

    await writeFile(
      resolve(__dirname, './json-spec/books-algolia.json'),
      JSON.stringify(books, null, 1),
      'utf-8'
    )
    console.log('🌟 books-algolia.json 🌟')
  } catch (e) {
    console.log(e)
  }
}

hackerman()
