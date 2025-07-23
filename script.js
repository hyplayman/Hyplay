// Windows 11 Emulator JavaScript
class Windows11Emulator {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.zIndex = 1000;
        this.isStartMenuOpen = false;
        this.isPowerMenuOpen = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateClock();
        this.showBootScreen();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
    }
    
    showBootScreen() {
        const bootScreen = document.createElement('div');
        bootScreen.className = 'boot-screen';
        bootScreen.innerHTML = `
            <div class="boot-logo">
                <i class="fab fa-windows"></i>
            </div>
            <div class="boot-text">Windows 11</div>
            <div class="boot-spinner"></div>
        `;
        
        document.body.appendChild(bootScreen);
        
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                bootScreen.remove();
            }, 1000);
        }, 3000);
    }
    
    setupEventListeners() {
        // Start button
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });
        
        // Power button
        const powerButton = document.getElementById('powerButton');
        powerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePowerMenu();
        });
        
        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.dataset.app;
                this.openApplication(app);
            });
        });
        
        // Pinned apps in start menu
        document.querySelectorAll('.pinned-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.dataset.app;
                this.openApplication(appName);
                this.hideStartMenu();
            });
        });
        
        // Taskbar apps
        document.querySelectorAll('.taskbar-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.dataset.app;
                this.openApplication(appName);
            });
        });
        
        // Desktop context menu
        const desktop = document.getElementById('desktop');
        const contextMenu = document.getElementById('contextMenu');
        
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });
        
        // Hide menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.hideStartMenu();
            }
            if (!e.target.closest('.power-menu') && !e.target.closest('.power-button')) {
                this.hidePowerMenu();
            }
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });
        
        // Window dragging
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-header') || e.target.closest('.window-header')) {
                this.startDragging(e);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideStartMenu();
                this.hidePowerMenu();
                this.hideContextMenu();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                location.reload();
            }
        });
    }
    
    updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        
        const time = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const date = now.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        
        timeElement.textContent = time;
        dateElement.textContent = date;
    }
    
    toggleStartMenu() {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.getElementById('startButton');
        
        if (this.isStartMenuOpen) {
            this.hideStartMenu();
        } else {
            this.showStartMenu();
        }
    }
    
    showStartMenu() {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.getElementById('startButton');
        
        startMenu.style.display = 'flex';
        startButton.classList.add('active');
        this.isStartMenuOpen = true;
        this.hidePowerMenu();
    }
    
    hideStartMenu() {
        const startMenu = document.getElementById('startMenu');
        const startButton = document.getElementById('startButton');
        
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
        this.isStartMenuOpen = false;
    }
    
    togglePowerMenu() {
        if (this.isPowerMenuOpen) {
            this.hidePowerMenu();
        } else {
            this.showPowerMenu();
        }
    }
    
    showPowerMenu() {
        const powerMenu = document.getElementById('powerMenu');
        powerMenu.style.display = 'block';
        this.isPowerMenuOpen = true;
    }
    
    hidePowerMenu() {
        const powerMenu = document.getElementById('powerMenu');
        powerMenu.style.display = 'none';
        this.isPowerMenuOpen = false;
    }
    
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        // Adjust position if menu goes off screen
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    }
    
    hideContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'none';
    }
    
    openApplication(appName) {
        // Check if window already exists
        const existingWindow = this.windows.find(w => w.app === appName);
        if (existingWindow) {
            this.focusWindow(existingWindow.element);
            return;
        }
        
        let windowConfig;
        
        switch (appName) {
            case 'file-explorer':
                windowConfig = this.createFileExplorer();
                break;
            case 'calculator':
                windowConfig = this.createCalculator();
                break;
            case 'notepad':
                windowConfig = this.createNotepad();
                break;
            case 'edge':
                windowConfig = this.createEdge();
                break;
            case 'this-pc':
                windowConfig = this.createFileExplorer();
                break;
            case 'recycle-bin':
                windowConfig = this.createRecycleBin();
                break;
            default:
                windowConfig = this.createGenericApp(appName);
        }
        
        this.createWindow(windowConfig);
    }
    
    createWindow(config) {
        const windowsContainer = document.getElementById('windowsContainer');
        const windowElement = document.createElement('div');
        windowElement.className = `window ${config.className || ''}`;
        windowElement.style.left = config.x + 'px';
        windowElement.style.top = config.y + 'px';
        windowElement.style.width = config.width + 'px';
        windowElement.style.height = config.height + 'px';
        windowElement.style.zIndex = ++this.zIndex;
        
        windowElement.innerHTML = `
            <div class="window-header">
                <i class="window-icon ${config.icon}"></i>
                <span class="window-title">${config.title}</span>
                <div class="window-controls">
                    <button class="window-control minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="window-control maximize">
                        <i class="fas fa-square"></i>
                    </button>
                    <button class="window-control close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="window-content">
                ${config.content}
            </div>
        `;
        
        windowsContainer.appendChild(windowElement);
        
        // Add window to windows array
        const windowObj = {
            element: windowElement,
            app: config.app,
            title: config.title
        };
        this.windows.push(windowObj);
        
        // Setup window controls
        this.setupWindowControls(windowElement, windowObj);
        
        // Focus the window
        this.focusWindow(windowElement);
        
        // Initialize app-specific functionality
        if (config.init) {
            config.init(windowElement);
        }
    }
    
    setupWindowControls(windowElement, windowObj) {
        const closeBtn = windowElement.querySelector('.window-control.close');
        const minimizeBtn = windowElement.querySelector('.window-control.minimize');
        const maximizeBtn = windowElement.querySelector('.window-control.maximize');
        
        closeBtn.addEventListener('click', () => {
            this.closeWindow(windowObj);
        });
        
        minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow(windowElement);
        });
        
        maximizeBtn.addEventListener('click', () => {
            this.maximizeWindow(windowElement);
        });
        
        // Window focus
        windowElement.addEventListener('mousedown', () => {
            this.focusWindow(windowElement);
        });
    }
    
    closeWindow(windowObj) {
        windowObj.element.style.animation = 'windowClose 0.3s ease-out forwards';
        setTimeout(() => {
            windowObj.element.remove();
            this.windows = this.windows.filter(w => w !== windowObj);
        }, 300);
    }
    
    minimizeWindow(windowElement) {
        windowElement.style.transform = 'scale(0) translateY(100%)';
        windowElement.style.opacity = '0';
        setTimeout(() => {
            windowElement.style.display = 'none';
        }, 300);
    }
    
    maximizeWindow(windowElement) {
        const isMaximized = windowElement.classList.contains('maximized');
        
        if (isMaximized) {
            windowElement.classList.remove('maximized');
            windowElement.style.left = windowElement.dataset.originalLeft;
            windowElement.style.top = windowElement.dataset.originalTop;
            windowElement.style.width = windowElement.dataset.originalWidth;
            windowElement.style.height = windowElement.dataset.originalHeight;
        } else {
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            
            windowElement.classList.add('maximized');
            windowElement.style.left = '0';
            windowElement.style.top = '0';
            windowElement.style.width = '100%';
            windowElement.style.height = 'calc(100vh - 48px)';
        }
    }
    
    focusWindow(windowElement) {
        windowElement.style.zIndex = ++this.zIndex;
        this.activeWindow = windowElement;
    }
    
    startDragging(e) {
        const windowElement = e.target.closest('.window');
        if (!windowElement || windowElement.classList.contains('maximized')) return;
        
        this.isDragging = true;
        this.activeWindow = windowElement;
        
        const rect = windowElement.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        windowElement.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }
    
    drag(e) {
        if (!this.isDragging || !this.activeWindow) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - this.activeWindow.offsetWidth;
        const maxY = window.innerHeight - this.activeWindow.offsetHeight - 48; // Account for taskbar
        
        this.activeWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.activeWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }
    
    stopDragging() {
        if (this.isDragging && this.activeWindow) {
            this.activeWindow.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
        this.isDragging = false;
    }
    
    // Application creators
    createFileExplorer() {
        return {
            app: 'file-explorer',
            title: 'Explorador de archivos',
            icon: 'fas fa-folder',
            className: 'file-explorer',
            x: 100,
            y: 50,
            width: 800,
            height: 600,
            content: `
                <div class="explorer-toolbar">
                    <button class="explorer-button">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <button class="explorer-button">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="explorer-button">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <input class="explorer-path" value="C:\\Users\\Usuario\\Escritorio" readonly>
                </div>
                <div class="explorer-main">
                    <div class="explorer-sidebar">
                        <div class="sidebar-section">
                            <div class="sidebar-title">Acceso rápido</div>
                            <div class="sidebar-item active">
                                <i class="fas fa-desktop"></i>
                                <span>Escritorio</span>
                            </div>
                            <div class="sidebar-item">
                                <i class="fas fa-download"></i>
                                <span>Descargas</span>
                            </div>
                            <div class="sidebar-item">
                                <i class="fas fa-file"></i>
                                <span>Documentos</span>
                            </div>
                            <div class="sidebar-item">
                                <i class="fas fa-image"></i>
                                <span>Imágenes</span>
                            </div>
                        </div>
                        <div class="sidebar-section">
                            <div class="sidebar-title">Este equipo</div>
                            <div class="sidebar-item">
                                <i class="fas fa-hdd"></i>
                                <span>Disco local (C:)</span>
                            </div>
                            <div class="sidebar-item">
                                <i class="fas fa-hdd"></i>
                                <span>Disco local (D:)</span>
                            </div>
                        </div>
                    </div>
                    <div class="explorer-content">
                        <div class="file-item">
                            <i class="fas fa-folder"></i>
                            <span>Documentos</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-folder"></i>
                            <span>Imágenes</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-file-word"></i>
                            <span>Documento.docx</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-file-image"></i>
                            <span>Captura.png</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>Manual.pdf</span>
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    createCalculator() {
        return {
            app: 'calculator',
            title: 'Calculadora',
            icon: 'fas fa-calculator',
            className: 'calculator',
            x: 200,
            y: 100,
            width: 320,
            height: 500,
            content: `
                <div class="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-button" data-action="clear">C</button>
                    <button class="calc-button" data-action="clear-entry">CE</button>
                    <button class="calc-button" data-action="backspace">⌫</button>
                    <button class="calc-button operator" data-action="divide">÷</button>
                    
                    <button class="calc-button" data-number="7">7</button>
                    <button class="calc-button" data-number="8">8</button>
                    <button class="calc-button" data-number="9">9</button>
                    <button class="calc-button operator" data-action="multiply">×</button>
                    
                    <button class="calc-button" data-number="4">4</button>
                    <button class="calc-button" data-number="5">5</button>
                    <button class="calc-button" data-number="6">6</button>
                    <button class="calc-button operator" data-action="subtract">−</button>
                    
                    <button class="calc-button" data-number="1">1</button>
                    <button class="calc-button" data-number="2">2</button>
                    <button class="calc-button" data-number="3">3</button>
                    <button class="calc-button operator" data-action="add">+</button>
                    
                    <button class="calc-button" data-action="toggle-sign">±</button>
                    <button class="calc-button" data-number="0">0</button>
                    <button class="calc-button" data-action="decimal">.</button>
                    <button class="calc-button equals" data-action="equals">=</button>
                </div>
            `,
            init: (windowElement) => {
                this.initCalculator(windowElement);
            }
        };
    }
    
    createNotepad() {
        return {
            app: 'notepad',
            title: 'Bloc de notas',
            icon: 'fas fa-file-alt',
            className: 'notepad',
            x: 150,
            y: 75,
            width: 600,
            height: 400,
            content: `
                <textarea class="notepad-textarea" placeholder="Escribe aquí..."></textarea>
            `
        };
    }
    
    createEdge() {
        return {
            app: 'edge',
            title: 'Microsoft Edge',
            icon: 'fab fa-edge',
            x: 50,
            y: 50,
            width: 1000,
            height: 700,
            content: `
                <div style="padding: 20px; text-align: center;">
                    <i class="fab fa-edge" style="font-size: 64px; color: #0078d4; margin-bottom: 20px;"></i>
                    <h2 style="color: white; margin-bottom: 16px;">Microsoft Edge</h2>
                    <p style="color: rgba(255,255,255,0.7);">Navegador web moderno y seguro</p>
                    <div style="margin-top: 40px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                            <i class="fas fa-globe" style="margin-right: 8px;"></i>
                            Navega por la web de forma segura
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                            <i class="fas fa-shield-alt" style="margin-right: 8px;"></i>
                            Protección avanzada contra amenazas
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                            <i class="fas fa-sync" style="margin-right: 8px;"></i>
                            Sincronización entre dispositivos
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    createRecycleBin() {
        return {
            app: 'recycle-bin',
            title: 'Papelera de reciclaje',
            icon: 'fas fa-trash',
            x: 300,
            y: 150,
            width: 600,
            height: 400,
            content: `
                <div style="padding: 40px; text-align: center;">
                    <i class="fas fa-trash" style="font-size: 64px; color: #666; margin-bottom: 20px;"></i>
                    <h2 style="color: white; margin-bottom: 16px;">Papelera de reciclaje</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 40px;">La papelera de reciclaje está vacía</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.2);">
                        <p style="color: rgba(255,255,255,0.5); font-style: italic;">
                            Arrastra archivos aquí para eliminarlos
                        </p>
                    </div>
                </div>
            `
        };
    }
    
    createGenericApp(appName) {
        const appNames = {
            'word': 'Microsoft Word',
            'excel': 'Microsoft Excel',
            'powerpoint': 'Microsoft PowerPoint',
            'store': 'Microsoft Store'
        };
        
        const appIcons = {
            'word': 'fas fa-file-word',
            'excel': 'fas fa-file-excel',
            'powerpoint': 'fas fa-file-powerpoint',
            'store': 'fas fa-shopping-bag'
        };
        
        return {
            app: appName,
            title: appNames[appName] || appName,
            icon: appIcons[appName] || 'fas fa-window-maximize',
            x: Math.random() * 200 + 100,
            y: Math.random() * 100 + 50,
            width: 600,
            height: 400,
            content: `
                <div style="padding: 40px; text-align: center;">
                    <i class="${appIcons[appName] || 'fas fa-window-maximize'}" style="font-size: 64px; color: #0078d4; margin-bottom: 20px;"></i>
                    <h2 style="color: white; margin-bottom: 16px;">${appNames[appName] || appName}</h2>
                    <p style="color: rgba(255,255,255,0.7);">Aplicación de Windows 11</p>
                </div>
            `
        };
    }
    
    initCalculator(windowElement) {
        const display = windowElement.querySelector('.calc-display');
        const buttons = windowElement.querySelectorAll('.calc-button');
        
        let currentInput = '0';
        let previousInput = null;
        let operator = null;
        let waitingForNewInput = false;
        
        const updateDisplay = () => {
            display.textContent = currentInput;
        };
        
        const inputNumber = (num) => {
            if (waitingForNewInput) {
                currentInput = num;
                waitingForNewInput = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
        };
        
        const inputOperator = (nextOperator) => {
            const inputValue = parseFloat(currentInput);
            
            if (previousInput === null) {
                previousInput = inputValue;
            } else if (operator) {
                const result = calculate();
                currentInput = String(result);
                previousInput = result;
                updateDisplay();
            }
            
            waitingForNewInput = true;
            operator = nextOperator;
        };
        
        const calculate = () => {
            const prev = previousInput;
            const current = parseFloat(currentInput);
            
            if (prev === null || operator === null) return current;
            
            switch (operator) {
                case 'add': return prev + current;
                case 'subtract': return prev - current;
                case 'multiply': return prev * current;
                case 'divide': return current !== 0 ? prev / current : 0;
                default: return current;
            }
        };
        
        const equals = () => {
            if (operator && previousInput !== null && !waitingForNewInput) {
                const result = calculate();
                currentInput = String(result);
                previousInput = null;
                operator = null;
                waitingForNewInput = true;
                updateDisplay();
            }
        };
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const { number, action } = button.dataset;
                
                if (number) {
                    inputNumber(number);
                } else if (action) {
                    switch (action) {
                        case 'clear':
                            currentInput = '0';
                            previousInput = null;
                            operator = null;
                            waitingForNewInput = false;
                            updateDisplay();
                            break;
                        case 'clear-entry':
                            currentInput = '0';
                            updateDisplay();
                            break;
                        case 'backspace':
                            if (currentInput.length > 1) {
                                currentInput = currentInput.slice(0, -1);
                            } else {
                                currentInput = '0';
                            }
                            updateDisplay();
                            break;
                        case 'decimal':
                            if (currentInput.indexOf('.') === -1) {
                                currentInput += '.';
                                updateDisplay();
                            }
                            break;
                        case 'toggle-sign':
                            currentInput = String(-parseFloat(currentInput));
                            updateDisplay();
                            break;
                        case 'equals':
                            equals();
                            break;
                        default:
                            inputOperator(action);
                    }
                }
            });
        });
    }
}

// Initialize the Windows 11 Emulator
document.addEventListener('DOMContentLoaded', () => {
    new Windows11Emulator();
});

// Add CSS for window close animation
const style = document.createElement('style');
style.textContent = `
    @keyframes windowClose {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);