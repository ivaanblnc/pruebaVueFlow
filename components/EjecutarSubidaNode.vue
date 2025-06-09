<template>
  <div class="custom-node-content">
    <Handle type="target" :position="Position.Left" />
    <span class="icon">⬆️</span>
    <div>
      <div class="node-title">Ejecutar Subida</div>
      <div class="node-desc">Haz clic para empezar a observar la carpeta y subir cambios automáticamente.</div>
      <button @click="handleExecute" class="exec-btn">Ejecutar Subida</button>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { defineEmits } from 'vue'
const emit = defineEmits(['ejecutar-subida'])
function handleExecute() {
  emit('ejecutar-subida')
}
</script>
<style scoped>
.custom-node-content { display: flex; align-items: flex-start; gap: 10px; }
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.exec-btn { margin-top: 8px; padding: 4px 12px; font-size: 13px; background: #22c55e; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.exec-btn:hover { background: #16a34a; }
</style>
