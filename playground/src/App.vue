<script setup lang="ts">
import { getHighlighterCore } from 'shiki/core'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import { themes } from '../../packages/tm-themes/index'
import { grammars } from '../../packages/tm-grammars/index'

useDark()

const theme = useStorage('tm-theme', themes.find(t => t.name === 'vitest-dark') as ThemeInfo)
const grammar = useStorage('tm-grammar', 'javascript')
const error = ref<any>(null)

const input = ref('console.log("Hello World")')
const output = ref('')

async function run() {
  error.value = null
  // @ts-expect-error: <title> element does exist.
  document.querySelector('head title').textContent = theme.value.displayName
  try {
    const themeObject = await import(`../../packages/tm-themes/themes/${theme.value.name}.json`).then(m => m.default)
    const langs = new Map<string, any>()

    input.value = await import(`../../samples/${grammar.value}.sample?raw`).then(m => m.default)

    async function loadLangs(lang: string) {
      if (langs.has(lang))
        return langs.get(lang)
      const langModule = await import(`../../packages/tm-grammars/grammars/${lang}.json`).then(m => m.default)
      langs.set(lang, langModule)
      for (const include of langModule.include ?? [])
        await loadLangs(include)
      return langModule
    }

    await loadLangs(grammar.value)

    const highlighter = await getHighlighterCore({
      themes: [
        themeObject,
      ],
      langs: Array.from(langs.values()),
      loadWasm: () => import('shiki/wasm'),
    })

    const result = highlighter.codeToHtml(input.value, {
      lang: grammar.value,
      theme: theme.value.name,
    })
    output.value = result
  }
  catch (e) {
    error.value = e
    throw e
  }
}

watch([theme, grammar], run, { immediate: true })
</script>

<template>
  <div h-100vh w-full grid="~ cols-[200px_200px_5fr] gap-4" p4>
    <div h-full border="x base y base" of-auto flex="~ col">
      <button
        v-for="t of themes"
        :key="t.name"
        border="b base" px3 py1 text-left
        :class="t.name === theme.name ? 'bg-active text-primary' : 'text-faded'"
        @click="theme = t"
      >
        {{ t.displayName }}
      </button>
    </div>
    <div h-full border="x base y base" of-auto flex="~ col">
      <button
        v-for="g of grammars"
        :key="g.name"
        border="b base" px3 py1 text-left
        :class="g.name === grammar ? 'bg-active text-primary' : 'text-faded'"
        @click="grammar = g.name"
      >
        {{ g.displayName }}
      </button>
    </div>

    <div>
      <div v-if="error" text-red bg-red:10 p6 rounded>
        {{ error }}
      </div>
      <div v-html="output" />
    </div>
  </div>
</template>

<style>
.shiki {
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  --uno: border border-base rounded p4;
}
:root {
    color-scheme: light;
}
:root.dark {
    color-scheme: dark;
}
</style>
