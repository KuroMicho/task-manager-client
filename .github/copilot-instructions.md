Siempre que te pida refactorizar o limpiar un componente de React, organiza el cuerpo de la función siguiendo estrictamente este orden:

1. Declaración de Hooks de estado global (Zustand) agrupados limpiamente.
2. Declaración de Hooks de React Router y mutaciones (TanStack Query).
3. Variables calculadas o estado derivado (ej. const isTasksPage = ...), siempre DEBAJO de los hooks que utilizan.
4. Funciones manejadoras de eventos (Handlers como handleLogout) al final, justo antes del return.
