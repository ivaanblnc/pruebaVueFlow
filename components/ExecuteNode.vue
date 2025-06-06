<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  label: string
}>()

const emit = defineEmits(['execute'])

const handleClick = () => {
  emit('execute')
}
</script>

<template>
  <div class="execute-node">
    <Handle type="target" :position="Position.Left" />
    <button @click="handleClick" class="execute-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      {{ label }}
    </button>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.execute-node {
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.execute-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.execute-button:hover {
  background-color: #2563eb;
}

.execute-button:active {
  background-color: #1d4ed8;
}
</style>
