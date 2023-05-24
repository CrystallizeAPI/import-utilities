// function getAllMediaUrls(items: JSONItem[]): string[] {
//   const medias: string[] = []

//   function handleItem(item: any) {
//     if (!item) {
//       return
//     }

//     Object.values(item).forEach((value: any) => {
//       if (!value) {
//         return
//       }

//       if (typeof value === 'object') {
//         // Check for media signature
//         if (
//           'src' in value &&
//           typeof value.src === 'string' &&
//           Boolean(value.src)
//         ) {
//           medias.push(value.src)
//         } else {
//           Object.values(value).forEach(handleItem)
//         }
//       } else if (Array.isArray(value)) {
//         value.forEach(handleItem)
//       }
//     })
//   }

//   items.forEach(handleItem)

//   return medias
// }
