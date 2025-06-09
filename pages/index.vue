<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VueFlow, useVueFlow, Position, addEdge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import type { Node, Edge, Connection } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'

// Import custom node components
import DetectChangesNode from '~/components/DetectChangesNode.vue'
import GetFileInfoNode from '~/components/GetFileInfoNode.vue'
import UploadToCloudNode from '~/components/UploadToCloudNode.vue'
import RegisterUploadNode from '~/components/RegisterUploadNode.vue'
import NotifyUserNode from '~/components/NotifyUserNode.vue'
import SendEmailNode from '~/components/SendEmailNode.vue'
import MoveFileNode from '~/components/MoveFileNode.vue'
import NotifySlackNode from '~/components/NotifySlackNode.vue'
import GenerateThumbnailNode from '~/components/GenerateThumbnailNode.vue'
import RunScriptNode from '~/components/RunScriptNode.vue'
import ConnectGoogleNode from '~/components/ConnectGoogleNode.vue'
import EjecutarSubidaNode from '~/components/EjecutarSubidaNode.vue'
import InputNode from '../components/InputNode.vue'
import ValidationNode from '../components/ValidationNode.vue'
import ExecuteNode from '../components/ExecuteNode.vue'
import OutputNode from '../components/OutputNode.vue'
import TaskNode from '../components/TaskNode.vue'
import CodeNode from '../components/CodeNode.vue'
import FormNode from '../components/FormNode.vue'

const { onConnect, project } = useVueFlow()
const trashZone = ref<HTMLElement | null>(null)

// Nodes and edges
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

// Form data and result
const formData = ref({
  nombre: '',
  apellido: ''
})
const resultado = ref('')

// Google Drive auth
const googleAuthUrl = ref('')
const isGoogleAuthed = ref(false)

// Flow state
const flowState = ref({})
const isCtrlPressed = ref(false)

// Node types
const nodeTypes = {
  inputNode: InputNode,
  validationNode: ValidationNode,
  executeNode: ExecuteNode,
  outputNode: OutputNode,
  detectChanges: DetectChangesNode,
  getFileInfo: GetFileInfoNode,
  uploadToCloud: UploadToCloudNode,
  registerUpload: RegisterUploadNode,
  notifyUser: NotifyUserNode,
  sendEmail: SendEmailNode,
  moveFile: MoveFileNode,
  notifySlack: NotifySlackNode,
  generateThumbnail: GenerateThumbnailNode,
  runScript: RunScriptNode,
  connectGoogle: ConnectGoogleNode,
  ejecutarSubida: EjecutarSubidaNode,
  taskNode: TaskNode,
  codeNode: CodeNode,
  formNode: defineComponent(FormNode),
}

// Drag nodes
const dragNodes = [
  {
    id: 'connect-google',
    type: 'connectGoogle',
    data: { label: 'Conectar Google Drive' },
    description: 'Nodo para conectar tu cuenta de Google Drive',
  },
  {
    id: 'input-name',
    type: 'inputNode',
    data: { label: 'Nombre', field: 'nombre' },
  },
  {
    id: 'input-apellido',
    type: 'inputNode',
    data: { label: 'Apellido', field: 'apellido' },
  },
  {
    id: 'validation',
    type: 'validationNode',
    data: { label: 'Validar Datos' },
  },
  {
    id: 'output',
    type: 'outputNode',
    data: { label: 'Resultado' },
  },
  {
    id: 'detectChanges',
    type: 'detectChanges',
    data: { label: 'Detectar Cambios en Carpeta', description: 'Monitoriza carpeta local y emite eventos de archivos nuevos o modificados.' },
  },
  {
    id: 'getFileInfo',
    type: 'getFileInfo',
    data: { label: 'Obtener Info del Archivo', description: 'Extrae metadata del archivo detectado.' },
  },
  {
    id: 'uploadToCloud',
    type: 'uploadToCloud',
    data: { label: 'Subir Archivo a la Nube', description: 'Sube el archivo a Google Drive o Dropbox.' },
  },
  {
    id: 'registerUpload',
    type: 'registerUpload',
    data: { label: 'Registrar Subida', description: 'Guarda log con nombre, fecha/hora y estado.' },
  },
  {
    id: 'notifyUser',
    type: 'notifyUser',
    data: { label: 'Notificar Usuario', description: 'Muestra notificación visual o email.' },
  },
  {
    id: 'sendEmail',
    type: 'sendEmail',
    data: { label: 'Enviar Email', description: 'Envía un email tras la subida.' },
  },
  {
    id: 'moveFile',
    type: 'moveFile',
    data: { label: 'Mover Archivo', description: 'Mueve archivo a carpeta destino.' },
  },
  {
    id: 'notifySlack',
    type: 'notifySlack',
    data: { label: 'Notificar Slack', description: 'Envía mensaje a Slack.' },
  },
  {
    id: 'generateThumbnail',
    type: 'generateThumbnail',
    data: { label: 'Generar Miniatura', description: 'Genera miniatura de imagen.' },
  },
  {
    id: 'runScript',
    type: 'runScript',
    data: { label: 'Ejecutar Script', description: 'Ejecuta script personalizado.' },
  },
  {
    id: 'taskNode1',
    type: 'taskNode',
    position: { x: 100, y: 150 },
    data: {
      titulo: 'Implementar login',
      estado: 'pendiente',
      responsable: 'Iván',
      prioridad: 'alta',
    },
  },
  {
  id: 'codeNode',
  type: 'codeNode',
  position: { x: 300, y: 400 },
  data: {
    lenguaje: 'JavaScript',
    codigo: `function saludar(nombre) {
  return 'Hola ' + nombre;
}`,
    editable: true,
  },
},
{
  id: 'super1',
  type: 'formNode',
  position: { x: 600, y: 300 },
  data: {
    title: 'Perfil Usuario',
    editable: true,
    roles: ['Admin', 'Editor', 'Viewer'],
    initialValues: {
      nombre: 'Iván',
      activo: true,
      rol: 'Editor',
      descripcion: 'Me gusta programar con Vue Flow',
    },
    onSubmit: (datos) => {
      console.log('Datos enviados desde SuperNode:', datos)
      alert(`Enviado: ${JSON.stringify(datos, null, 2)}`)
    },
    bgColor: '#e6f0ff',
    borderColor: '#3b82f6',
  },
}


]

// Persistence
watch(nodes, (val) => {
  try {
    localStorage.setItem('vueflow_nodes', JSON.stringify(val))
  } catch (e) {
    console.error('Error saving nodes:', e)
  }
}, { deep: true })

watch(edges, (val) => {
  try {
    localStorage.setItem('vueflow_edges', JSON.stringify(val))
  } catch (e) {
    console.error('Error saving edges:', e)
  }
}, { deep: true })

// Load saved state
onMounted(() => {
  loadSavedState()
  setupEventListeners()
  fetchGoogleAuthUrl()
  handleGoogleDriveCallback()
})

function loadSavedState() {
  try {
    const savedNodes = localStorage.getItem('vueflow_nodes')
    const savedEdges = localStorage.getItem('vueflow_edges')
    
    if (savedNodes) nodes.value = JSON.parse(savedNodes)
    if (savedEdges) edges.value = JSON.parse(savedEdges)
    
    if (!savedNodes && !savedEdges) {
      initializeDefaultFlow()
    }
  } catch (e) {
    console.error('Error loading flow:', e)
    initializeDefaultFlow()
  }
}

function initializeDefaultFlow() {
  nodes.value = [
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

  edges.value = [
    { id: 'e1-3', source: 'node-1', target: 'node-3', animated: true },
    { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
    { id: 'e3-4', source: 'node-3', target: 'node-4', animated: true },
    { id: 'e4-5', source: 'node-4', target: 'node-5', animated: true },
  ]
}

function setupEventListeners() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
}

// Event handlers
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Control') {
    isCtrlPressed.value = true
  }
}

function handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Control') {
    isCtrlPressed.value = false
  }
}

function onNodeDragStop(event: MouseEvent, node: Node) {
  const trashEl = trashZone.value
  if (!trashEl) return

  const trashRect = trashEl.getBoundingClientRect()
  const { clientX, clientY } = event

  const isOverTrash = (
    clientX >= trashRect.left &&
    clientX <= trashRect.right &&
    clientY >= trashRect.top &&
    clientY <= trashRect.bottom
  )

  if (isOverTrash) {
    deleteNode(node.id)
  }
}

function onNodeClick(event: MouseEvent, node: Node) {
  if (event.ctrlKey) {
    event.preventDefault()
    event.stopPropagation()
    deleteNode(node.id)
  }
}

function deleteNode(nodeId: string) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
}

function onDragStart(event: DragEvent, nodeType: string, nodeData: any) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify({ 
      type: nodeType, 
      data: nodeData 
    }))
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDrop(event: DragEvent) {
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

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onPaneReady() {
  console.log('Panel ready')
}

// Form logic
function updateFormData(field: string, value: string) {
  formData.value[field] = value
}

function validateData() {
  if (!formData.value.nombre.trim()) {
    return 'El nombre es requerido'
  }
  if (!formData.value.apellido.trim()) {
    return 'El apellido es requerido'
  }
  return null
}

function executeFlow() {
  const validationError = validateData()
  if (validationError) {
    resultado.value = `Error: ${validationError}`
    return
  }
  
  resultado.value = `¡Hola ${formData.value.nombre} ${formData.value.apellido}!`
}

// Connection handler
onConnect((params) => {
  const newEdge = {
    ...params,
    id: `e${params.source}->${params.target}`,
    animated: true,
  }
  edges.value = addEdge(newEdge, edges.value)
})

// Google Drive functions
async function fetchGoogleAuthUrl() {
  try {
    const res = await fetch('/api/google-drive-auth')
    const data = await res.json()
    if (data.url) {
      googleAuthUrl.value = data.url
    }
  } catch (e) {
    console.error('Error fetching Google auth URL:', e)
  }
}

async function handleGoogleDriveCallback() {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (code) {
    try {
      const res = await $fetch(`/api/google-drive-token?code=${code}`)
      const data = await res.json()
      if (data.tokens) {
        localStorage.setItem('googleDriveTokens', JSON.stringify(data.tokens))
        isGoogleAuthed.value = true
      }
    } catch (e) {
      console.error('Error handling Google callback:', e)
    }
    url.searchParams.delete('code')
    window.history.replaceState({}, document.title, url.pathname)
  }
}

// File upload logic
const fileInputRef = ref<HTMLInputElement | null>(null)

function openFileSelector() {
  fileInputRef.value?.click()
}

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  runUploadFlow(Array.from(input.files))
}

async function runUploadFlow(files: File[]) {
  const tokensStr = localStorage.getItem('googleDriveTokens')
  if (!tokensStr) {
    alert('Primero conecta Google Drive')
    return
  }
  
  const tokens = JSON.parse(tokensStr)
  
  for (const file of files) {
    const formData = new FormData()
    formData.append('name', file.name)
    formData.append('mimeType', file.type || 'application/octet-stream')
    formData.append('buffer', file)
    formData.append('tokens', JSON.stringify(tokens))
    
    try {
      const res = await $fetch('/api/google-drive-upload', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (result.id) {
        alert('Archivo subido: ' + result.name)
      } else {
        alert('Error subiendo archivo: ' + (result.error || JSON.stringify(result)))
      }
    } catch (err) {
      alert('Error subiendo archivo: ' + err)
    }
  }
}

async function onEjecutarSubidaNode(nodeId: string) {
  const detectNode = nodes.value.find(n => n.type === 'detectChanges')
  if (!detectNode) {
    alert('Debes conectar un nodo "Detectar Cambios" antes de ejecutar la subida')
    return
  }
  
  try {
    const dirHandle = await window.showDirectoryPicker()
    if (!dirHandle) return

    const lastFiles = new Map<string, number>()
    
    async function scanAndUpload() {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile()
          const mtime = file.lastModified
          if (!lastFiles.has(file.name) || lastFiles.get(file.name) !== mtime) {
            lastFiles.set(file.name, mtime)
            await runUploadFlow([file])
          }
        }
      }
      setTimeout(scanAndUpload, 2000)
    }
    
    scanAndUpload()
    alert('Observando carpeta y subiendo cambios automáticamente...')
  } catch (e) {
    alert('No se pudo seleccionar carpeta: ' + e)
  }
}

// Flow execution
async function runFlow(startNodeId: string) {
  const nodeMap = Object.fromEntries(nodes.value.map(n => [n.id, n]))
  const edgeMap = edges.value.reduce((acc, e) => {
    if (!acc[e.source]) acc[e.source] = []
    acc[e.source].push(e.target)
    return acc
  }, {} as Record<string, string[]>)
  
  let currentNodeId = startNodeId
  let payload = {}
  const log = []
  
  while (currentNodeId) {
    const node = nodeMap[currentNodeId]
    if (!node) break
    
    switch (node.type) {
      case 'detectChanges':
        payload = { ...payload, file: { name: 'nuevo_archivo.txt', size: 1234 } }
        log.push('Detectado archivo: ' + payload.file.name)
        break
      case 'getFileInfo':
        payload = { ...payload, info: { ext: 'txt', ...payload.file } }
        log.push('Extraída metadata: ' + JSON.stringify(payload.info))
        break
      case 'uploadToCloud':
        // eslint-disable-next-line no-case-declarations
        const upRes = await api.uploadToCloud(payload.file, node.data?.provider || 'googleDrive')
        payload = { ...payload, upload: upRes }
        log.push('Subida: ' + (upRes.success ? 'OK' : 'Fallo'))
        break
      case 'registerUpload':
        payload = { ...payload, log: { ...payload.upload, date: new Date().toISOString() } }
        log.push('Registrado en log')
        break
      case 'notifyUser':
        log.push('Notificado usuario (' + (node.data?.type || 'popup') + ')')
        break
      case 'sendEmail':
        await api.sendEmail(node.data?.to || 'test@email.com', payload.file)
        log.push('Email enviado')
        break
      case 'moveFile':
        log.push('Archivo movido a ' + (node.data?.dest || '/destino'))
        break
      case 'notifySlack':
        await api.notifySlack(node.data?.channel || '#general', 'Backup realizado')
        log.push('Slack notificado')
        break
      case 'generateThumbnail':
        await api.generateThumbnail(payload.file, node.data?.width || 128, node.data?.height || 128)
        log.push('Miniatura generada')
        break
      case 'runScript':
        await api.runScript(node.data?.script || '', payload.file)
        log.push('Script ejecutado')
        break
      default:
        log.push('Nodo ejecutado: ' + node.type)
    }
    
    const next = (edgeMap[currentNodeId] || [])[0]
    currentNodeId = next
  }
  
  flowState.value = { log, payload }
}

function runBackupDemo() {
  const startNode = nodes.value.find(n => n.type === 'detectChanges')
  if (startNode) runFlow(startNode.id)
}

// API simulation
const api = {
  uploadToCloud: async (file: { name: string }, provider: string) => {
    if (provider !== 'googleDrive') {
      await new Promise(r => setTimeout(r, 700))
      if (Math.random() > 0.2) return { success: true, url: 'https://fakecloud.com/' + file.name }
      return { success: false, error: 'Error al subir archivo' }
    }
    
    const tokens = JSON.parse(localStorage.getItem('googleDriveTokens') || 'null')
    if (!tokens) return { success: false, error: 'No autenticado en Google Drive' }
    
    const buffer = new TextEncoder().encode('Contenido de ejemplo')
    const res = await fetch('/api/google-drive-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        mimeType: 'text/plain',
        buffer: Array.from(buffer),
        tokens
      })
    })
    
    const data = await res.json()
    if (data.id) return { success: true, url: data.webViewLink }
    return { success: false, error: 'Error en subida Google Drive' }
  },
  sendEmail: async (_to: string, _file: any) => {
    await new Promise(r => setTimeout(r, 400))
    return { sent: true }
  },
  notifySlack: async (_channel: string, _msg: string) => {
    await new Promise(r => setTimeout(r, 300))
    return { notified: true }
  },
  generateThumbnail: async (file: any, _width: number, _height: number) => {
    await new Promise(r => setTimeout(r, 500))
    return { url: 'https://fakecdn.com/thumb/' + file.name }
  },
  runScript: async (_script: string, _file: any) => {
    await new Promise(r => setTimeout(r, 600))
    return { output: 'Script ejecutado correctamente' }
  },
}
</script>

<template>
  <div class="app-container">
    <div class="sidebar">
      <h3>Nodos disponibles</h3>
      <ul>
        <li 
          v-for="node in dragNodes" 
          :key="node.id"
          draggable="true" 
          @dragstart="(e) => onDragStart(e, node.type, node.data)"
        >
          {{ node.data.label }}
          <small v-if="node.description">{{ node.description }}</small>
        </li>
      </ul>
    </div>
    
    <div class="ctrl-indicator" :class="{ 'active': isCtrlPressed }">
      Modo eliminación (Ctrl + clic)
    </div>
    
    <div class="node-toolbar">
      <NodeToolbar :node-types="nodeTypes" :drag-nodes="dragNodes" direction="vertical" />
    </div>
    
    <input 
      ref="fileInputRef" 
      type="file" 
      multiple 
      style="display:none" 
      @change="onFilesSelected" 
    >
    
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
        fit-view
        @connect="onConnect"
        @drop="onDrop"
        @dragover="onDragOver"
        @node-click="onNodeClick"
        @node-drag-stop="onNodeDragStop"
        @pane-ready="onPaneReady"
      >
        <Background />
        
        <!-- Node templates -->
        <template #node-inputNode="{ data, id }">
          <InputNode 
            :label="data.label" 
            :field="data.field" 
            @update:value="(val) => updateFormData(data.field, val)" 
          />
        </template>
        
        <template #node-validationNode="{ data }">
          <ValidationNode :label="data.label" :is-valid="!validateData()" />
        </template>
        
        <template #node-executeNode="{ data }">
          <ExecuteNode :label="data.label" @execute="executeFlow" />
        </template>
        
        <template #node-outputNode="{ data }">
          <OutputNode :label="data.label" :result="resultado" />
        </template>
        
        <template #node-detectChanges="{ data }">
          <DetectChangesNode :label="data.label" />
        </template>
        
        <template #node-getFileInfo="{ data }">
          <GetFileInfoNode :label="data.label" />
        </template>
        
        <template #node-uploadToCloud="{ data }">
          <UploadToCloudNode :label="data.label" />
        </template>
        
        <template #node-registerUpload="{ data }">
          <RegisterUploadNode :label="data.label" />
        </template>
        
        <template #node-notifyUser="{ data }">
          <NotifyUserNode :label="data.label" />
        </template>
        
        <template #node-sendEmail="{ data }">
          <SendEmailNode :label="data.label" />
        </template>
        
        <template #node-moveFile="{ data }">
          <MoveFileNode :label="data.label" />
        </template>
        
        <template #node-notifySlack="{ data }">
          <NotifySlackNode :label="data.label" />
        </template>
        
        <template #node-generateThumbnail="{ data }">
          <GenerateThumbnailNode :label="data.label" />
        </template>
        
        <template #node-runScript="{ data }">
          <RunScriptNode :label="data.label" />
        </template>
        
        <template #node-connectGoogle="{ data }">
          <ConnectGoogleNode 
            :label="data.label" 
            :auth-url="googleAuthUrl" 
            :is-authed="isGoogleAuthed" 
            @auth="fetchGoogleAuthUrl"
          />
        </template>
        
        <template #node-ejecutarSubida="{ data, id }">
          <EjecutarSubidaNode 
            :label="data.label" 
            @ejecutar-subida="onEjecutarSubidaNode(id)" 
          />
        </template>
      </VueFlow>
    </div>
    
    <div ref="trashZone" class="trash-zone">
      🗑️ Papelera
    </div>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;
}

.sidebar {
  width: 250px;
  background: #f8f9fa;
  padding: 15px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.sidebar h3 {
  margin-bottom: 15px;
  color: #2d3748;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.sidebar li:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.sidebar li small {
  display: block;
  font-size: 0.8em;
  color: #64748b;
  margin-top: 4px;
}

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
}

.ctrl-indicator.active {
  opacity: 1;
  transform: translateY(0);
}

.node-toolbar {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 20;
}

.flow-container {
  flex: 1;
  height: 100%;
  position: relative;
  background: #f8fafc;
}

.trash-zone {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #ffdddd;
  border: 2px dashed #ff4444;
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: bold;
  z-index: 1000;
  transition: background-color 0.3s;
}

.trash-zone.over {
  background-color: #ffaaaa;
}

.custom-node {
  background: white;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.vue-flow__node-toolbar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,.08);
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 170px;
  z-index: 99;
}

.vue-flow__node-toolbar__item {
  cursor: grab;
  padding: 8px 16px;
  border-radius: 4px;
  background: #f4f4f5;
  color: #222;
  font-size: 14px;
  transition: background .2s;
  border: none;
  outline: none;
  width: 100%;
  text-align: left;
}

.vue-flow__node-toolbar__item:hover {
  background: #e0e7ff;
  color: #1d4ed8;
}

.vue-flow__node-toolbar__item:active {
  background: #c7d2fe;
}
</style>