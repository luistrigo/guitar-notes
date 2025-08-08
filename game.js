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
        
        // Ocultar otros botones
        showNotesBtn.classList.add('hidden');
        settingsBtn.classList.add('hidden');
    } else {
        gameElements.gameInterface.classList.add('hidden');
        gameElements.gameResults.classList.add('hidden');
        gameElements.gameBtn.classList.remove('active');
        
        // Mostrar otros botones
        showNotesBtn.classList.remove('hidden');
        settingsBtn.classList.remove('hidden');
        
        stopGame();
    }
}

function startGame() {
    console.log('Iniciando juego...');
    gameActive = true;
    currentRound = 1;
    correctAnswers = 0;
    wrongAnswers = 0;
    gameStartTime = Date.now();
    
    // Mostrar la interfaz del juego
    gameElements.gameInterface.classList.remove('hidden');
    gameElements.gameResults.classList.add('hidden');
    
    gameElements.startGameBtn.classList.add('hidden');
    gameElements.stopGameBtn.classList.remove('hidden');
    
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
    
    // Mostrar la nota pero no iniciar el timer hasta que el usuario haga clic
    timeLeft = 10;
    updateTimer();
    
    console.log('Primera nota mostrada:', randomNote, 'en cuerda', randomString, '- Timer no iniciado');
}

function stopGame() {
    gameActive = false;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    gameElements.startGameBtn.classList.remove('hidden');
    gameElements.stopGameBtn.classList.add('hidden');
    gameElements.gameFeedback.classList.add('hidden');
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
    showFeedback(false, 'timeUp');
    setTimeout(() => {
        if (gameActive) {
            nextRound();
        }
    }, 1500);
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
    const stringNames = ['', '1ª', '2ª', '3ª', '4ª', '5ª', '6ª']; // Nombres de las cuerdas
    gameElements.floatingNoteText.textContent = `${note} - ${stringNames[string]} cuerda`;
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
    isGameActive: () => gameActive
};
