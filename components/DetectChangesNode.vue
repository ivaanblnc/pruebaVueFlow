<template>
  <div class="custom-node-content">
    <Handle type="target" :position="Position.Left" />
    <span class="icon">🗂️</span>
    <div>
      <div class="node-title">Detectar Cambios en Carpeta</div>
      <div class="node-desc">Monitoriza carpeta local y emite eventos de archivos nuevos o modificados.</div>
      <div class="node-config">
        <label>Ruta carpeta:
          <input v-model="folder" type="text" placeholder="/ruta/carpeta" />
        </label>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Handle, Position } from '@vue-flow/core'
const props = defineProps<{ label: string }>()
const folder = ref('/ruta/carpeta')
watch(folder, (val) => {
  // Aquí podrías emitir evento al flujo principal
})
</script>
<style scoped>
.custom-node-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.node-config { margin-top: 6px; }
input { width: 120px; font-size: 12px; }
</style>
