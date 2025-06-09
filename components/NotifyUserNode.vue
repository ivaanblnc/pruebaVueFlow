<template>
  <div class="custom-node-content">
    <span class="icon">🔔</span>
    <div>
      <div class="node-title">Notificar Usuario</div>
      <div class="node-desc">Muestra notificación visual o email.</div>
      <div class="node-config">
        <label>Tipo:
          <select v-model="type">
            <option value="popup">Popup</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const type = ref('popup')
watch(type, (val) => {
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
