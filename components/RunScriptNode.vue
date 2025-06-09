<template>
  <div class="custom-node-content">
    <span class="icon">⚙️</span>
    <div>
      <div class="node-title">Ejecutar Script</div>
      <div class="node-desc">Ejecuta script personalizado.</div>
      <div class="node-config">
        <label>Script:
          <input v-model="script" type="text" placeholder="sh backup.sh" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const script = ref('')
watch(script, (val) => {
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
