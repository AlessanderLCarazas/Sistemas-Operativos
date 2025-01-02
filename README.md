# Visualizador de Procesos y Simulador de Algoritmos de Planificación

Este proyecto es el trabajo final del curso de Sistemas Operativos. Se trata de una aplicación web que permite visualizar y simular la planificación de procesos utilizando algoritmos como **Round Robin (RR)**, **First Come First Served (FCFS)** y **Shortest Job First (SJF)**.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instrucciones de Instalación](#instrucciones-de-instalación)
- [Uso](#uso)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción
El sistema consiste en un visualizador interactivo de procesos y un backend que proporciona datos de procesos del sistema en tiempo real. Los usuarios pueden:
1. Agregar procesos manualmente con datos como tiempo de llegada, tiempo de ejecución y nivel de prioridad.
2. Simular el comportamiento de los procesos bajo diferentes algoritmos de planificación.
3. Ver un canvas gráfico con líneas de tiempo para cada proceso.

---

## Características
- **Backend**: API REST desarrollada con Flask, que obtiene procesos en ejecución usando la biblioteca `psutil`.
- **Frontend**: Interfaz gráfica creada con HTML, CSS y la biblioteca `p5.js`.
- **Soporte de Algoritmos**:
  - Round Robin
  - First Come First Served
  - Shortest Job First
- **Visualización**:
  - Líneas de tiempo dinámicas que reflejan el estado y el progreso de los procesos.
  - Tablas interactivas para gestionar los procesos y su prioridad.

---

## Tecnologías Utilizadas
- **Backend**: Python 3.x, Flask, psutil
- **Frontend**: HTML5, CSS3, JavaScript (p5.js)

---

## Instrucciones de Instalación

### Requisitos Previos
1. Python 3.x instalado.
2. Instalar las dependencias necesarias:
   ```bash
   pip install flask flask-cors psutil
