export const isDark = useDark()

export const theme = useStorage('tm-theme', 'vitesse-dark')
export const grammar = useStorage('tm-grammar', 'javascript')
export const engine = useStorage<'wasm' | 'js'>('tm-use-engine', 'wasm')
