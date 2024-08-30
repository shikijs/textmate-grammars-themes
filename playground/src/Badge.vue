<script setup lang="ts">
import { isDark } from './state'

const props = withDefaults(
  defineProps<{
    text?: string
    color?: boolean | number
    as?: string
    size?: string
  }>(),
  {
    color: true,
  },
)

function getHashColorFromString(
  name: string,
  opacity: number | string = 1,
) {
  if (name === 'JavaScript')
    return getHsla(45, opacity)

  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = hash % 360
  return getHsla(hue, opacity)
}

function getHsla(
  hue: number,
  opacity: number | string = 1,
) {
  const saturation = hue === -1
    ? 0
    : isDark.value ? 60 : 100
  const lightness = isDark.value ? 70 : 20
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
}

const style = computed(() => {
  if (!props.text || props.color === false)
    return {}
  return {
    color: typeof props.color === 'number'
      ? getHsla(props.color)
      : getHashColorFromString(props.text),
    background: typeof props.color === 'number'
      ? getHsla(props.color, 0.1)
      : getHashColorFromString(props.text, 0.1),
  }
})
const sizeClasses = computed(() => {
  switch (props.size || 'sm') {
    case 'sm':
      return 'px-1.5 text-11px leading-1.6em'
  }
  return ''
})
</script>

<template>
  <component :is="as || 'span'" ws-nowrap rounded :class="sizeClasses" :style>
    <slot>
      <span v-text="props.text" />
    </slot>
  </component>
</template>
