// Configuración de idiomas
const translations = {
    es: {
        title: "Guitarra - Aprende las Notas",
        settings: "Configuración",
        showNotes: "Ver Notas",
        hideNotes: "Ocultar Notas",
        noteLabel: "Nota Actual:",
        stringLabel: "Cuerda:",
        fretLabel: "Traste:",
        instructions: "Haz clic en cualquier posición del mástil para ver la nota correspondiente",
        language: "Idioma",
        notation: "Notación",
        showFretNumbers: "Mostrar números de traste",
        spanishNotation: "DO RE MI FA",
        englishNotation: "C D E F",
        save: "Guardar",
        cancel: "Cancelar"
    },
    en: {
        title: "Guitar - Learn the Notes",
        settings: "Settings",
        showNotes: "Show Notes",
        hideNotes: "Hide Notes",
        noteLabel: "Current Note:",
        stringLabel: "String:",
        fretLabel: "Fret:",
        instructions: "Click on any position on the fretboard to see the corresponding note",
        language: "Language",
        notation: "Notation",
        showFretNumbers: "Show fret numbers",
        spanishNotation: "DO RE MI FA",
        englishNotation: "C D E F",
        save: "Save",
        cancel: "Cancel"
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
let showFretNumbers = true;
let showAllNotes = false;
let currentNote = null;
let currentString = null;
let currentFret = null;

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
    settingsBtn: document.getElementById('settings-btn'),
    settingsText: document.getElementById('settings-text'),
    modal: document.getElementById('settings-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalLanguage: document.getElementById('modal-language'),
    modalNotation: document.getElementById('modal-notation'),
    showFretNumbers: document.getElementById('show-fret-numbers'),
    saveSettings: document.getElementById('save-settings'),
    cancelSettings: document.getElementById('cancel-settings'),
    closeModal: document.getElementById('close-modal'),
    guitarNeck: document.querySelector('.guitar-neck'),
    frets: document.querySelector('.frets'),
    fretboard: document.querySelector('.fretboard'),
    fretNumbers: document.querySelector('.fret-numbers')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    generateFrets();
    generateFretNumbers();
    generateFretboard();
    updateLanguage();
}

function setupEventListeners() {
    // Event listeners para la modal
    elements.settingsBtn.addEventListener('click', openSettingsModal);
    elements.closeModal.addEventListener('click', closeSettingsModal);
    elements.cancelSettings.addEventListener('click', closeSettingsModal);
    elements.saveSettings.addEventListener('click', saveSettings);
    
    // Event listener para mostrar/ocultar notas
    elements.showNotesBtn.addEventListener('click', toggleShowAllNotes);
    
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
        fret.className = 'fret';
        elements.frets.appendChild(fret);
    }
}

function generateFretNumbers() {
    elements.fretNumbers.innerHTML = '';
    for (let i = 0; i <= 12; i++) {
        const fretNumber = document.createElement('div');
        fretNumber.className = `fret-number ${showFretNumbers ? '' : 'hidden'}`;
        fretNumber.textContent = i;
        elements.fretNumbers.appendChild(fretNumber);
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
                notePosition.style.background = 'rgba(255,255,255,0.1)';
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
    elements.showNotesText.textContent = showAllNotes ? t.hideNotes : t.showNotes;
    elements.noteLabel.textContent = t.noteLabel;
    elements.stringLabel.textContent = t.stringLabel;
    elements.fretLabel.textContent = t.fretLabel;
    elements.instructionsText.textContent = t.instructions;
    elements.modalTitle.textContent = t.settings;
    
    // Actualizar etiquetas de la modal
    const modalLabels = document.querySelectorAll('.setting-group label');
    if (modalLabels[0]) modalLabels[0].textContent = t.language + ':';
    if (modalLabels[1]) modalLabels[1].textContent = t.notation + ':';
    if (modalLabels[2]) modalLabels[2].textContent = t.showFretNumbers + ':';
    
    // Actualizar botones
    elements.saveSettings.textContent = t.save;
    elements.cancelSettings.textContent = t.cancel;
    
    // Actualizar opciones de notación en la modal
    const notationOptions = elements.modalNotation.querySelectorAll('option');
    notationOptions[0].textContent = t.spanishNotation;
    notationOptions[1].textContent = t.englishNotation;
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
            pos.style.background = 'rgba(255,255,255,0.1)';
        }
        pos.style.transform = '';
        pos.style.boxShadow = '';
    });
    currentNote = null;
    currentString = null;
    currentFret = null;
    updateInfoPanel();
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
    elements.modalLanguage.value = currentLanguage;
    elements.modalNotation.value = currentNotation;
    elements.showFretNumbers.checked = showFretNumbers;
    
    elements.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    elements.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function saveSettings() {
    const newLanguage = elements.modalLanguage.value;
    const newNotation = elements.modalNotation.value;
    const newShowFretNumbers = elements.showFretNumbers.checked;
    
    // Aplicar cambios
    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        updateLanguage();
    }
    
    if (newNotation !== currentNotation) {
        currentNotation = newNotation;
        generateFretboard();
    }
    
    if (newShowFretNumbers !== showFretNumbers) {
        showFretNumbers = newShowFretNumbers;
        updateFretNumbers();
    }
    
    closeSettingsModal();
}

function updateFretNumbers() {
    const fretNumbers = document.querySelectorAll('.fret-number');
    fretNumbers.forEach(number => {
        if (showFretNumbers) {
            number.classList.remove('hidden');
        } else {
            number.classList.add('hidden');
        }
    });
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
            position.style.background = 'rgba(255,255,255,0.1)';
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
