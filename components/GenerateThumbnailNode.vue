<template>
  <div class="custom-node-content">
    <span class="icon">🖼️</span>
    <div>
      <div class="node-title">Generar Miniatura</div>
      <div class="node-desc">Genera miniatura de imagen.</div>
      <div class="node-config">
        <label>Ancho:
          <input v-model="width" type="number" min="16" max="512" placeholder="128" />
        </label>
        <label>Alto:
          <input v-model="height" type="number" min="16" max="512" placeholder="128" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const width = ref(128)
const height = ref(128)
watch([width, height], ([w, h]) => {
  // Aquí podrías emitir evento al flujo principal
})
</script>
<style scoped>
.custom-node-content { display: flex; align-items: flex-start; gap: 10px; }
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.node-config { margin-top: 6px; display: flex; gap: 6px; }
input { width: 48px; font-size: 12px; }
</style>
