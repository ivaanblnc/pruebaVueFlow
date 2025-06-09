<template>
    <div class="p-4 w-72 bg-gray-900 text-white rounded shadow">
      <div class="flex justify-between items-center mb-2">
        <span class="font-semibold text-sm text-gray-300">{{ data.lenguaje || 'Código' }}</span>
        <button
          v-if="data.editable"
          class="text-xs bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
          @click="modoEdicion = !modoEdicion"
        >
          {{ modoEdicion ? 'Guardar' : 'Editar' }}
        </button>
      </div>
  
      <div v-if="modoEdicion">
        <textarea
          v-model="codigoEditado"
          class="w-full h-40 text-sm p-2 bg-black text-green-400 font-mono rounded resize-none"
        />
      </div>
  
      <pre v-else class="whitespace-pre-wrap text-sm font-mono text-green-400 bg-black p-2 rounded">
  {{ codigoEditado }}
      </pre>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps(['data'])
  const emit = defineEmits(['update:data'])
  
  const modoEdicion = ref(false)
  const codigoEditado = ref(props.data.codigo ?? '')
  
  // Si cambia el valor por fuera, lo actualizamos
  watch(() => props.data.codigo, (nuevo) => {
    if (!modoEdicion.value) codigoEditado.value = nuevo
  })
  
  // Al desactivar edición, guardamos
  watch(modoEdicion, (nuevo) => {
    if (!nuevo) {
      emit('update:data', { ...props.data, codigo: codigoEditado.value })
    }
  })
  </script>
  