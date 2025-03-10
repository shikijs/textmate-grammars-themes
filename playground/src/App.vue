<script setup lang="ts">
import type { HighlighterCore } from '@shikijs/core'
import { createHighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import { grammars, injections } from '../../packages/tm-grammars/index'
import { themes } from '../../packages/tm-themes/index'
import Badge from './Badge.vue'
import SegmentControl from './SegmentControl.vue'
import { engine, engineJsForgiving, grammar, isDark, theme } from './state'

const embedded = ref<string[]>([])
const error = ref<any>(null)

const copied = ref(false)
const clipboard = useClipboard()
const params = useUrlSearchParams('history')
const searchInputGrammar = ref('')
const searchInputTheme = ref('')
const input = ref('')
const output = ref('')
const example = ref('')
const isFetching = ref(false)
const duration = ref(0)

const jsEngine = computed(() => createJavaScriptRegexEngine({
  forgiving: engineJsForgiving.value,
}))
const wasmEngine = createOnigurumaEngine(() => import('@shikijs/engine-oniguruma/wasm-inlined'))

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
if (params.code?.length)
  input.value = params.code as string

const grammarObject = computed(() => grammars.find(g => g.name === grammar.value))
const themeObject = computed(() => themes.find(t => t.name === theme.value))

let highlighter: HighlighterCore | null = null

let fetchingTimer: ReturnType<typeof setTimeout> | undefined

async function run(fetchInput = true) {
  highlighter?.dispose()
  highlighter = null
  error.value = null
  duration.value = 0
  if (fetchingTimer)
    clearTimeout(fetchingTimer)
  fetchingTimer = setTimeout(() => {
    isFetching.value = true
  }, 300)
  try {
    const themeObject = await import(`../../packages/tm-themes/themes/${theme.value}.json`).then(m => m.default)
    const langs = new Map<string, any>()

    if (fetchInput) {
      const sample = await import(`../../samples/${grammar.value}.sample?raw`)
        .then(m => m.default)
        .catch(() => `// No sample available for ${grammar.value}`)
      example.value = sample
      input.value = sample
    }

    async function loadLangs(lang: string) {
      if (langs.has(lang))
        return langs.get(lang)
      const info = grammars.find(g => g.name === lang) || injections.find(g => g.name === lang)
      langs.set(lang, import(`../../packages/tm-grammars/grammars/${lang}.json`).then(m => m.default))
      info?.embedded?.forEach(loadLangs)
      return langs.get(lang)
    }

    loadLangs(grammar.value)

    embedded.value = Array.from(langs.keys()).filter(l => l !== grammar.value)

    highlighter = await createHighlighterCore({
      themes: [
        themeObject,
      ],
      langs: await Promise.all(Array.from(langs.values())),
      engine: engine.value === 'js' ? jsEngine.value : wasmEngine,
    })

    highlight()
  }
  catch (e) {
    error.value = e
    duration.value = 0
    throw e
  }
  finally {
    if (fetchingTimer)
      clearTimeout(fetchingTimer)
    isFetching.value = false
  }
}

function highlight() {
  if (highlighter) {
    const start = performance.now()
    const result = highlighter.codeToHtml(input.value, {
      lang: grammar.value,
      theme: theme.value,
    })
    const end = performance.now()
    duration.value = end - start
    output.value = result
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
  [theme, grammar, engine, engineJsForgiving],
  (n, o) => {
    params.theme = theme.value
    params.grammar = grammar.value
    const grammarChanged = o[1] !== n[1]
    const isFirstTime = !o[0]
    // Fetch example when grammar changes, or the first load without params
    run(isFirstTime ? !input.value : grammarChanged)
  },
  { immediate: true },
)

watch(
  input,
  () => {
    highlight()
    if (input.value !== example.value)
      params.code = input.value
    else
      delete params.code
  },
  { flush: 'post' },
)

// @ts-expect-error DEFINE
const version = __VERSION__

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
      <Badge :text="`Shiki v${version}`" text-sm :color="160" />
      <div flex-auto />
      <label
        v-if="engine === 'js'"
        for="js-forgiving" op50 flex="~ items-center gap-1" border="~ base rounded" px1.5 py0.5
        title="Forgiving errors in JavaScript engine" select-none mr1
      >
        <input id="js-forgiving" v-model="engineJsForgiving" type="checkbox">
        <span text-sm>Forgiving</span>
      </label>
      <SegmentControl
        v-model:model-value="engine"
        :options="[
          { label: 'Oniguruma', value: 'wasm' },
          { label: 'JavaScript', value: 'js' },
        ]"
      />
      <a border="~ base rounded" p2 hover="bg-active" href="https://github.com/shikijs/textmate-grammars-themes" target="_blank">
        <div i-carbon-logo-github />
      </a>
      <button border="~ base rounded" p2 hover="bg-active" title="Reset" @click="run()">
        <div i-carbon-reset />
      </button>
      <button border="~ base rounded" p2 hover="bg-active" title="Random" @click="random()">
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

      <div flex="~ col gap-4" of-auto max-h-full>
        <div p4 border="~ base rounded" flex="~ gap-4" class="panel-info" flex-none>
          <div grid="~ cols-[max-content_1fr] gap-x-3" flex-auto>
            <div text-right op50>
              Grammar
            </div>
            <div>
              <button text-left @click="openGrammar()">
                <code>{{ grammar }}</code>
              </button>
              <div text-xs>
                <span v-for="(link, index) in grammarObject?.funding" :key="index">
                  <span v-if="index > 0">, </span>
                  <a :href="link.url" target="_blank" hover="text-primary">
                    ❤️ {{ link.name }}<template v-if="link.handle">: <b>{{ link.handle }}</b></template>
                  </a>
                </span>
              </div>
              <div v-if="embedded.length < 15" flex="~ col" ml-2 border="l base">
                <div v-for="e in embedded" :key="e" flex="~ items-center gap-2">
                  <div w-4 border="t base" h-1px flex-none />
                  <button text-left op75 @click="openGrammar(e)">
                    <code>{{ e }}</code>
                  </button>
                </div>
              </div>
              <div v-else flex="~ wrap gap-x-2 gap-y-1" ml-2 border="l base" px4 py1 pb2>
                <button v-for="e in embedded" :key="e" text-left op75 @click="openGrammar(e)">
                  <code>{{ e }}</code>
                </button>
              </div>
            </div>
            <div text-right op50>
              Theme
            </div>
            <div>
              <button text-left @click="openTheme()">
                <code>{{ theme }}</code>
              </button>
              <div text-xs>
                <template v-for="(link, index) in themeObject?.funding" :key="index">
                  <span v-if="index > 0">, </span>
                  <a :href="link.url" target="_blank" hover="text-primary">
                    ❤️ {{ link.name }}<template v-if="link.handle">: <b>{{ link.handle }}</b></template>
                  </a>
                </template>
              </div>
            </div>
            <div text-right op50>
              Sample
            </div>
            <button text-left @click="openSample()">
              <code>
                {{ grammar }}.sample
              </code>
            </button>
            <template v-if="grammarObject?.aliases?.length">
              <div text-right op50>
                Aliases
              </div>
              <div flex="~ gap-2">
                <code v-for="a in grammarObject?.aliases" :key="a">
                  {{ a }}
                </code>
              </div>
            </template>
          </div>
        </div>

        <div v-if="error" text-red bg-red:10 p4 rounded flex-none>
          {{ error }}
        </div>
        <div v-if="output && !error" relative of-x-scroll flex-none>
          <div
            transition-all duration-500 :class="isFetching ? 'blur-3px' : ''"
            v-html="output"
          />
          <textarea
            id="input"
            v-model="input"
            class="absolute top-0 left-0 inset-0 caret-gray w-full h-full resize-none of-hidden p4 bg-transparent z-1 font-mono text-transparent"
            spellcheck="false"
          />
        </div>
        <div
          v-if="isFetching"
          text-amber bg-amber:10 px4 py3 border="~ amber/50 rounded" animate-pulse
          flex="~ items-center gap-2 none"
        >
          <div i-svg-spinners-270-ring-with-bg />
          Loading...
        </div>
        <div v-else-if="duration" op50 text-sm text-right mr-1>
          Highlighting finished in <code font-bold>{{ duration.toFixed(2) }}ms</code>
        </div>
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
.shiki, #input {
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  min-height: 4em;
  white-space: pre;
  --uno: border border-base rounded p4;
}
.panel-info button {
  --uno: hover-text-primary hover-underline hover:op100;
}
pre code {
  --uno: font-mono;
}
</style>
