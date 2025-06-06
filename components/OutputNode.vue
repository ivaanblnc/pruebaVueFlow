<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  label: string
  result: string
}>()
</script>

<template>
  <div class="output-node">
    <Handle type="target" :position="Position.Left" />
    <div class="output-container">
      <div class="output-label">{{ label }}:</div>
      <div class="output-result">{{ result || 'Ingrese y valide los datos' }}</div>
    </div>
  </div>
</template>

<style scoped>
.output-node {
  padding: 15px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.output-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-label {
  font-weight: bold;
  color: #333;
}

.output-result {
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-height: 20px;
  word-break: break-word;
  color: #666;
  font-style: italic;
}
</style>
