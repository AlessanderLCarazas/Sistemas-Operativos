/**
 * crea un objetode tipo proceso que sea manipulable para las colas
 * @param {int} id  el id del proceso (Pid)
 * @param {int} at  en tiempo de entrada (Arraiving time)
 * @param {int} ext  el tiempo de ejecucion (Execution Time)
 * @param {int} prl  el nivel de prioridad
 * @returns {object} RR process object
 */
function RRprocess(id, at, ext, prl, color, name) {
  this.id = id;
  this.at = at;            // Arraiving time
  this.ext = ext;          // Execution time
  this.prl = prl;          // Priority level
  this.totalduration = ext;
  this.realtimeBuffer = ext;
  this.color = color;
  this.name = name;        // Nombre del proceso
}


var processesCounter = 1;
var prlis = [];
var realTimeQuewe = [];
var currentProcess;
var burstcounter;
var quantum;
var running = false;

function setup() {
  frameRate(12);
  burstcounter = 0;
  currentProcess = {};
  createCanvas(1100, 300);
  addcontainer();
  addTable();
  quantum = 0 | document.getElementById("inputQ").value;
}

function draw() {
  updateTables();
  if (running) {
    drawstuff();
  } else {   
    if(realTimeQuewe.length == 0){
        background(225);
    }
  }
}

/**
 * dibuja lo eferente al canvas
 * @date 2021-03-07
 * @returns {any}
 */
function drawstuff() {
  drawPNames();
  prlis.forEach((element) => {
    if (element.at == burstcounter) {
      realTimeQuewe.push(element);
      console.log("agregado a la RTQ");
    }
  });

  if (realTimeQuewe.length > 0) {
    if (
      realTimeQuewe[0].realtimeBuffer >
        realTimeQuewe[0].totalduration - quantum &&
      realTimeQuewe[0].totalduration - quantum >= 0
    ) {
      realTimeQuewe[0].realtimeBuffer--;
    } else if (
      realTimeQuewe[0].realtimeBuffer == 0 ||
      realTimeQuewe[0].realtimeBuffer ==
        realTimeQuewe[0].totalduration - quantum
    ) {      
      headToBack();
    } else if (
      realTimeQuewe[0].realtimeBuffer > 0 &&
      realTimeQuewe[0].totalduration - quantum < 0
    ) {
      realTimeQuewe[0].realtimeBuffer--;
    }
  }
  drawlines();
  burstcounter++;
}

/**
 * dibuja las lineas de tiempo
 * @date 2021-03-07
 * @returns {any}
 */
function drawlines() {  
  strokeWeight(4);
  for (index = 1; index <= prlis.length; index++) {
    if (realTimeQuewe.length > 0) {
      try {
        if (realTimeQuewe[0].id == index) {
          drawRedLine(index,realTimeQuewe[0].color);
        } else {
          drawWhiteLine(index);
        }
      } catch (error) {
        drawWhiteLine(index);
      }
    } else {
      drawWhiteLine(index);
    }
  }
}

/**
 * dibuja unalinea eferente al proceso con su color
 * @date 2021-03-07
 * @param {any} index
 * @param {any} color
 * @returns {any}
 */
function drawRedLine(index,color) {
  htime = getHTime();
  var x =  125 + map(burstcounter, 0, 100, 20, 300);
  var y = 29 * index;
  color2 = exToRGB(color);
  stroke(color2.r,color2.g, color2.b);
  line(x, y, x, y + 16);
  stroke(255);
}

/**
 * convierte exadecimal a rgb
 * @date 2021-03-07
 * @param {any} exColor
 * @returns {any}
 */
function exToRGB(exColor){
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(exColor); 
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


/**
 * dibuja las linear referentes a momentos en los que el proceso no
 * se esta ejecutando
 * @date 2021-03-07
 * @param {any} index
 * @returns {any}
 */
function drawWhiteLine(index) {
  htime = getHTime();
  var x = 125 + map(burstcounter, 0, 100, 20, 300);
  var y = 29 * index;
  stroke(255, 255, 255);
  line(x, y, x, y + 16);
}

/**
 * muestra la cola en tiempo real de los procesos
 * @date 2021-03-07
 * @returns {any}
 */
function headToBack() {
  // reiniciendo el buffer
  if (realTimeQuewe.length > 0) {
    realTimeQuewe[0].totalduration = realTimeQuewe[0].realtimeBuffer;
    if (realTimeQuewe[0].totalduration > 0) {
      var buffer = realTimeQuewe[0];
      realTimeQuewe.splice(0, 1);
      realTimeQuewe.push(buffer);
    } else {
      realTimeQuewe.splice(0, 1);
      //console.log("eliminado de la cabeza");
    }
  }
  // colocando el de mayor prioridad en la cola
  higestP = Math.max.apply(null,realTimeQuewe.map(o => {return parseInt(o.prl);}));  
  prbuffer = realTimeQuewe.filter(o => o.prl == higestP)[0];  
  if(prbuffer){
    realTimeQuewe.splice(realTimeQuewe.indexOf(prbuffer), 1);
    realTimeQuewe.unshift(prbuffer);
    if(prbuffer.prl>1){prbuffer.prl--;}
  }
  
}

/**
 *dibuja los nobres P1,P2... en el canvas
 * @date 2021-03-07
 * @returns {any}
 */
 function drawPNames() {
  prlis.forEach((process) => {
    textSize(11);
    text(process.name, 2, 15 + 29 * (prlis.indexOf(process) + 1));
  });
}


/**
 * obtiene el tiempo maximo de ejecucion
 * @date 2021-03-07
 * @returns {any}
 */
function getHTime() {
  var res = -1;
  prlis.forEach((element) => {
    var at = parseInt("" + element.at);
    var ext = parseInt("" + element.ext);   
    res += ext;
  });
  res = res/prlis.length;// tiempo medio de ejecucion  
  return res+(2.4*prlis.length)*(map(quantum, 1, 1000, 5, 1));
}

/**
 * metodo que se ejecuta cuando el proceso se pausa
 * @date 2021-03-07
 * @returns {any}
 */
function drawPause() {
  clear();
  background(225);
  textFont("Georgia");
  textSize(32);
  text("Add processes to the list and then", 50, 130);
  text("Press start to see the Execution timeline", 50, 170);
  fill(0, 102, 153);
}

/**
 *metodo que coloca la tabla de procesos
 * @date 2021-03-07
 * @returns {any}
 */
function addTable() {
  tableContainer = createDiv();
  tableContainer.position(200, 320);
  tableContainer.size(600, 300);
  tableContainer.addClass("tables-container");
  RRproclist = createDiv(`
    <table class="processT">
    <thead>
        <tr>
            <th>Pid</th>
            <th>Arraiving time</th>
            <th>Execution time</th>
            <th>Priority level</th>
        </tr> 
    </thead> 
    <tbody id="processT">    
    </tbody>
    </table>`);
  RRproclist.addClass("processes-table");
  tableContainer.child(RRproclist);
  quewe = createDiv(`
    <table class="processT"">
    <thead>
        <tr>
            <th>Real time quewe</th>
        </tr> 
    </thead> 
    <tbody id="processQ">    
    </tbody> 
    </table>`);
  quewe.addClass("quewe-table");
  tableContainer.child(quewe);
}

/**
 * metodo que agrega el contenedor conde se coloca la mayoria de items
 * @date 2021-03-07
 * @returns {any}
 */
function addcontainer() {
  container = createDiv();
  container.position(1150, 0);
  title = createP("<h1>Process Visualizer</h1>");
  container.child(title);
  labelProcesses = createP("<p>Select Process</p>");
  container.child(labelProcesses);
  dropdown = createSelect();
  dropdown.id("processDropdown");
  container.child(dropdown);
  dropdown.option('-- Select a process --');
  labelAT = createP("<p>Arraiving Time (aT)</p>");
  container.child(labelAT);
  inputAT = createInput(null, "number");
  inputAT.id("inputAT");
  container.child(inputAT);
  LabelET = createP("<p>Execution time (xT)</p>");
  container.child(LabelET);
  inputET = createInput(null, "number");
  inputET.id("inputET");
  container.child(inputET);
  LabelPr = createP("<p>Priority level</p>");
  container.child(LabelPr);
  inputPr = createInput(null, "number");
  inputPr.id("inputPr");
  container.child(inputPr);
  btnSend = createButton("Add Process", "").size(200, 60);
  btnSend.mousePressed(addProcess);
  btnSend.addClass("btn-send");
  container.child(btnSend);

  title = createP("<h3>Algoritmos</h3>");
  container.child(title);

  labelQ = createP("<p>Quantum:</p>");
  container.child(labelQ);
  inputQ = createInput(10, "number");
  inputQ.id("inputQ");
  container.child(inputQ);

  btnPlay = createButton("Round-Robin", "").size(200, 35);
  btnPlay.mousePressed(playRR);
  btnPlay.addClass("btn-send");
  container.child(btnPlay);

  btnFCFS = createButton("FCFS (First Come First Served)", "").size(200, 35);
  btnFCFS.mousePressed(playFCFS);
  btnFCFS.addClass("btn-send");
  container.child(btnFCFS);
  
  btnSJF = createButton("SJF (Shortest-Job-First)", "").size(200, 35);
  btnSJF.mousePressed(playSJF);
  btnSJF.addClass("btn-send");
  container.child(btnSJF);

  //btnPause = createButton("pause", "").size(200, 35);
  //btnPause.mousePressed(pauseRR);
  //btnPause.addClass("btn-send");
  //container.child(btnPause);

  btnRestart = createButton("reset", "").size(200, 35);
  btnRestart.mousePressed(function () {
    resetThis();
  });
  btnRestart.addClass("btn-send");
  container.child(btnRestart);
  // btnNQ = createButton("jump quantum", "").size(200, 35);
  // btnNQ.mousePressed(jumpQuantum);
  // btnNQ.addClass("btn-send");
  // container.child(btnNQ);
  container.size(300, 850);
  container.addClass("form-Container");
  fetchProcesses();
}

// Función para obtener los procesos desde la API Flask
function fetchProcesses() {
  fetch('http://localhost:5000/processes')  // Cambia la URL si es necesario
    .then(response => response.json())
    .then(data => {
        // Limpiar el dropdown previo
        dropdown.html("<option value=''>-- Select a process --</option>");

        // Llenar el dropdown con los procesos
        data.forEach(process => {
            dropdown.option(`PID: ${process.pid} - ${process.name}`, process.pid);
        });
    })
    .catch(error => console.error('Error al obtener los procesos:', error));
}


/**
 * metodo para arancar
 * @date 2021-03-07
 * @returns {any}
 */
function playRR() {
  quantum = document.getElementById("inputQ").value;
  running = true;
}


function playFCFS() {
  // Ordenar los procesos por tiempo de arribo (at)
  prlis.sort((a, b) => a.at - b.at);

  running = true;

  // Inicializar el índice del proceso actual
  let currentIndex = 0;

  // Ejecutar el proceso actual
  function executeProcesses() {
    if (currentIndex < prlis.length) {
      let process = prlis[currentIndex];

      // Si el proceso aún no ha sido agregado a la cola en tiempo real
      if (!realTimeQuewe.includes(process)) {
        realTimeQuewe.push(process);
      }

      // Reducir el buffer de tiempo real del proceso
      process.realtimeBuffer--;

      if (process.realtimeBuffer <= 0) {
        // Si el proceso actual termina, removerlo de la cola y pasar al siguiente
        realTimeQuewe.shift();
        currentIndex++;
      }
    } else {
      // Cuando todos los procesos hayan sido ejecutados, detener la simulación
      running = false;
    }
  }

  // Función personalizada de dibujo para FCFS
  function drawFCFS() {
    // Actualizar el canvas
    if (running) {
      drawstuff();  // Esta función debe hacer el dibujo en el canvas
      executeProcesses();
    } else {
      drawstuff();
    }

    // Después de cada ejecución, actualizamos las tablas
    updateTables();
  }

  // Sobrescribir el draw() para manejar FCFS
  draw = drawFCFS;
}

function playSJF() {
  running = true;
  // Primero ordenar los procesos por su tiempo de ejecución (ext)
  prlis.sort((a, b) => a.ext - b.ext);

  // Inicializar el contador de tiempo
  burstcounter = 0;
  realTimeQuewe = [];

  // Iniciar la ejecución de los procesos
  executeSJF();
}

function executeSJF() {
  // Si aún hay procesos en la lista
  if (prlis.length > 0) {
    // Seleccionar el proceso que está listo para ejecutarse (basado en el tiempo de llegada)
    prlis.forEach((process, index) => {
      if (process.at <= burstcounter) {
        // Si el proceso ya ha llegado, agregarlo a la cola de ejecución
        realTimeQuewe.push(process);
        prlis.splice(index, 1); // Eliminar el proceso de la lista original
      }
    });

    // Ejecutar el primer proceso de la cola (el que tiene el menor tiempo de ejecución)
    if (realTimeQuewe.length > 0) {
      let currentProcess = realTimeQuewe.shift(); // Obtener el proceso con el menor tiempo de ejecución
      executeProcess(currentProcess);
    }
  }
}

function executeProcess(process) {
  // Mostrar el nombre y el tiempo de ejecución en el canvas
  console.log(`Ejecutando el proceso ${process.name} (PID: ${process.id})`);

  // Simular el tiempo de ejecución del proceso (disminuir el tiempo de ejecución)
  let executionTime = process.ext;
  let timeInterval = setInterval(() => {
    if (executionTime > 0) {
      executionTime--;
      // Actualizar la visualización en el canvas
      drawExecution(process);
    } else {
      // El proceso terminó su ejecución
      clearInterval(timeInterval);
      console.log(`Proceso ${process.name} completado`);
      // Continuar con el siguiente proceso SJF
      executeSJF();
    }
  }, 1000); // Simular la ejecución cada segundo
}

function drawExecution(process) {
  // Dibujar la línea de ejecución del proceso en el canvas
  stroke(255, 0, 0); // Color rojo
  let x = 125 + map(burstcounter, 0, 100, 20, 300);
  let y = 29 * process.id;
  line(x, y, x + 20, y + 16);
  burstcounter++; // Incrementar el contador de tiempo global
}

/**
 * metodo para pausar
 * @date 2021-03-07
 * @returns {any}
 */

/*
function pauseRR() {
  running = false;
}*/

/**
 * metodo para agregar un proceso
 * @date 2021-03-07
 * @returns {any}
 */

function addProcess() {
  // Obtener los valores de los inputs
  inputAT = document.getElementById("inputAT").value;
  inputET = document.getElementById("inputET").value;
  inputPr = document.getElementById("inputPr").value;

  // Obtener el valor seleccionado en el dropdown
  selectedProcess = document.getElementById("processDropdown").value;

  // Obtener el nombre del proceso seleccionado
  selectedProcessName = document.getElementById("processDropdown").options[document.getElementById("processDropdown").selectedIndex].text;

  if (inputAT && inputET && selectedProcess) {
    // Crear un nuevo proceso incluyendo el nombre del proceso
    newprocess = new RRprocess(
      processesCounter,
      inputAT,
      inputET,
      inputPr,
      getRandomColor(),
      selectedProcessName  // Guardar el nombre del proceso
    );
    
    // Incrementar el contador de procesos
    processesCounter++;

    // Añadir el nuevo proceso a la lista
    prlis.push(newprocess);

    // Limpiar los campos de entrada después de agregar el proceso
    document.getElementById("inputAT").value = '';
    document.getElementById("inputET").value = '';
    document.getElementById("inputPr").value = '';
    
    // Limpiar el dropdown (selección por defecto)
    document.getElementById("processDropdown").selectedIndex = 0;
  } else {
    alert("Todos los campos deben ser llenados, incluyendo el proceso seleccionado");
  }
}




/**
 * metodo para resetear el sistema
 * @date 2021-03-07
 * @returns {any}
 */
function resetThis() {
  processesCounter = 1;
  prlis = [];
  realTimeQuewe = [];
  currentProcess = {};
  burstcounter = 0;
  quantum = 0 | document.getElementById("inputET").value;
  running = false;
}

/**
 * metodo para actualizar las tablas
 * @date 2021-03-07
 * @returns {any}
 */
function updateTables() {
  document.getElementById("processT").innerHTML = "";
  document.getElementById("processQ").innerHTML = "";

  // Llenar la tabla de procesos con PID y nombre
  for (let i = 0; i < prlis.length; i++) {
    let row = document.getElementById("processT").insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4); // Nueva celda para el botón de eliminar

    // Mostrar solo el PID y el nombre del proceso
    cell1.innerHTML = `${prlis[i].name}`;
    cell2.innerHTML = prlis[i].at;
    cell3.innerHTML = prlis[i].ext;
    cell4.innerHTML = prlis[i].prl;

    // Agregar el botón de eliminar
    let deleteButton = createButton("Eliminar");
    deleteButton.mousePressed(() => deleteProcess(i)); // Pasar el índice al eliminar
    cell5.appendChild(deleteButton.elt); // Agregar el botón a la tabla
  }

  // Llenar la cola en tiempo real
  for (let j = 0; j < realTimeQuewe.length; j++) {
    let row = document.getElementById("processQ").insertRow(j);
    let cellP = row.insertCell(0);
    try {
      cellP.innerHTML = "P" + realTimeQuewe[j].id + '-' + realTimeQuewe[j].realtimeBuffer + '-' + realTimeQuewe[j].prl;
    } catch (error) {      
    }
  }
}

function deleteProcess(index) {
  // Verificar si el índice es válido
  if (index >= 0 && index < prlis.length) {
    prlis.splice(index, 1); // Eliminar el proceso en la posición 'index'
    updateTables(); // Actualizar la tabla después de eliminar el proceso
  }
}



/**
 * metodo para obtener un color aleatorio
 * @date 2021-03-07
 * @returns {any}
 */
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}