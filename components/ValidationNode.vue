<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  label: string
  isValid: boolean
}>()
</script>

<template>
  <div class="validation-node" :class="{ 'is-valid': isValid, 'is-invalid': !isValid }">
    <Handle type="target" :position="Position.Left" />
    <div class="validation-container">
      <div class="status-indicator" :class="{ 'valid': isValid, 'invalid': !isValid }"></div>
      <span>{{ label }}</span>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.validation-node {
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.validation-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
}

.valid {
  background-color: #10b981;
}

.invalid {
  background-color: #ef4444;
}

.is-valid {
  border-color: #10b981;
}

.is-invalid {
  border-color: #ef4444;
}
</style>
