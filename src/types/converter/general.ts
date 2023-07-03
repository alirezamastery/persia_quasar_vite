export type CamelizeString<ObjectProperty extends string> =
    ObjectProperty extends `${infer F}_${infer R}`
        ? `${F}${Capitalize<CamelizeString<R>>}`
        : ObjectProperty;


export type Camelize<GenericObject> = {
  [ObjectProperty in keyof GenericObject as CamelizeString<ObjectProperty & string>]:
  GenericObject[ObjectProperty] extends Array<infer ArrayItem>
      ? ArrayItem extends Record<string, unknown>
          ? Array<Camelize<ArrayItem>>
          : GenericObject[ObjectProperty]
      : GenericObject[ObjectProperty] extends Record<string, unknown>
          ? Camelize<GenericObject[ObjectProperty]>
          : GenericObject[ObjectProperty];
};

export const toCamelCase = (str: string) => str.replace(/_([a-z])/g, g => g[1].toUpperCase())
export const toSnakeCase = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase()

export function convertObjKeys<T extends Record<string, any>>(
    obj: Record<string, any>,
    type: 'camel' | 'snake',
): T {
  let origKey, newKey, value
  const newObj: T = {} as T
  for (origKey in obj) {
    if (obj.hasOwnProperty(origKey)) {
      newKey = type === 'camel' ? toCamelCase(origKey) : toSnakeCase(origKey)
      value = obj[origKey]
      if (value) {
        if (value.constructor === Object)
          value = convertObjKeys(value, type)
        else if (value instanceof Array)
          value = value.map(i => {
            if (i.constructor === Object)
              return convertObjKeys(i, type)
            return i
          })
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newObj[newKey] = value
    }
  }
  return newObj
}
