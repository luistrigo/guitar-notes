# Guitarra - Aprende las Notas

Una aplicación web interactiva para aprender las notas del mástil de la guitarra de manera visual y práctica.

## Características

- **Mástil interactivo** con 6 cuerdas y 12 trastes
- **Sistema multiidioma** (Español e Inglés)
- **Dos notaciones musicales**:
  - Notación española: DO, RE, MI, FA, SOL, LA, SI
  - Notación inglesa: C, D, E, F, G, A, B
- **Interfaz moderna y responsive**
- **Diseño intuitivo** para principiantes y avanzados

## Cómo usar

1. **Abre el archivo `index.html`** en tu navegador web
2. **Selecciona el idioma** en el menú desplegable superior
3. **Elige la notación musical** que prefieras
4. **Haz clic en cualquier posición** del mástil para ver la nota correspondiente
5. **Observa la información** en el panel inferior:
   - Nota actual
   - Número de cuerda
   - Número de traste

## Funcionalidades

### Cambio de Idioma
- **Español**: Interfaz completa en español
- **English**: Interfaz completa en inglés

### Notaciones Musicales
- **DO RE MI FA**: Notación tradicional española
- **C D E F**: Notación internacional

### Interacción
- **Hover**: Al pasar el mouse sobre una posición, se resalta
- **Click**: Al hacer clic, se muestra la nota de forma permanente
- **Click fuera**: Al hacer clic fuera del mástil, se limpia la selección

## Estructura del Proyecto

```
guitarra/
├── index.html      # Archivo principal HTML
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este archivo
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **CSS Grid**: Layout responsive del mástil
- **Flexbox**: Layout de controles y paneles

## Características Técnicas

- **Responsive Design**: Funciona en dispositivos móviles y desktop
- **Accesibilidad**: Controles intuitivos y claros
- **Performance**: Código optimizado y eficiente
- **Cross-browser**: Compatible con navegadores modernos

## Notas Musicales

### Afinación Estándar (de la 1ª a la 6ª cuerda)
- **1ª cuerda**: MI (E)
- **2ª cuerda**: SI (B)
- **3ª cuerda**: SOL (G)
- **4ª cuerda**: RE (D)
- **5ª cuerda**: LA (A)
- **6ª cuerda**: MI (E)

### Cálculo de Notas
La aplicación calcula automáticamente las notas basándose en:
1. La nota de la cuerda al aire
2. El número de semitonos (trastes) desde la cuerda al aire
3. La escala cromática de 12 notas

## Uso Educativo

Esta aplicación es perfecta para:
- **Principiantes**: Aprender las notas básicas del mástil
- **Estudiantes**: Practicar la identificación de notas
- **Profesores**: Enseñar teoría musical de manera visual
- **Músicos**: Referencia rápida de notas

## Contribuciones

Si quieres mejorar la aplicación, puedes:
- Agregar más idiomas
- Incluir más notaciones musicales
- Añadir ejercicios interactivos
- Implementar un modo de práctica

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.
