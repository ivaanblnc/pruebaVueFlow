<template>
  <div class="custom-node-content">
    <span class="icon">📄</span>
    <div>
      <div class="node-title">Obtener Info del Archivo</div>
      <div class="node-desc">Extrae metadata del archivo detectado.</div>
      <div class="node-config">
        <label>Extensiones:
          <input v-model="ext" type="text" placeholder="*.jpg, *.pdf" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const ext = ref('')
watch(ext, (val) => {
  // Aquí podrías emitir evento al flujo principal
})
</script>
<style scoped>
.custom-node-content { display: flex; align-items: flex-start; gap: 10px; }
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.node-config { margin-top: 6px; }
input { width: 100px; font-size: 12px; }
</style>
