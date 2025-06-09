<template>
    <div :class="['p-4 rounded shadow-md w-60 text-white', backgroundColor]">
      <h3 class="font-bold text-lg mb-2">{{ data.titulo }}</h3>
      <p><strong>Responsable:</strong> {{ data.responsable }}</p>
      <p><strong>Prioridad:</strong> {{ data.prioridad }}</p>
      <p><strong>Estado:</strong> {{ estado }}</p>
  
      <button
        v-if="estado !== 'completado'"
        class="mt-3 bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
        @click="marcarComoCompletado"
      >
        Marcar como completado
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps(['data'])
  const emit = defineEmits(['update:data'])
  
  const estado = ref(props.data.estado ?? 'pendiente')
  
  watch(() => props.data.estado, (nuevo) => {
    estado.value = nuevo
  })
  
  function marcarComoCompletado() {
    estado.value = 'completado'
    emit('update:data', { ...props.data, estado: 'completado' })
  }
  
  const backgroundColor = computed(() => {
    switch (props.data.prioridad) {
      case 'alta':
        return 'bg-red-500'
      case 'media':
        return 'bg-yellow-500'
      case 'baja':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  })
  </script>
  