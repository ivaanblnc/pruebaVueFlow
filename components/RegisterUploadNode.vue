<template>
  <div class="custom-node-content">
    <span class="icon">📝</span>
    <div>
      <div class="node-title">Registrar Subida</div>
      <div class="node-desc">Guarda log con nombre, fecha/hora y estado.</div>
      <div class="node-config">
        <label>Estado:
          <select v-model="status">
            <option value="ok">OK</option>
            <option value="error">Error</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const status = ref('ok')
watch(status, (val) => {
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
