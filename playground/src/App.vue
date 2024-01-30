<script setup lang="ts">
import { getHighlighterCore } from 'shiki/core'
import { themes } from '../../packages/tm-themes/index'
import { grammars } from '../../packages/tm-grammars/index'

const isDark = useDark()

const theme = useStorage('tm-theme', 'vitesse-dark')
const grammar = useStorage('tm-grammar', 'javascript')
const embedded = ref<string[]>([])
const error = ref<any>(null)

const copied = ref(false)
const clipboard = useClipboard()
const params = useUrlSearchParams('history')
const searchInputGrammar = ref('')
const searchInputTheme = ref('')

const filteredGrammars = computed(() => {
  const searchTerm = searchInputGrammar.value.trim().toLowerCase()
  return grammars.filter(g =>
    g.displayName.toLowerCase().includes(searchTerm),
  )
})

const filteredThemes = computed(() => {
  const searchTerm = searchInputTheme.value.trim().toLowerCase()
  return themes.filter(t =>
    t.displayName.toLowerCase().includes(searchTerm),
  )
})

if (params.theme && themes.some(t => t.name === params.theme))
  theme.value = params.theme as string
if (params.grammar && grammars.some(t => t.name === params.grammar))
  grammar.value = params.grammar as string

const input = ref('console.log("Hello World")')
const output = ref('')

const grammarObject = computed(() => grammars.find(g => g.name === grammar.value))
const themeObject = computed(() => themes.find(t => t.name === theme.value))

async function run() {
  error.value = null
  try {
    const themeObject = await import(`../../packages/tm-themes/themes/${theme.value}.json`).then(m => m.default)
    const langs = new Map<string, any>()

    input.value = await import(`../../samples/${grammar.value}.sample?raw`).then(m => m.default)

    async function loadLangs(lang: string) {
      if (langs.has(lang))
        return langs.get(lang)
      const info = grammars.find(g => g.name === lang)
      info?.embedded?.forEach(loadLangs)
      langs.set(lang, import(`../../packages/tm-grammars/grammars/${lang}.json`).then(m => m.default))
      return langs.get(lang)
    }

    loadLangs(grammar.value)

    embedded.value = Array.from(langs.keys())
      .filter(l => l !== grammar.value)

    const highlighter = await getHighlighterCore({
      themes: [
        themeObject,
      ],
      langs: await Promise.all(Array.from(langs.values())),
      loadWasm: () => import('shiki/wasm'),
    })

    const result = highlighter.codeToHtml(input.value, {
      lang: grammar.value,
      theme: theme.value,
    })
    output.value = result
  }
  catch (e) {
    error.value = e
    throw e
  }
}

function openFile(filename: string) {
  if (import.meta.hot) {
    fetch(`/__open-in-editor?file=${filename}`)
  }
  else {
    const a = document.createElement('a')
    a.href = new URL(filename, 'https://github.com/shikijs/textmate-grammars-themes/tree/main/playground/').href
    a.target = '_blank'
    a.click()
  }
}

function openSample() {
  openFile(`../samples/${grammar.value}.sample`)
}

function openGrammar(name = grammar.value) {
  openFile(`../packages/tm-grammars/grammars/${name}.json`)
}

function openTheme() {
  openFile(`../packages/tm-themes/themes/${theme.value}.json`)
}

function random() {
  const g = grammars[Math.floor(Math.random() * grammars.length)]
  const t = themes[Math.floor(Math.random() * themes.length)]
  grammar.value = g.name
  theme.value = t.name
}

function share() {
  clipboard.copy(new URL(`?${new URLSearchParams({
    theme: theme.value,
    grammar: grammar.value,
  })}`, location.href).href)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1000)
}

watch(
  [theme, grammar],
  run,
  { immediate: true },
)
watch(
  [theme, grammar],
  () => {
    params.theme = theme.value
    params.grammar = grammar.value
  },
)

useTitle(() => `${grammarObject.value?.displayName || grammar.value} - ${themeObject.value?.displayName || theme.value} - TextMate Playground`)

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    run()
  })
}
</script>

<template>
  <div h-100vh w-full grid="~ rows-[max-content_1fr]">
    <div flex="~ items-center gap-2" px4 pt-4>
      <a href="https://github.com/shikijs/textmate-grammars-themes" target="_blank" text-lg hover="text-primary">
        Shiki TextMate Grammar & Theme Playground
      </a>
      <div flex-auto />
      <a border="~ base rounded" p2 hover="bg-active" href="https://github.com/shikijs/textmate-grammars-themes" target="_blank">
        <div i-carbon-logo-github />
      </a>
      <button border="~ base rounded" p2 hover="bg-active" @click="random()">
        <div i-carbon-shuffle />
      </button>
      <button border="~ base rounded" p2 hover="bg-active" @click="share()">
        <div v-if="copied" i-carbon-checkmark />
        <div v-else i-carbon-link />
      </button>
      <button border="~ base rounded" p2 hover="bg-active" @click="isDark = !isDark">
        <div dark:i-carbon-moon i-carbon-sun />
      </button>
    </div>
    <div grid="~ cols-[200px_200px_5fr] gap-4" p4 of-hidden>
      <div h-full of-auto flex="~ col gap-4">
        <div relative border="~ base rounded">
          <input
            v-model="searchInputGrammar"
            placeholder="Search" px3
            py1 pl8 bg-transparent sticky top-0 w-full
          >
          <div i-carbon-search absolute left-2 top-2 op40 z--1 />
        </div>
        <div h-full of-auto flex="~ col" border="~ base rounded">
          <button
            v-for="g of filteredGrammars"
            :key="g.name"
            border="b base" px3
            py1 text-left
            :class="g.name === grammar ? 'bg-active text-primary' : 'text-faded'"
            @click="grammar = g.name"
          >
            {{ g.displayName }}
          </button>
        </div>
      </div>

      <div h-full of-auto flex="~ col gap-4">
        <div relative border="~ base rounded">
          <input
            v-model="searchInputTheme"
            placeholder="Search" px3
            py1 pl8 bg-transparent sticky top-0 w-full
          >
          <div i-carbon-search absolute left-2 top-2 op40 z--1 />
        </div>
        <div h-full of-auto flex="~ col" border="~ base rounded">
          <button
            v-for="t of filteredThemes"
            :key="t.name"
            border="b base" px3 py1 text-left
            :class="t.name === theme ? 'bg-active text-purple' : 'text-faded'"
            @click="theme = t.name"
          >
            {{ t.displayName }}
          </button>
        </div>
      </div>

      <div flex="~ col gap-4" of-auto>
        <div p4 border="~ base rounded" flex="~ gap-4" class="panel-info">
          <div grid="~ cols-[max-content_1fr] gap-x-3" flex-auto>
            <div text-right op50>
              Grammar
            </div>
            <div>
              <button text-left @click="openGrammar()">
                <code>{{ grammar }}</code>
              </button>
              <div flex="~ col" ml-2 border="l base">
                <div v-for="e in embedded" :key="e" flex="~ items-center gap-2">
                  <div w-4 border="t base" h-1px flex-none />
                  <button text-left op75 @click="openGrammar(e)">
                    <code>{{ e }}</code>
                  </button>
                </div>
              </div>
            </div>
            <div text-right op50>
              Theme
            </div>
            <button text-left @click="openTheme()">
              <code>{{ theme }}</code>
            </button>
            <div text-right op50>
              Sample
            </div>
            <button text-left @click="openSample()">
              <code>
                {{ grammar }}.sample
              </code>
            </button>
          </div>
        </div>

        <div v-if="error" text-red bg-red:10 p6 rounded>
          {{ error }}
        </div>
        <div v-html="output" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  color-scheme: light;
}
:root.dark {
  color-scheme: dark;
}
.shiki {
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  --uno: border border-base rounded p4;
}
.panel-info button {
  --uno: hover-text-primary hover-underline hover:op100;
}
</style>
