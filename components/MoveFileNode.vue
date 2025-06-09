<template>
  <div class="custom-node-content">
    <span class="icon">📁</span>
    <div>
      <div class="node-title">Mover Archivo</div>
      <div class="node-desc">Mueve archivo a carpeta destino.</div>
      <div class="node-config">
        <label>Destino:
          <input v-model="dest" type="text" placeholder="/carpeta/destino" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const dest = ref('')
watch(dest, (val) => {
  // Aquí podrías emitir evento al flujo principal
})
</script>
<style scoped>
.custom-node-content { display: flex; align-items: flex-start; gap: 10px; }
.icon { font-size: 1.5em; }
.node-title { font-weight: bold; }
.node-desc { font-size: 12px; color: #64748b; }
.node-config { margin-top: 6px; }
input { width: 120px; font-size: 12px; }
</style>
