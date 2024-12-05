<<<<<<< HEAD
Seminario de Licenciatura en Ingeniería (AINC421)

Facultad de Ingeniería
Ingeniería en Computación e Informática
Universidad Andrés Bello

APLICATIVO WEB Y MÓVIL
    # i-Reportnp

AUTOR
=======
AINC421
Seminario de Licenciatura en Ingeniería

Facultad de Ingeniería
Ingeniería en Computación e Informática

APLICATIVO WEB Y MÓVIL
    # i-Report

>>>>>>> 0f7aa753cd1e6055f5de1cf9377f4b5d6554d371
Nombre	: Pablo Daniel Reyes G.
Rut		: 10.656.277-6
Correo		: p.reyesgutirrez@uandresbello.edu

A modo de contextualizar este desarrollo es un Proyecto para Optar al Título de Ingeniero en Computación e Informática trabajando oportunidades de mejoras en relación con la gestión de informes de mantenimiento para empresas del área de generación eléctrica. 

Se expuso que el objetivo general del proyecto es:

“Sistematizar el reporte de las actividades que realiza un equipo de mantenimiento de una empresa del rubro de generación de energía eléctrica en Chile por medio de una solución informática con el fin de mejorar la gestión del mantenimiento.”

La plataforma deberá contar con las siguientes funcionalidades:
•	Funcionalidad de Ambientes gráficos con despliegues y menús para acceder a Formularios desde aplicativo web y móvil. (En curso)
•	Funcionalidades de Usuarios y Autenticación. (Logrado)
•	Funcionalidad de Formularios con campos integrados con BD Cloud. (Logrado)
•	Funcionalidad de llenado de campos con criterios de validaciones para integridad de la información (Logrado)
•	Funcionalidad de Carga, Consulta y Modificación datos en Formularios y BD.(Logrado)
•	Funcionalidad de Envío de Formulario en Formato PDF.(Pendiente)
•	Funcionalidad de Despliegue de Métricas. (Pendiente)


<<<<<<< HEAD
Desarrollo
Las Principales dependencias del Código son:

Node.js v22.11.0 - integración Java
npm v10.9.1n
noCapacitor V6.1.2   -  funcionalidades como captura de imagen, generación del APK.
Ionic Framework V5.4.16 - framework de diseño basado en angular.

pdfMake V0.2.15


Release:

2024-10-15: Commit Inicial: Creación del Proyecto en Blanco
-Proyecto en Blanco, base.

2024-11-17: Commit_N2: Diseño Modelo Vista y Controlador de Autenticación.
-Módulo de Autenticación de usuarios Funcional vía Servicios de Firebase Auth.
-Módulo de Creación de Usuario Funcional vía Servicios de Firebase Auth.
-Módulo de envío de correo para recuperación de contraseña Funcional vía Firebase Auth.


2024-11-24: Commit_N3: Diseño de Modelo Vista y Controlador de Formulario, integración con BD para carga y Consulta.
-Arregla conflicto de fechas que permitía guardar y no traían de vuelta. ion-date -> ion-input type:"date".
-Arregla conflicto al traer formulario para edición, modelo User estaba incompleto
-Arregla conflicto al iniciar responsable con el email de usuario, no se había definido user, antes de crear el formgroup.

2024-XX-XX: Commit_N4: Mejoras
-Arregla la posibilidad de editar la foto cuando se edita un formulario. Se integra la función en el avatar de la foto.
-Se corrije texto de botón cuando se actualiza.
-Se corrije texto del header de crear formulario.
-Se integra exportación a PDF.
Se adecúa almacenamiento para que los reportes sean accesibles accesibles para todos los usuarios. 
--> 
Pendiente de integrar seguridad para la edición y borrado, borrado previa confirmación y solo por autor.
Pendiente de integrar ordenamiento por centrales.
=======


>>>>>>> 0f7aa753cd1e6055f5de1cf9377f4b5d6554d371
