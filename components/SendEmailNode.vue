<template>
  <div class="custom-node-content">
    <span class="icon">✉️</span>
    <div>
      <div class="node-title">Enviar Email</div>
      <div class="node-desc">Envía un email tras la subida.</div>
      <div class="node-config">
        <label>Destinatario:
          <input v-model="to" type="email" placeholder="usuario@email.com" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const to = ref('')
watch(to, (val) => {
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
