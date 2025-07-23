# 🪟 Windows 11 Emulator

Una aplicación web completa que emula perfectamente la interfaz y funcionalidad de Windows 11. Esta aplicación proporciona una experiencia auténtica del sistema operativo Windows 11 directamente en tu navegador web.

## ✨ Características

### 🎨 Interfaz Auténtica
- **Escritorio Windows 11** con fondo dinámico y efectos visuales
- **Barra de tareas** moderna con diseño centrado
- **Menú de inicio** rediseñado con aplicaciones ancladas y recomendaciones
- **Iconos del escritorio** interactivos
- **Menú contextual** del escritorio
- **Efectos de transparencia** y blur (backdrop-filter)

### 🚀 Aplicaciones Funcionales
- **📁 Explorador de archivos** - Navegación completa con sidebar
- **🔢 Calculadora** - Completamente funcional con todas las operaciones
- **📝 Bloc de notas** - Editor de texto simple
- **🌐 Microsoft Edge** - Simulación del navegador
- **🗑️ Papelera de reciclaje** - Gestión de archivos eliminados
- **🏪 Microsoft Store** - Interfaz de la tienda de aplicaciones

### 🎯 Funcionalidades del Sistema
- **⏰ Reloj en tiempo real** en la barra de tareas
- **🔋 Iconos del sistema** (WiFi, volumen, batería)
- **🔌 Menú de energía** (Suspender, Reiniciar, Apagar)
- **🪟 Gestión de ventanas** completa:
  - Arrastrar y soltar ventanas
  - Minimizar, maximizar, cerrar
  - Cambio de foco entre ventanas
  - Redimensionamiento automático

### ⌨️ Atajos de Teclado
- `Escape` - Cerrar menús abiertos
- `Ctrl + R` - Recargar la aplicación

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con efectos avanzados
- **JavaScript (ES6+)** - Lógica de aplicación y gestión de eventos
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía Segoe UI

## 🚀 Instalación y Uso

### Opción 1: Servidor HTTP Simple
```bash
# Con Python
python -m http.server 8000

# O con Python 3
python3 -m http.server 8000

# Luego abre http://localhost:8000 en tu navegador
```

### Opción 2: Con Node.js
```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# O usar http-server
npm run serve
```

### Opción 3: Abrir Directamente
Simplemente abre el archivo `index.html` en tu navegador web moderno.

## 📱 Compatibilidad

- ✅ **Chrome** 88+
- ✅ **Firefox** 87+
- ✅ **Safari** 14+
- ✅ **Edge** 88+
- 📱 **Responsive** - Se adapta a dispositivos móviles

## 🎮 Cómo Usar

1. **Inicio**: La aplicación muestra una pantalla de arranque de Windows 11
2. **Escritorio**: Interactúa con los iconos del escritorio haciendo doble clic
3. **Menú de inicio**: Haz clic en el botón de Windows para abrir el menú
4. **Aplicaciones**: Lanza aplicaciones desde el menú de inicio o la barra de tareas
5. **Ventanas**: Arrastra ventanas, redimensiona, minimiza y maximiza
6. **Menús**: Haz clic derecho en el escritorio para el menú contextual

## 🎨 Características Visuales

- **Efectos de transparencia** con backdrop-filter
- **Animaciones suaves** para transiciones
- **Diseño responsivo** para diferentes tamaños de pantalla
- **Tema oscuro** consistente con Windows 11
- **Iconografía moderna** con Font Awesome
- **Tipografía auténtica** Segoe UI

## 🔧 Personalización

El código está estructurado de manera modular, permitiendo fácil personalización:

- **CSS**: Modifica `styles.css` para cambiar la apariencia
- **JavaScript**: Extiende `script.js` para añadir nuevas funcionalidades
- **HTML**: Actualiza `index.html` para modificar la estructura

## 📂 Estructura del Proyecto

```
windows-11-emulator/
├── index.html          # Estructura principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad y lógica
├── package.json        # Configuración del proyecto
└── README.md          # Documentación
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Roadmap

- [ ] Más aplicaciones (Paint, WordPad, etc.)
- [ ] Sistema de archivos simulado
- [ ] Configuración del sistema
- [ ] Múltiples escritorios virtuales
- [ ] Widgets de Windows 11
- [ ] Modo claro/oscuro toggle
- [ ] Sonidos del sistema

## 📸 Capturas de Pantalla

*La aplicación incluye una pantalla de arranque auténtica de Windows 11, seguida del escritorio completo con todas las funcionalidades.*

## ⚡ Rendimiento

- **Carga rápida**: Optimizado para carga inicial rápida
- **Memoria eficiente**: Gestión inteligente de ventanas y recursos
- **Animaciones suaves**: 60fps en navegadores modernos
- **Responsive**: Se adapta a cualquier tamaño de pantalla

---

**¡Disfruta de la experiencia completa de Windows 11 en tu navegador! 🚀**