<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueFlow, useVueFlow, Position, addEdge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import type { Node, Edge, Connection } from '@vue-flow/core'

// Componentes personalizados
import InputNode from '../components/InputNode.vue'
import ValidationNode from '../components/ValidationNode.vue'
import ExecuteNode from '../components/ExecuteNode.vue'
import OutputNode from '../components/OutputNode.vue'

const nodeTypes = {
  inputNode: InputNode,
  validationNode: ValidationNode,
  executeNode: ExecuteNode,
  outputNode: OutputNode,
}

const { onConnect, project } = useVueFlow()

// Nodos iniciales
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

// Datos del formulario
const formData = ref({
  nombre: '',
  apellido: ''
})

// Resultado de la ejecución
const resultado = ref('')

// Nodos disponibles para arrastrar
const dragNodes = [
  {
    id: '1',
    type: 'inputNode',
    data: { label: 'Nombre', field: 'nombre' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'inputNode',
    data: { label: 'Apellido', field: 'apellido' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
  },
  {
    id: '3',
    type: 'validationNode',
    data: { label: 'Validar Datos' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'executeNode',
    data: { label: 'Ejecutar' },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '5',
    type: 'outputNode',
    data: { label: 'Resultado' },
    position: { x: 0, y: 0 },
    targetPosition: Position.Left,
  },
]

// Actualizar datos del formulario
const updateFormData = (field: string, value: string) => {
  formData.value[field] = value
}

// Validar datos
const validateData = () => {
  if (!formData.value.nombre.trim()) {
    return 'El nombre es requerido'
  }
  if (!formData.value.apellido.trim()) {
    return 'El apellido es requerido'
  }
  return null
}

// Ejecutar flujo
const executeFlow = () => {
  const validationError = validateData()
  if (validationError) {
    resultado.value = `Error: ${validationError}`
    return
  }
  
  resultado.value = `¡Hola ${formData.value.nombre} ${formData.value.apellido}!`
}

// Manejar conexiones entre nodos
onConnect((params) => {
  const newEdge = {
    ...params,
    id: `e${params.source}->${params.target}`,
    animated: true,
  }
  edges.value = addEdge(newEdge, edges.value)
})

// Manejar clic en nodo para eliminarlo con Ctrl + clic
const isCtrlPressed = ref(false)

// Detectar cuando se presiona o suelta la tecla Ctrl
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Control') {
    isCtrlPressed.value = true
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Control') {
    isCtrlPressed.value = false
  }
}

// Agregar event listeners para la tecla Ctrl
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  
  // Limpiar los event listeners cuando el componente se desmonte
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
})

// Función para eliminar un nodo y sus conexiones
const deleteNode = (nodeId: string) => {
  console.log('Intentando eliminar nodo:', nodeId)
  
  // Crear copias de los arrays actuales
  const updatedNodes = [...nodes.value]
  const updatedEdges = [...edges.value]
  
  // Encontrar el índice del nodo
  const nodeIndex = updatedNodes.findIndex(n => n.id === nodeId)
  
  if (nodeIndex === -1) {
    console.log('Nodo no encontrado:', nodeId)
    return
  }
  
  // Encontrar y eliminar las conexiones relacionadas
  const connectedEdgeIds = updatedEdges
    .filter(edge => edge.source === nodeId || edge.target === nodeId)
    .map(edge => edge.id)
  
  // Filtrar los edges para mantener solo los no conectados al nodo
  const filteredEdges = updatedEdges.filter(
    edge => !connectedEdgeIds.includes(edge.id)
  )
  
  // Filtrar los nodos para eliminar el nodo objetivo
  const filteredNodes = updatedNodes.filter(node => node.id !== nodeId)
  
  console.log(`Nodo ${nodeId} y sus ${connectedEdgeIds.length} conexiones serán eliminados`)
  
  // Actualizar las referencias reactivas
  nodes.value = filteredNodes
  edges.value = filteredEdges
}

// Manejar clic en nodo para eliminarlo con Ctrl + clic
const onNodeClick = (event: MouseEvent, node: Node) => {
  console.log('Clic en nodo:', node.id, 'Ctrl presionado:', event.ctrlKey)
  
  if (event.ctrlKey) {
    event.preventDefault()
    event.stopPropagation()
    
    // Llamar a la función de eliminación
    deleteNode(node.id)
  }
}

// Manejar el inicio del arrastre de un nodo
const onDragStart = (event: DragEvent, nodeType: string, nodeData: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify({ type: nodeType, data: nodeData }))
    event.dataTransfer.effectAllowed = 'move'
  }
}

// Manejar la caída de un nodo
const onDrop = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  const data = JSON.parse(event.dataTransfer.getData('application/vueflow'))
  const position = project({ x: event.clientX, y: event.clientY - 40 })
  
  const newNode = {
    id: `${data.type}-${Date.now()}`,
    type: data.type,
    position,
    data: data.data,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }
  
  nodes.value = [...nodes.value, newNode]
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onPaneReady = () => {
  console.log('Panel listo')
}

// Inicializar con algunos nodos de ejemplo
onMounted(() => {
  const initialNodes = [
    {
      id: 'node-1',
      type: 'inputNode',
      data: { label: 'Nombre', field: 'nombre' },
      position: { x: 100, y: 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'node-2',
      type: 'inputNode',
      data: { label: 'Apellido', field: 'apellido' },
      position: { x: 100, y: 200 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'node-3',
      type: 'validationNode',
      data: { label: 'Validar Datos' },
      position: { x: 400, y: 150 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'node-4',
      type: 'executeNode',
      data: { label: 'Ejecutar' },
      position: { x: 700, y: 150 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'node-5',
      type: 'outputNode',
      data: { label: 'Resultado' },
      position: { x: 1000, y: 150 },
      targetPosition: Position.Left,
    },
  ]

  const initialEdges = [
    { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true },
    { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
    { id: 'e3-4', source: 'node-3', target: 'node-4', animated: true },
    { id: 'e4-5', source: 'node-4', target: 'node-5', animated: true },
  ]

  nodes.value = initialNodes
  edges.value = initialEdges
})
</script>

<template>
  <div class="app-container">
    <div class="ctrl-indicator" :class="{ 'active': isCtrlPressed }">
      Modo eliminación (Ctrl + clic)
    </div>
    <div class="sidebar">
      <h3>Nodos disponibles</h3>
      <div 
        v-for="node in dragNodes" 
        :key="node.id"
        class="draggable-node"
        draggable
        @dragstart="onDragStart($event, node.type, node.data)"
      >
        {{ node.data.label }}
      </div>
    </div>
    
    <div class="flow-container">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-edge-options="{ animated: true }"
        :nodes-draggable="true"
        :nodes-connectable="true"
        :zoom-on-double-click="false"
        :pan-on-scroll="true"
        :selection-on-drag="false"
        :selection-mode="'partial'"
        @connect="onConnect"
        @drop="onDrop"
        @dragover="onDragOver"
        @node-click="onNodeClick"
        @pane-ready="onPaneReady"
        fit-view
      >
        <Background />
        
        <template #node-inputNode="{ data, id }">
          <div class="custom-node">
            <InputNode 
              :label="data.label" 
              :field="data.field" 
              @update:value="(val) => updateFormData(data.field, val)" 
            />
          </div>
        </template>
        
        <template #node-validationNode="{ data }">
          <div class="custom-node">
            <ValidationNode :label="data.label" :is-valid="!validateData()" />
          </div>
        </template>
        
        <template #node-executeNode="{ data }">
          <div class="custom-node">
            <ExecuteNode :label="data.label" @execute="executeFlow" />
          </div>
        </template>
        
        <template #node-outputNode="{ data }">
          <div class="custom-node">
            <OutputNode :label="data.label" :result="resultado" />
          </div>
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #__nuxt {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Contenedor principal */
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Barra lateral */
.ctrl-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.ctrl-indicator.active {
  opacity: 1;
  transform: translateY(0);
}

.sidebar {
  width: 200px;
  background: #f8f9fa;
  padding: 15px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.sidebar h3 {
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 16px;
  text-align: left;
}

/* Nodos arrastrables */
.draggable-node {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
  cursor: move;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.draggable-node:hover {
  background: #f1f5f9;
  transform: translateX(2px);
}

/* Contenedor del flujo */
.flow-container {
  flex: 1;
  height: 100%;
  position: relative;
  background: #f8fafc;
}

/* Estilos para los nodos */
:deep(.vue-flow__node) {
  padding: 0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  background: transparent;
  border: none;
}

:deep(.vue-flow__node:hover) {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.custom-node {
  background: white;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

/* Estilos para los handles */
:deep(.vue-flow__handle) {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
}

:deep(.vue-flow__handle-left) {
  left: -5px;
}

:deep(.vue-flow__handle-right) {
  right: -5px;
}

/* Estilos para las conexiones */
:deep(.vue-flow__edge-path) {
  stroke: #94a3b8;
  stroke-width: 2;
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: #3b82f6;
}

/* Fondo del flujo */
:deep(.vue-flow__background) {
  background: #f8fafc;
}

/* Barra de herramientas */
:deep(.vue-flow__controls) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

:deep(.vue-flow__controls-button) {
  background: white;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.vue-flow__controls-button:hover) {
  background: #f1f5f9;
}

:deep(.vue-flow__controls-button svg) {
  width: 16px;
  height: 16px;
}
</style>