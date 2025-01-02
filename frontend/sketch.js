let processes = [];         // Lista de procesos desde el backend
let selectedProcesses = []; // Procesos seleccionados por el usuario

function preload() {
  // Obtener procesos del backend
  fetch('http://127.0.0.1:5000/processes')
    .then(response => response.json())
    .then(data => {
      processes = data; // Guardar procesos obtenidos
      setupUI();        // Configurar la interfaz
    });
}

function setup() {
  createCanvas(800, 400).parent('canvas-container');
  noLoop(); // No se necesita loop para dibujar por ahora
}

function setupUI() {
  const container = select('#canvas-container');

  // Crear una sección para procesos seleccionados
  const selectedContainer = createDiv('<h3>Procesos Seleccionados</h3>').parent(container);
  selectedContainer.id('selected-processes');
  selectedContainer.style('margin-bottom', '20px');

  // Crear tabla para mostrar procesos disponibles
  const availableContainer = createDiv('<h3>Lista de Procesos Activos</h3>').parent(container);
  const table = createElement('table').parent(availableContainer);
  table.addClass('process-table');

  // Encabezados de la tabla
  const headers = createElement('tr').parent(table);
  headers.html('<th>PID</th><th>Nombre</th><th>CPU%</th><th>Acción</th>');

  // Mostrar cada proceso en una fila
  processes.forEach((proc, index) => {
    const row = createElement('tr').parent(table);
    row.html(`
      <td>${proc.pid}</td>
      <td>${proc.name}</td>
      <td>${proc.cpu_percent}</td>
      <td>
        <button onclick="addProcess(${index})">Añadir</button>
      </td>
    `);
  });
}

// Añadir un proceso seleccionado
function addProcess(index) {
  const process = processes[index];

  // Crear un nuevo objeto con datos adicionales
  const newProcess = {
    ...process,
    arrival_time: prompt('Tiempo de llegada (ms):', '0'),      // Tiempo de llegada
    execution_time: prompt('Tiempo de ejecución (ms):', '10'), // Tiempo de ejecución
    priority: prompt('Nivel de prioridad (1 = alto):', '1'),  // Nivel de prioridad
  };

  // Validar entrada y evitar duplicados
  if (!selectedProcesses.some(p => p.pid === newProcess.pid)) {
    selectedProcesses.push(newProcess);
    updateSelectedProcesses();
  } else {
    alert('Este proceso ya está seleccionado.');
  }
}

// Actualizar la lista de procesos seleccionados
function updateSelectedProcesses() {
  const container = select('#selected-processes');
  container.html('<h3>Procesos Seleccionados</h3>');

  // Crear tabla para los procesos seleccionados
  const table = createElement('table').parent(container);
  table.addClass('process-table');

  const headers = createElement('tr').parent(table);
  headers.html('<th>PID</th><th>Nombre</th><th>CPU%</th><th>Tiempo de Llegada</th><th>Tiempo de Ejecución</th><th>Prioridad</th><th>Acción</th>');

  selectedProcesses.forEach((proc, index) => {
    const row = createElement('tr').parent(table);
    row.html(`
      <td>${proc.pid}</td>
      <td>${proc.name}</td>
      <td>${proc.cpu_percent}</td>
      <td>${proc.arrival_time}</td>
      <td>${proc.execution_time}</td>
      <td>${proc.priority}</td>
      <td>
        <button onclick="removeProcess(${index})">Eliminar</button>
      </td>
    `);
  });
}

// Eliminar un proceso de la lista seleccionada
function removeProcess(index) {
  selectedProcesses.splice(index, 1);
  updateSelectedProcesses();
}
