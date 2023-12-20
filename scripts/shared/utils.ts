export function objectPick<T extends Record<any, any>>(
  obj: T,
  keys: (keyof T)[],
  onRemoval?: (obj: T, key: string, value: any) => void,
): T {
  return Object.fromEntries(
    Array.from(
      Object.entries(obj)
        .filter((i) => {
          if (keys.includes(i[0]))
            return true
          onRemoval?.(obj, ...i)
          return false
        }),
    ),
  ) as T
}
