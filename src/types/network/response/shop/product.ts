export interface ShopBrandResponse {
  id: number
  title: string
}

export interface ShopProductResponse {
  id: number
  brand: ShopBrandResponse
  title: string
  description: string
  is_active: boolean
  slug: string
  category: {
    id: number
    title: string
    selector_type: number
  }
  attribute_values: Array<{
    id: number
    attribute: {
      id: number
      title: string
      description: string
    }
    value: string
  }>
  images: ProductImageResponse[]
}


export interface ProductImageResponse {
  id: number
  product: number
  url: string
  is_main: boolean
  description: string
}

// export type CamelizeString<ObjectProperty extends string> =
//     ObjectProperty extends `${infer F}_${infer R}`
//         ? `${F}${Capitalize<CamelizeString<R>>}`
//         : ObjectProperty;
//
//
// export type Camelize<GenericObject> = {
//   [ObjectProperty in keyof GenericObject as CamelizeString<ObjectProperty & string>]:
//   GenericObject[ObjectProperty] extends Array<infer ArrayItem>
//       ? ArrayItem extends Record<string, unknown>
//           ? Array<Camelize<ArrayItem>>
//           : GenericObject[ObjectProperty]
//       : GenericObject[ObjectProperty] extends Record<string, unknown>
//           ? Camelize<GenericObject[ObjectProperty]>
//           : GenericObject[ObjectProperty];
// };

// export const toCamelCase = (str: string) => str.replace(/_([a-z])/g, g => g[1].toUpperCase())
//
// function changeKeys<T extends Record<string, any>>(o: Record<string, any>): T {
//   let origKey, newKey, value
//   const newO: T = {} as T
//   for (origKey in o) {
//     if (o.hasOwnProperty(origKey)) {
//       newKey = toCamelCase(origKey)
//       value = o[origKey]
//       if (value) {
//         if (value.constructor === Object)
//           value = changeKeys(value)
//         else if (value instanceof Array)
//           value = value.map(i => {
//             if (i.constructor === Object)
//               return changeKeys(i)
//             return i
//           })
//       }
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       newO[newKey] = value
//     }
//   }
//   return newO
// }
//
//
// const res: ShopProductResponse = {
//   id: 1,
//   'brand': {
//     'id': 1,
//     'title': 'brand 1',
//   },
//   'title': '16 \u0627\u06cc\u0646\u062c',
//   'description': '',
//   'is_active': false,
//   'slug': '16',
//   'category': {
//     'id': 1,
//     'title': 'category 1',
//     'selector_type': 1,
//   },
//   'attribute_values': [
//     {
//       'id': 1,
//       'attribute': {
//         'id': 1,
//         'title': '\u062a\u0639\u062f\u0627\u062f \u0637\u0628\u0642\u0647',
//         'description': '',
//       },
//       'value': '3',
//     },
//     {
//       'id': 2,
//       'attribute': {
//         'id': 2,
//         'title': '\u0627\u0631\u062a\u0641\u0627\u0639',
//         'description': '',
//       },
//       'value': '20 cm',
//     },
//   ],
// }
//
//
// type CamelizedProductDomain = Camelize<ShopProductResponse>
//
// const d1 = changeKeys<CamelizedProductDomain>(res)
// const a1 = d1.attributeValues[0].attribute.description
