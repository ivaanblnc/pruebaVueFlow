<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  label: string
  field: string
}>()

const emit = defineEmits(['update:value'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:value', target.value)
}
</script>

<template>
  <div class="input-node">
    <Handle type="target" :position="Position.Left" />
    <div class="input-container">
      <label>{{ label }}:</label>
      <input type="text" @input="handleInput" />
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.input-node {
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
