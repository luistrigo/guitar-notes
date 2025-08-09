// Configuración de idiomas
const translations = {
    es: {
        title: "Guitarra - Aprende las Notas",
        settings: "Configuración",
        game: "Juego",
        showNotes: "Ver Notas",
        hideNotes: "Ocultar Notas",
        noteLabel: "Nota Actual:",
        stringLabel: "Cuerda:",
        fretLabel: "Traste:",
        instructions: "Haz clic en cualquier posición del mástil para ver la nota correspondiente",
        language: "Idioma",
        notation: "Notación",
    
        spanishNotation: "DO RE MI FA",
        englishNotation: "C D E F",
        save: "Guardar",
        cancel: "Cancelar",
        // Traducciones del juego
        findNote: "¡Encuentra la Nota en la Cuerda Específica!",
        round: "Ronda",
        startGame: "Iniciar Juego",
        stopGame: "Salir",
        playAgain: "Jugar de Nuevo",
        gameOver: "¡Juego Terminado!",
        correct: "¡Correcto!",
        incorrect: "¡Incorrecto!",
        timeUp: "¡Se acabó el tiempo!",
        correctAnswers: "Aciertos",
        wrongAnswers: "Fallos",
        totalTime: "Tiempo Total"
    },
    en: {
        title: "Guitar - Learn the Notes",
        settings: "Settings",
        game: "Game",
        showNotes: "Show Notes",
        hideNotes: "Hide Notes",
        noteLabel: "Current Note:",
        stringLabel: "String:",
        fretLabel: "Fret:",
        instructions: "Click on any position on the fretboard to see the corresponding note",
        language: "Language",
        notation: "Notation",
    
        spanishNotation: "DO RE MI FA",
        englishNotation: "C D E F",
        save: "Save",
        cancel: "Cancel",
        // Game translations
        findNote: "Find the Note on the Specific String!",
        round: "Round",
        startGame: "Start Game",
        stopGame: "Exit",
        playAgain: "Play Again",
        gameOver: "Game Over!",
        correct: "Correct!",
        incorrect: "Incorrect!",
        timeUp: "Time's up!",
        correctAnswers: "Correct",
        wrongAnswers: "Wrong",
        totalTime: "Total Time"
    }
};

// Configuración de notas musicales
const noteConfig = {
    spanish: {
        notes: ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'],
        openStrings: ['MI', 'SI', 'SOL', 'RE', 'LA', 'MI'] // De la 1ª a la 6ª cuerda
    },
    english: {
        notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        openStrings: ['E', 'B', 'G', 'D', 'A', 'E'] // De la 1ª a la 6ª cuerda
    }
};

// Variables globales
let currentLanguage = 'es';
let currentNotation = 'spanish';

let showAllNotes = false;
let currentNote = null;
let currentString = null;
let currentFret = null;

// Hacer las variables accesibles globalmente para game.js
window.currentLanguage = currentLanguage;
window.currentNotation = currentNotation;
window.noteConfig = noteConfig;
window.translations = translations;

// Elementos del DOM
const elements = {
    title: document.getElementById('title'),
    noteLabel: document.getElementById('note-label'),
    stringLabel: document.getElementById('string-label'),
    fretLabel: document.getElementById('fret-label'),
    instructionsText: document.getElementById('instructions-text'),
    currentNote: document.getElementById('current-note'),
    stringNumber: document.getElementById('string-number'),
    fretNumber: document.getElementById('fret-number'),
    showNotesBtn: document.getElementById('show-notes-btn'),
    showNotesText: document.getElementById('show-notes-text'),
    gameBtn: document.getElementById('game-btn'),
    gameText: document.getElementById('game-text'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsText: document.getElementById('settings-text'),
    modal: document.getElementById('settings-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalLanguage: document.getElementById('modal-language'),
    modalNotation: document.getElementById('modal-notation'),

    saveSettings: document.getElementById('save-settings'),
    cancelSettings: document.getElementById('cancel-settings'),
    closeModal: document.getElementById('close-modal'),
    guitarNeck: document.querySelector('.guitar-neck'),
    frets: document.querySelector('.frets'),
    fretboard: document.querySelector('.fretboard'),

    // Elementos del juego
    gameInterface: document.getElementById('game-interface'),
    gameResults: document.getElementById('game-results'),
    currentRound: document.getElementById('current-round'),
    timer: document.getElementById('timer'),
    gameFeedback: document.getElementById('game-feedback'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackText: document.getElementById('feedback-text'),
    startGameBtn: document.getElementById('start-game'),
    stopGameBtn: document.getElementById('stop-game'),
    playAgainBtn: document.getElementById('play-again'),
    correctAnswers: document.getElementById('correct-answers'),
    wrongAnswers: document.getElementById('wrong-answers'),
    totalTime: document.getElementById('total-time'),
    headerButtons: document.getElementById('header-buttons'),
    exitGameBtn: document.getElementById('exit-game'),
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    generateFrets();

    generateFretboard();
    updateLanguage();
    
    // Inicializar el módulo del juego
    if (window.gameModule) {
        window.gameModule.initGameElements(elements);
    }
}

function setupEventListeners() {
    // Event listeners para la modal
    if (elements.settingsBtn) elements.settingsBtn.addEventListener('click', openSettingsModal);
    if (elements.closeModal) elements.closeModal.addEventListener('click', closeSettingsModal);
    if (elements.cancelSettings) elements.cancelSettings.addEventListener('click', closeSettingsModal);
    if (elements.saveSettings) elements.saveSettings.addEventListener('click', saveSettings);
    
    // Event listener para mostrar/ocultar notas
    if (elements.showNotesBtn) elements.showNotesBtn.addEventListener('click', toggleShowAllNotes);
    
    // Event listeners del juego
    if (elements.gameBtn) elements.gameBtn.addEventListener('click', window.gameModule.toggleGameMode);
    if (elements.startGameBtn) elements.startGameBtn.addEventListener('click', window.gameModule.startGame);
    if (elements.stopGameBtn) elements.stopGameBtn.addEventListener('click', window.gameModule.stopGame);
    if (elements.playAgainBtn) elements.playAgainBtn.addEventListener('click', window.gameModule.startGame);
    
    // Event listener para el botón de salir del juego
    const exitGameBtn = document.getElementById('exit-game');
    if (exitGameBtn) exitGameBtn.addEventListener('click', () => {
        if (window.gameModule) {
            window.gameModule.stopGame();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === elements.modal) {
            closeSettingsModal();
        }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.modal.style.display === 'block') {
            closeSettingsModal();
        }
    });
}

function generateFrets() {
    elements.frets.innerHTML = '';
    for (let i = 0; i <= 12; i++) {
        const fret = document.createElement('div');
        if (i === 0) {
            fret.className = 'fret first-fret';
        } else if (i === 12) {
            fret.className = 'fret last-fret';
        } else if (i==3 || i === 5 || i === 7 || i === 9) {
            fret.className = 'fret middle-fret';
            fret.innerHTML = `<div>${i}</div>`;
        }else{
            fret.className = 'fret';
        }
        elements.frets.appendChild(fret);
    }
}



function generateFretboard() {
    elements.fretboard.innerHTML = '';
    
    const config = noteConfig[currentNotation];
    
    for (let string = 1; string <= 6; string++) {
        for (let fret = 0; fret <= 12; fret++) {
            const notePosition = document.createElement('div');
            notePosition.className = 'note-position';
            notePosition.dataset.string = string;
            notePosition.dataset.fret = fret;
            
            // Calcular la nota
            const openStringNote = config.openStrings[string - 1];
            const openStringIndex = config.notes.indexOf(openStringNote);
            const noteIndex = (openStringIndex + fret) % 12;
            const note = config.notes[noteIndex];
            
            notePosition.dataset.note = note;
            notePosition.textContent = note;
            
            // Aplicar estado inicial de mostrar todas las notas
            if (showAllNotes) {
                notePosition.style.color = '#333';
                notePosition.style.background = 'rgba(255,255,255,0.5)';
            }
            
            // Event listener para cada posición
            notePosition.addEventListener('click', function() {
                handleNoteClick(this);
            });
            
            // Event listener para hover en la cuerda
            notePosition.addEventListener('mouseenter', function() {
                const stringNumber = parseInt(this.dataset.string);
                const stringElement = document.querySelector(`[data-string="${stringNumber}"]`);
                if (stringElement) {
                    stringElement.style.transform = 'scaleY(1.1)';
                    stringElement.style.boxShadow = '0 2px 6px rgba(255,255,255,0.3)';
                }
            });
            
            notePosition.addEventListener('mouseleave', function() {
                const stringNumber = parseInt(this.dataset.string);
                const stringElement = document.querySelector(`[data-string="${stringNumber}"]`);
                if (stringElement && !stringElement.style.transform.includes('1.2')) {
                    stringElement.style.transform = '';
                    stringElement.style.boxShadow = '';
                }
            });
            
            elements.fretboard.appendChild(notePosition);
        }
    }
}

function handleNoteClick(element) {
    // Limpiar todas las posiciones primero
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('active');
        // Limpiar estilos inline excepto si showAllNotes está activo
        if (!showAllNotes) {
            pos.style.color = 'transparent';
            pos.style.background = 'transparent';
        } else {
            pos.style.color = '#333';
            pos.style.background = 'rgba(255,255,255,0.1)';
        }
        pos.style.transform = '';
        pos.style.boxShadow = '';
    });
    
    // Agregar clase active a la posición clickeada
    element.classList.add('active');
    
    // Aplicar estilo dorado a la nota seleccionada
    element.style.background = 'rgba(255, 215, 0, 0.8)';
    element.style.color = '#333';
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
    
    // Efecto visual en la cuerda correspondiente
    const stringNumber = parseInt(element.dataset.string);
    const stringElement = document.querySelector(`[data-string="${stringNumber}"]`);
    if (stringElement) {
        stringElement.style.transform = 'scaleY(1.2)';
        stringElement.style.boxShadow = '0 3px 8px rgba(255,215,0,0.6)';
        setTimeout(() => {
            stringElement.style.transform = '';
            stringElement.style.boxShadow = '';
        }, 300);
    }
    
    // Actualizar información
    currentString = parseInt(element.dataset.string);
    currentFret = parseInt(element.dataset.fret);
    currentNote = element.dataset.note;
    
    updateInfoPanel();
}

function updateInfoPanel() {
    elements.currentNote.textContent = currentNote || '-';
    elements.stringNumber.textContent = currentString || '-';
    elements.fretNumber.textContent = currentFret !== null ? currentFret : '-';
}

function updateLanguage() {
    const t = translations[currentLanguage];
    
    elements.title.textContent = t.title;
    elements.settingsText.textContent = t.settings;
    elements.gameText.textContent = t.game;
    elements.showNotesText.textContent = showAllNotes ? t.hideNotes : t.showNotes;
    elements.noteLabel.textContent = t.noteLabel;
    elements.stringLabel.textContent = t.stringLabel;
    elements.fretLabel.textContent = t.fretLabel;
    elements.instructionsText.textContent = t.instructions;
    elements.modalTitle.textContent = t.settings;
    
    // Actualizar elementos del juego
    if (elements.startGameBtn) elements.startGameBtn.textContent = t.startGame;
    if (elements.stopGameBtn) elements.stopGameBtn.textContent = t.stopGame;
    if (elements.playAgainBtn) elements.playAgainBtn.textContent = t.playAgain;
    
    // Actualizar etiquetas de la modal
    const modalLabels = document.querySelectorAll('.setting-group label');
    if (modalLabels[0]) modalLabels[0].textContent = t.language + ':';
    if (modalLabels[1]) modalLabels[1].textContent = t.notation + ':';

    
    // Actualizar botones
    elements.saveSettings.textContent = t.save;
    elements.cancelSettings.textContent = t.cancel;
    
    // Actualizar opciones de notación en la modal
    const notationOptions = elements.modalNotation.querySelectorAll('option');
    notationOptions[0].textContent = t.spanishNotation;
    notationOptions[1].textContent = t.englishNotation;
    
    // Actualizar UI del juego si está activo
    if (window.gameModule && window.gameModule.isGameActive()) {
        window.gameModule.updateGameUI();
    }
}

function updateNotation() {
    // Esta función se llama cuando cambia la notación
    // La lógica principal está en generateFretboard()
}

// Función para obtener la nota en una posición específica
function getNoteAtPosition(string, fret) {
    const config = noteConfig[currentNotation];
    const openStringNote = config.openStrings[string - 1];
    const openStringIndex = config.notes.indexOf(openStringNote);
    const noteIndex = (openStringIndex + fret) % 12;
    return config.notes[noteIndex];
}

// Función para limpiar la selección actual
function clearSelection() {
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('active');
        // Limpiar estilos inline excepto si showAllNotes está activo
        if (!showAllNotes) {
            pos.style.color = 'transparent';
            pos.style.background = 'transparent';
        } else {
            pos.style.color = '#333';
            pos.style.background = 'rgba(255,255,255,0.5)';
        }
        pos.style.transform = '';
        pos.style.boxShadow = '';
    });
    currentNote = null;
    currentString = null;
    currentFret = null;
    updateInfoPanel();
}

function showCorrectPositionOnFretboard() {
    // Obtener la nota objetivo y cuerda del módulo del juego
    const targetNote = window.gameModule.getCurrentTargetNote();
    const targetString = window.gameModule.getCurrentTargetString();
    
    if (!targetNote || !targetString) return;
    
    // Encontrar la posición correcta en el mástil
    const correctPosition = document.querySelector(`[data-note="${targetNote}"][data-string="${targetString}"]`);
    
    if (correctPosition) {
        // Aplicar estilo rojo a la posición correcta
        correctPosition.style.background = 'rgba(220, 53, 69, 0.9)'; // Rojo
        correctPosition.style.color = 'white'; // Texto blanco
        correctPosition.style.transform = 'scale(1.2)';
        correctPosition.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.6)';
        correctPosition.style.zIndex = '10';
        
        // Efecto visual en la cuerda correcta
        const stringElement = document.querySelector(`[data-string="${targetString}"]`);
        if (stringElement) {
            stringElement.style.transform = 'scaleY(1.3)';
            stringElement.style.boxShadow = '0 3px 8px rgba(220, 53, 69, 0.8)';
        }
        
        // Restaurar después de 200 milisegundos
        setTimeout(() => {
            correctPosition.style.background = '';
            correctPosition.style.color = '';
            correctPosition.style.transform = '';
            correctPosition.style.boxShadow = '';
            correctPosition.style.zIndex = '';
            
            if (stringElement) {
                stringElement.style.transform = '';
                stringElement.style.boxShadow = '';
            }
        }, 1000);
    }
}

// Event listener para limpiar selección al hacer clic fuera del mástil
document.addEventListener('click', function(e) {
    if (!e.target.closest('.guitar-neck') && !e.target.closest('.info-panel')) {
        clearSelection();
    }
});

// Funciones de la modal
function openSettingsModal() {
    // Cargar configuración actual en la modal
    if (elements.modalLanguage) elements.modalLanguage.value = currentLanguage;
    if (elements.modalNotation) elements.modalNotation.value = currentNotation;

    if (elements.modal) {
        elements.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsModal() {
    if (elements.modal) {
        elements.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function saveSettings() {
    const newLanguage = elements.modalLanguage ? elements.modalLanguage.value : currentLanguage;
    const newNotation = elements.modalNotation ? elements.modalNotation.value : currentNotation;

    
    // Aplicar cambios
    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        window.currentLanguage = currentLanguage;
        updateLanguage();
        
        // Si el juego está activo, reiniciarlo para usar el nuevo idioma
        if (window.gameModule && window.gameModule.isGameActive()) {
            window.gameModule.stopGame();
            setTimeout(() => {
                window.gameModule.startGame();
            }, 100);
        }
    }
    
    if (newNotation !== currentNotation) {
        currentNotation = newNotation;
        window.currentNotation = currentNotation;
        generateFretboard();
        
        // Si el juego está activo, reiniciarlo para usar la nueva notación
        if (window.gameModule && window.gameModule.isGameActive()) {
            window.gameModule.stopGame();
            setTimeout(() => {
                window.gameModule.startGame();
            }, 100);
        }
    }
    

    
    closeSettingsModal();
}



function toggleShowAllNotes() {
    showAllNotes = !showAllNotes;
    
    // Actualizar el botón
    elements.showNotesBtn.classList.toggle('active', showAllNotes);
    
    // Actualizar el texto del botón
    updateLanguage();
    
    // Mostrar/ocultar todas las notas
    const notePositions = document.querySelectorAll('.note-position');
    notePositions.forEach(position => {
        if (showAllNotes) {
            position.style.color = '#333';
            position.style.background = 'rgba(255,255,255,1)';
        } else {
            position.style.color = 'transparent';
            position.style.background = 'transparent';
        }
    });
    
    // Limpiar selección actual si se ocultan las notas
    if (!showAllNotes) {
        clearSelection();
    }
}



// Modificar handleNoteClick para incluir la lógica del juego
function handleNoteClick(element) {
    // Limpiar todas las posiciones primero
    document.querySelectorAll('.note-position').forEach(pos => {
        pos.classList.remove('active');
        // Limpiar estilos inline excepto si showAllNotes está activo
        if (!showAllNotes) {
            pos.style.color = 'transparent';
            pos.style.background = 'transparent';
        } else {
            pos.style.color = '#333';
            pos.style.background = 'rgba(255,255,255,0.1)';
        }
        pos.style.transform = '';
        pos.style.boxShadow = '';
    });
    
    // Agregar clase active a la posición clickeada
    element.classList.add('active');
    
    // Aplicar estilo dorado a la nota seleccionada
    element.style.background = 'rgba(255, 215, 0, 0.8)';
    element.style.color = '#333';
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
    
    // Efecto visual en la cuerda correspondiente
    const stringNumber = parseInt(element.dataset.string);
    const stringElement = document.querySelector(`[data-string="${stringNumber}"]`);
    if (stringElement) {
        stringElement.style.transform = 'scaleY(1.2)';
        stringElement.style.boxShadow = '0 3px 8px rgba(255,215,0,0.6)';
        setTimeout(() => {
            stringElement.style.transform = '';
            stringElement.style.boxShadow = '';
        }, 300);
    }
    
    // Actualizar información
    currentString = parseInt(element.dataset.string);
    currentFret = parseInt(element.dataset.fret);
    currentNote = element.dataset.note;
    
    updateInfoPanel();
    
    // Lógica del juego
    if (window.gameModule && window.gameModule.isGameActive()) {
        const isCorrect = window.gameModule.checkNoteAnswer(currentNote, currentString);
        
        // Si la respuesta es incorrecta, mostrar la posición correcta en el mástil
        if (!isCorrect && window.gameModule.isGameActive()) {
            showCorrectPositionOnFretboard();
        }
    }
}
