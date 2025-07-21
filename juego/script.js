// --- REFERENCIAS A ELEMENTOS DEL DOM ---
const overlay = document.getElementById('overlay');
const mainContainer = document.querySelector('.container');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-btn');
const shareButton = document.getElementById('share-btn');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const progressBar = document.getElementById('progress-bar');
const scoreText = document.getElementById('score-text');
const finalMessageText = document.getElementById('final-message');
const shareInstructions = document.getElementById('share-instructions');
const anthemAudio = document.getElementById('anthem-audio');
anthemAudio.volume = 0.3;
// NUEVO: Referencia al elemento del contador
const timerElement = document.getElementById('timer');

// --- VARIABLES ---
let shuffledQuestions, currentQuestionIndex, score = 0, gameActive = false, shareMessage = '';
// NUEVO: Variables para el temporizador
let timer;
let timeLeft;
const instagramUsername = 'fan_rrc_1913'; // ¡TU USUARIO DE INSTAGRAM VA AQUÍ!

// --- PREGUNTAS (Sin cambios) ---
const questions = [
    { question: '¿Quién es el entrenador del Racing de Santander para la temporada 2024/25?', answers: [{ text: 'José Alberto López', correct: true }, { text: 'David Gallego', correct: false }, { text: 'Míchel Sánchez', correct: false }, { text: 'Rubén Baraja', correct: false }] },
    { question: '¿Cuál fue la última temporada en la que el Racing jugó en La Liga (Primera División)?', answers: [{ text: '2011-2012', correct: true }, { text: '2012-2013', correct: false }, { text: '2013-2014', correct: false }, { text: '2014-2015', correct: false }] },
    { question: '¿Dónde juega sus partidos de local el Racing de Santander?', answers: [{ text: 'Estadio El Sardinero', correct: true }, { text: 'Instalaciones Nando Yosu', correct: false }, { text: 'Estadio Mestalla', correct: false }, { text: 'Estadio Ramón Sánchez-Pizjuán', correct: false }] },
    { question: '¿En qué temporada participó el Racing en competiciones europeas (Copa de la UEFA)?', answers: [{ text: '2008-2009', correct: true }, { text: '2007-2008', correct: false }, { text: '2010-2011', correct: false }, { text: 'Nunca ha jugado', correct: false }] },
    { question: '¿Cuál de estos apodos se usa para referirse al equipo del Racing de Santander?', answers: [{ text: 'Los Txuri-Urdin', correct: false }, { text: 'Racinguistas', correct: true }, { text: 'Los Rojiblancos', correct: false }, { text: 'Los Leones', correct: false }] },
    { question: '¿Quiénes conformaban el famoso “Dúo Sacapuntas” del Racing?', answers: [{ text: 'Nikola Žigić y Pedro Munitis', correct: true }, { text: 'Quique Setién y Gustavo López', correct: false }, { text: 'Iván de la Peña y Diego Cervero', correct: false }, { text: 'Pablo Pinillos y José María Ceballos', correct: false }] },
    { question: '¿En qué temporada consiguió el Racing su último ascenso a Primera División?', answers: [{ text: '1999/2000', correct: false }, { text: '2000/2001', correct: false }, { text: '2001/2002', correct: true }, { text: '2002/2003', correct: false }] }
];

// --- EVENT LISTENERS (Sin cambios) ---
startButton.addEventListener('click', startGame);

shareButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    navigator.clipboard.writeText(shareMessage).then(() => {
        shareButton.innerText = '¡Copiado! Abriendo Instagram...';
        window.open(`https://ig.me/m/${instagramUsername}`, '_blank');
        setTimeout(() => {
            shareButton.innerText = '¡Demuestra tu resultado por DM!';
        }, 3000);
    }).catch(err => {
        alert('No se pudo copiar el mensaje. Por favor, abre Instagram y envíalo manualmente.');
        console.error('Error al copiar: ', err);
    });
});

// --- LÓGICA ANTI-TRAMPAS ---
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameActive) endGameDueToCheating();
});

function endGameDueToCheating() {
    // NUEVO: Detener el temporizador si existe
    clearInterval(timer);
    gameActive = false;
    stopAnthem();
    quizScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    overlay.classList.remove('hide');
    mainContainer.classList.add('active-modal');
    shareButton.classList.add('hide');
    shareInstructions.classList.add('hide');
    scoreText.innerText = "¡Juego Anulado!";
    finalMessageText.innerHTML = "Has salido de la pestaña. Partida anulada. <br>Refresca la página para intentarlo de nuevo sin trampas 😉";
}

function stopAnthem() {
    anthemAudio.pause();
    anthemAudio.currentTime = 0;
}

// --- FUNCIONES DEL JUEGO ---
function startGame() {
    gameActive = true;
    overlay.classList.add('hide');
    mainContainer.classList.remove('active-modal');
    startScreen.classList.add('hide');
    endScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    
    anthemAudio.currentTime = 7;
    anthemAudio.play();

    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    updateProgressBar();
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        // NUEVO: Iniciar el contador para la nueva pregunta
        startTimer();
    } else {
        showEndScreen();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    // NUEVO: Asegurarse de limpiar cualquier temporizador anterior
    clearInterval(timer);
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    // NUEVO: Detener el temporizador en cuanto se responde
    clearInterval(timer);
    if (!gameActive) return;
    const selectedButton = e.target;
    if (selectedButton.dataset.correct) score++;
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add(button.dataset.correct ? 'correct' : 'wrong');
        button.disabled = true;
    });

    setTimeout(() => {
        currentQuestionIndex++;
        updateProgressBar();
        setNextQuestion();
    }, 1500);
}

function updateProgressBar() {
    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
}

function showEndScreen() {
    // NUEVO: Detener el temporizador al final del juego
    clearInterval(timer);
    gameActive = false;
    stopAnthem();
    quizScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    overlay.classList.remove('hide');
    mainContainer.classList.add('active-modal');
    
    shareButton.innerText = '¡Demuestra tu resultado por DM!';
    
    scoreText.innerText = `Tu puntuación: ${score} de ${questions.length}`;
    finalMessageText.innerText = getFinalMessage(score);
    shareInstructions.innerText = 'Pulsa el botón para copiar tu resultado y abrir nuestro chat. ¡Solo tienes que pegar y enviar!';
    shareInstructions.classList.remove('hide');
    
    shareMessage = `¡Hola! Mi resultado en el Quiz Racinguista ha sido de ${score}/${questions.length} aciertos. ¡Aúpa Racing! 💚🤍`;
}

// --- NUEVAS FUNCIONES PARA EL TEMPORIZADOR ---

function startTimer() {
    timeLeft = 120; // 2 minutos en segundos
    updateTimerDisplay(); // Mostrar tiempo inicial
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp(); // Se acabó el tiempo
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    // Añadir un cero a la izquierda si los segundos son menores de 10
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.innerText = `${minutes}:${seconds}`;
    
    // Cambiar a color rojo cuando queden 10 segundos o menos
    if (timeLeft <= 10) {
        timerElement.style.color = 'red';
    } else {
        timerElement.style.color = ''; // Volver al color por defecto
    }
}

function handleTimeUp() {
    // Marcar la respuesta correcta y deshabilitar todas
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add(button.dataset.correct ? 'correct' : 'wrong');
        button.disabled = true;
    });

    // Esperar un momento y pasar a la siguiente pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        updateProgressBar();
        setNextQuestion();
    }, 1500);
}


function getFinalMessage(score) {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "¡IMPRESIONANTE! Eres una auténtica enciclopedia racinguista.";
    if (percentage >= 70) return "¡Muy bien! Se nota que llevas el racinguismo en la sangre.";
    if (percentage >= 40) return "No está mal, conoces lo básico. ¡Sigue aprendiendo!";
    return "Uhm... ¡Hay que repasar un poco más la historia del club!";
}
