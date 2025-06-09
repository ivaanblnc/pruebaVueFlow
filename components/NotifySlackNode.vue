<template>
  <div class="custom-node-content">
    <span class="icon">💬</span>
    <div>
      <div class="node-title">Notificar Slack</div>
      <div class="node-desc">Envía mensaje a Slack.</div>
      <div class="node-config">
        <label>Canal:
          <input v-model="channel" type="text" placeholder="#canal" />
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ label: string }>()
const channel = ref('')
watch(channel, (val) => {
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
