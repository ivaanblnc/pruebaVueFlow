<template>
  <div
    :style="{
      padding: '1rem',
      width: '320px',
      backgroundColor: data.bgColor || '#f0f4f8',
      border: '2px solid',
      borderColor: data.borderColor || '#3182ce',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      userSelect: 'none',
    }"
  >
    <h2 style="margin-bottom: 12px; color: #2c5282;">
      {{ data.title || 'Nodo Super Completo' }}
    </h2>

    <!-- Texto simple -->
    <label>
      Nombre:
      <input
        v-model="formValues.nombre"
        type="text"
        :disabled="!data.editable"
        placeholder="Introduce nombre"
        style="width: 100%; margin-top: 4px; margin-bottom: 12px; padding: 6px; border-radius: 4px; border: 1px solid #ccc;"
      >
    </label>

    <!-- Checkbox -->
    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <input
        v-model="formValues.activo"
        type="checkbox"
        :disabled="!data.editable"
      >
      Activo
    </label>

    <!-- Select -->
    <label>
      Rol:
      <select
        v-model="formValues.rol"
        :disabled="!data.editable"
        style="width: 100%; margin-top: 4px; margin-bottom: 12px; padding: 6px; border-radius: 4px; border: 1px solid #ccc;"
      >
        <option disabled value="">Selecciona un rol</option>
        <option v-for="rol in data.roles || []" :key="rol" :value="rol">
          {{ rol }}
        </option>
      </select>
    </label>

    <!-- Textarea -->
    <label>
      Descripción:
      <textarea
        v-model="formValues.descripcion"
        :disabled="!data.editable"
        rows="3"
        placeholder="Descripción..."
        style="width: 100%; margin-top: 4px; padding: 6px; border-radius: 4px; border: 1px solid #ccc;"
      />
    </label>

    <!-- Botón enviar -->
    <button
      v-if="data.editable"
      style="
        margin-top: 10px;
        background-color: #3182ce;
        color: white;
        width: 100%;
        padding: 8px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      "
      @click="enviarDatos"
    >
      Enviar
    </button>
  </div>
</template>

<script setup>
import { reactive, watch, toRefs } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const formValues = reactive({
  nombre: '',
  activo: false,
  rol: '',
  descripcion: '',
})

// Inicializa con valores que vengan desde data (opcional)
if (props.data.initialValues) {
  Object.assign(formValues, props.data.initialValues)
}

function enviarDatos() {
  if (typeof props.data.onSubmit === 'function') {
    props.data.onSubmit({ ...formValues })
  } else {
    alert('No hay función onSubmit definida en este nodo.')
  }
}
</script>
