declare function store(): Record<string, any>
declare function store(key: `?${string}`): boolean
declare function store(key: string): any
declare function store(key: string, value: string): Store
declare function store(entries: Record<string, any>): Store
declare function store<S extends string>(key: S, callback: (key: S, value: any) => any): Store
declare function store<S extends readonly string[]>(keys: S, callback: (key: S[number], value: any) => any): Store

/** @deprecated Don't pass falsy value in this way. Use `set` instead. */
declare function store(key: string, value: Falsy): Store
type Falsy = null | undefined | 0 | '' | false

declare class Store {
  get(): Record<string, any>
  get(key: `?${string}`): boolean
  get(key: string): any
  get<S extends readonly string[]>(...keys: S): Record<S[number], any>

  set(key: string, value: any): Store
  set(entries: Record<string, any>): Store

  has(key: string): boolean

  remove(key: string): any

  keys(): string[]

  forEach(callback: (key: string, value: any) => void): Store

  search(keyword: string): Record<string, any>

  clear(): Store
}

declare let s: typeof store & Store
export default s
