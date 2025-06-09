<template>
  <div class="custom-node-content">
    <Handle type="target" :position="Position.Left" />
    <span class="icon">☁️</span>
    <div>
      <div class="node-title">Subir Archivo a la Nube</div>
      <div class="node-desc">Sube el archivo a Google Drive o Dropbox.</div>
      <div class="node-config">
        <label>Proveedor:
          <select v-model="provider">
            <option value="googleDrive">Google Drive</option>
            <option value="dropbox">Dropbox</option>
          </select>
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
const provider = ref('googleDrive')
watch(provider, (val) => {
  // Aquí podrías emitir evento al flujo principal
})
</script>
<style scoped>
.custom-node-content { display: flex; align-items: flex-start; gap: 10px; }
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.node-config { margin-top: 6px; }
select { font-size: 12px; }
</style>
