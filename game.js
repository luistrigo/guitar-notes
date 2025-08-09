// Variables del juego
let gameActive = false;
let currentRound = 1;
let totalRounds = 10;
let correctAnswers = 0;
let wrongAnswers = 0;
let gameStartTime = 0;
let currentTargetNote = '';
let currentTargetString = 0; // Nueva variable para la cuerda objetivo
let gameTimer = null;
let timeLeft = 10;

// Referencias a elementos del DOM (se inicializarán desde script.js)
let gameElements = {};

// Funciones del juego
function toggleGameMode() {
    if(showAllNotes){
        toggleShowAllNotes();
        
    }
    const gameInterfaceHidden = gameElements.gameInterface.classList.contains('hidden');
    const showNotesBtn = document.getElementById('show-notes-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    if (gameInterfaceHidden) {
        gameElements.gameInterface.classList.remove('hidden');
        gameElements.gameResults.classList.add('hidden');
        gameElements.gameBtn.classList.add('active');
        gameElements.headerButtons.classList.add('hidden');
        // Ocultar otros botones
        showNotesBtn.classList.add('hidden');
        settingsBtn.classList.add('hidden');
    } else {
       interfaceNormal();
        
        stopGame();
    }
}

function interfaceNormal(){
    const showNotesBtn = document.getElementById('show-notes-btn');
    const settingsBtn = document.getElementById('settings-btn');
    gameElements.gameInterface.classList.add('hidden');
    gameElements.gameResults.classList.add('hidden');
    gameElements.gameBtn.classList.remove('active');
    gameElements.headerButtons.classList.remove('hidden');
    // Mostrar otros botones
    showNotesBtn.classList.remove('hidden');
    settingsBtn.classList.remove('hidden');   
}

function startGame() {
   
    gameActive = true;
    currentRound = 1;
    correctAnswers = 0;
    wrongAnswers = 0;
    gameStartTime = Date.now();
    
    // Mostrar la interfaz del juego
    gameElements.gameInterface.classList.remove('hidden');
    gameElements.gameResults.classList.add('hidden');
    
    
    
    updateGameUI();
    
    // Mostrar la primera nota sin iniciar el timer inmediatamente
    showFirstNote();
    console.log('Juego iniciado, ronda:', currentRound);
}

function showFirstNote() {
    if (!gameActive) return;
    
    // Asegurar que no haya timers activos
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // Obtener la configuración de notas desde el scope global
    const config = window.noteConfig[window.currentNotation];
    const randomNote = config.notes[Math.floor(Math.random() * config.notes.length)];
    const randomString = Math.floor(Math.random() * 6) + 1; // Cuerda del 1 al 6
    
    currentTargetNote = randomNote;
    currentTargetString = randomString;
    
    // Mostrar la nota flotante con la cuerda específica
    showFloatingNote(randomNote, randomString);
    
    // Ocultar el feedback al mostrar la primera nota
    gameElements.gameFeedback.classList.add('hidden');
    
    // Iniciar temporizador para la primera nota
    timeLeft = 10;
    updateTimer();
    
    console.log('Primera nota mostrada:', randomNote, 'en cuerda', randomString, '- Timer iniciado');
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            gameTimer = null;
            handleTimeUp();
        }
    }, 1000);
}

function stopGame() {
    gameActive = false;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    interfaceNormal();
    
}

function generateNewNote() {
    if (!gameActive) return;
    
    // Asegurar que no haya timers activos
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // Obtener la configuración de notas desde el scope global
    const config = window.noteConfig[window.currentNotation];
    const randomNote = config.notes[Math.floor(Math.random() * config.notes.length)];
    const randomString = Math.floor(Math.random() * 6) + 1; // Cuerda del 1 al 6
    
    currentTargetNote = randomNote;
    currentTargetString = randomString;
    
    // Mostrar la nota flotante con la cuerda específica
    showFloatingNote(randomNote, randomString);
    
    // Ocultar el mensaje de feedback
    gameElements.gameFeedback.classList.add('hidden');
    
    // Iniciar temporizador
    timeLeft = 10;
    updateTimer();
    
    console.log('Nueva nota generada:', randomNote, 'en cuerda', randomString);
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            gameTimer = null;
            handleTimeUp();
        }
    }, 1000);
}

function updateTimer() {
    gameElements.timer.textContent = `⏱️ ${timeLeft}`;
}

function handleTimeUp() {
    wrongAnswers++;
    showCorrectNote();
    showFeedback(false, 'timeUp');
    
    // Mostrar también la posición correcta en el mástil
    if (window.showCorrectPositionOnFretboard) {
        window.showCorrectPositionOnFretboard();
    }
    
    setTimeout(() => {
        if (gameActive) {
            nextRound();
        }
    }, 2000); // Aumentado a 2 segundos para que se vea mejor la nota correcta
}

function showFeedback(isCorrect, type = '') {
    const t = window.translations[window.currentLanguage];
    
    if (isCorrect) {
        gameElements.feedbackIcon.textContent = '😊';
        gameElements.feedbackText.textContent = t.correct;
        gameElements.gameFeedback.className = 'game-feedback correct';
    } else {
        gameElements.feedbackIcon.textContent = '😢';
        if (type === 'timeUp') {
            gameElements.feedbackText.textContent = t.timeUp;
        } else {
            gameElements.feedbackText.textContent = t.incorrect;
        }
        gameElements.gameFeedback.className = 'game-feedback incorrect';
    }
    
    gameElements.gameFeedback.classList.remove('hidden');
}

function showFloatingNote(note, string) {
    const t = window.translations[window.currentLanguage];
    const stringNames = window.currentLanguage === 'es' ? 
        ['', '1ª', '2ª', '3ª', '4ª', '5ª', '6ª'] : 
        ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
    const stringLabel = window.currentLanguage === 'es' ? 'cuerda' : 'string';
    gameElements.floatingNoteText.textContent = `${note} - ${stringNames[string]} ${stringLabel}`;
    gameElements.floatingNote.classList.remove('hidden');
    gameElements.floatingNote.classList.remove('disappearing');
    
    // Ocultar después de 1 segundo
    setTimeout(() => {
        gameElements.floatingNote.classList.add('disappearing');
        setTimeout(() => {
            gameElements.floatingNote.classList.add('hidden');
            gameElements.floatingNote.classList.remove('disappearing');
        }, 300);
    }, 1000);
}

function showCorrectNote() {
    const t = window.translations[window.currentLanguage];
    const stringNames = window.currentLanguage === 'es' ? 
        ['', '1ª', '2ª', '3ª', '4ª', '5ª', '6ª'] : 
        ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
    const stringLabel = window.currentLanguage === 'es' ? 'cuerda' : 'string';
    
    // Cambiar el estilo de la nota flotante para mostrar la respuesta correcta
    gameElements.floatingNote.style.background = 'rgba(220, 53, 69, 0.95)'; // Rojo
    gameElements.floatingNote.style.color = 'white'; // Texto blanco
    gameElements.floatingNote.style.border = '3px solid rgba(255, 255, 255, 0.3)';
    
    gameElements.floatingNoteText.textContent = `${currentTargetNote} - ${stringNames[currentTargetString]} ${stringLabel}`;
    gameElements.floatingNote.classList.remove('hidden');
    gameElements.floatingNote.classList.remove('disappearing');
    
    // Ocultar después de 1 segundo (aumentado de 200ms para que se vea mejor)
    setTimeout(() => {
        gameElements.floatingNote.classList.add('disappearing');
        setTimeout(() => {
            gameElements.floatingNote.classList.add('hidden');
            gameElements.floatingNote.classList.remove('disappearing');
            
            // Restaurar el estilo original
            gameElements.floatingNote.style.background = 'rgba(255, 215, 0, 0.9)';
            gameElements.floatingNote.style.color = '#333';
            gameElements.floatingNote.style.border = '3px solid rgba(255, 255, 255, 0.2)';
        }, 300);
    }, 1000);
}

function nextRound() {
    currentRound++;
    console.log('Siguiente ronda:', currentRound);
    if (currentRound > totalRounds) {
        console.log('Juego terminado, llamando endGame');
        endGame();
    } else {
        updateGameUI();
        // Asegurar que el timer anterior esté limpio
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        // Ocultar el feedback antes de generar la nueva nota
        gameElements.gameFeedback.classList.add('hidden');
        generateNewNote();
    }
}

function updateGameUI() {
    const t = window.translations[window.currentLanguage];
    gameElements.currentRound.textContent = `${t.round}: ${currentRound}/${totalRounds}`;
}

function endGame() {
    gameActive = false;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    
    gameElements.correctAnswers.textContent = correctAnswers;
    gameElements.wrongAnswers.textContent = wrongAnswers;
    gameElements.totalTime.textContent = `${totalTime}s`;
    
    gameElements.gameInterface.classList.add('hidden');
    gameElements.gameResults.classList.remove('hidden');
    // Mantener el botón del juego activo para poder reiniciar
    gameElements.gameBtn.classList.add('active');
    
    console.log('Juego terminado:', { correctAnswers, wrongAnswers, totalTime });
}

// Función para verificar si una nota clickeada es correcta
function checkNoteAnswer(clickedNote, clickedString) {
    if (!gameActive) return false;
    
    // Si es la primera respuesta del juego, iniciar el timer para la siguiente ronda
    if (correctAnswers === 0 && wrongAnswers === 0) {
        console.log('Primera respuesta del juego - iniciando timer para siguiente ronda');
    }
    
    // Limpiar el timer actual inmediatamente
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // Verificar que la nota Y la cuerda sean correctas
    const isCorrect = clickedNote === currentTargetNote && clickedString === currentTargetString;
    
    if (isCorrect) {
        console.log('¡Acierto! Nota:', clickedNote, 'Cuerda:', clickedString, 'Objetivo:', currentTargetNote, 'Cuerda objetivo:', currentTargetString);
        correctAnswers++;
        showFeedback(true);
        setTimeout(() => {
            if (gameActive) {
                nextRound();
            }
        }, 1500);
        return true;
    } else {
        console.log('Falló. Nota:', clickedNote, 'Cuerda:', clickedString, 'Objetivo:', currentTargetNote, 'Cuerda objetivo:', currentTargetString);
        wrongAnswers++;
        showCorrectNote();
        showFeedback(false);
        setTimeout(() => {
            if (gameActive) {
                nextRound();
            }
        }, 1500);
        return false;
    }
}

// Función para inicializar los elementos del juego
function initGameElements(elements) {
    gameElements = elements;
    
    // Agregar elementos de la nota flotante
    gameElements.floatingNote = document.getElementById('floating-note');
    gameElements.floatingNoteText = document.getElementById('floating-note-text');
}

// Exportar funciones para uso en script.js
window.gameModule = {
    toggleGameMode,
    startGame,
    stopGame,
    checkNoteAnswer,
    initGameElements,
    isGameActive: () => gameActive,
    getCurrentTargetNote: () => currentTargetNote,
    getCurrentTargetString: () => currentTargetString
};
