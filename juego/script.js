document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a los elementos del DOM ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-btn');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const scoreText = document.getElementById('score-text');
    const finalMessageText = document.getElementById('final-message');
    
    // --- Referencias a los botones de compartir (CORREGIDO Y FINAL) ---
    // El botón de Instagram tiene el id "share-btn" en tu HTML
    const instagramButton = document.getElementById('share-btn'); 
    // El botón de WhatsApp tiene el id "whatsapp-btn" en tu HTML
    const whatsappButton = document.getElementById('whatsapp-btn');
    
    const shareButtonsContainer = document.getElementById('share-buttons');

    // --- Variables y preguntas del juego (sin cambios) ---
    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 120;
    let gameEnded = false;

    const questions = [
        { question: "¿En qué año se fundó el Racing de Santander?", answers: [{ text: "1913", correct: true }, { text: "1920", correct: false }, { text: "1905", correct: false }, { text: "1919", correct: false }] },
        { question: "¿Cuál es el estadio del Racing?", answers: [{ text: "El Sardinero", correct: true }, { text: "San Mamés", correct: false }, { text: "Mestalla", correct: false }, { text: "Riazor", correct: false }] },
        { question: "¿Quién forma el dúo 'Sacapuntas' en el Racing de Santander?", answers: [{ text: "Karpin & Sergio", correct: false }, { text: "Zigic & Munitis", correct: true }, { text: "Luis Enrique & Quique", correct: false }, { text: "Tamudo & De la Red", correct: false }] },
        { question: "¿En qué año subió el Racing de Santander a Primera División?", answers: [{ text: "1999/2000", correct: false }, { text: "2000/2001", correct: false }, { text: "2001/2002", correct: true }, { text: "2002/2003", correct: false }] },
        { question: "¿En qué temporada se fue Pablo Torre del Racing de Santander?", answers: [{ text: "2019/2020", correct: false }, { text: "2020/2021", correct: false }, { text: "2021/2022", correct: true }, { text: "2022/2023", correct: false }] },
        { question: "¿Cómo se les conoce a los aficionados del Racing de Santander?", answers: [{ text: "Santanderinos", correct: false }, { text: "Cantabros", correct: false }, { text: "Verdiblancos", correct: false }, { text: "Racinguistas", correct: true }] },
        { question: "¿Quién fue el entrenador del Racing en el ascenso 92/93?", answers: [{ text: "José Alberto López", correct: false }, { text: "Héctor Cúper", correct: false }, { text: "Paquito", correct: true }, { text: "Manuel Ibarra", correct: false }] },
        { question: "¿En qué año dejó la directiva Mikel Martija?", answers: [{ text: "2023", correct: false }, { text: "2019", correct: false }, { text: "2025", correct: true }, { text: "2020", correct: false }] },
        { question: "¿Quién es el abonado número 1 del Racing?", answers: [{ text: "Javier Fernández", correct: false }, { text: "Carlos Ruiz", correct: false }, { text: "Pedro Martínez", correct: false }, { text: "Mauricio Gómez", correct: true }] },
        { question: "¿Cuál es el color principal del uniforme del Racing?", answers: [{ text: "Rojo y blanco", correct: false }, { text: "Azul y negro", correct: false }, { text: "Negro y amarillo", correct: false }, { text: "Verde y blanco", correct: true }] }
    ];

    // --- Lógica del juego (sin cambios) ---
    startButton.addEventListener('click', startGame);

    function startGame() {
        startScreen.classList.add('hide');
        quizScreen.classList.remove('hide');
        score = 0;
        currentQuestionIndex = 0;
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        gameEnded = false;
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < shuffledQuestions.length) {
            updateProgressBar();
            showQuestion(shuffledQuestions[currentQuestionIndex]);
            startQuestionTimer();
        } else {
            endGame();
        }
    }

    function showQuestion(questionData) {
        questionElement.innerText = questionData.question;
        questionData.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) button.dataset.correct = "true";
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() { clearInterval(timer); answerButtonsElement.innerHTML = ''; timerElement.classList.remove('warning'); }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === "true";
        if (correct) score++;
        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === "true");
            button.disabled = true;
        });
        clearInterval(timer);
        setTimeout(() => { currentQuestionIndex++; setNextQuestion(); }, 1500);
    }

    function setStatusClass(element, correct) { element.classList.remove('correct', 'wrong'); element.classList.add(correct ? 'correct' : 'wrong'); }
    function updateProgressBar() { progressBar.style.width = `${Math.min((currentQuestionIndex / questions.length) * 100, 100)}%`; }

    function startQuestionTimer() {
        timeLeft = 120;
        updateTimerDisplay();
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 10) timerElement.classList.add('warning');
            if (timeLeft <= 0) { clearInterval(timer); markAllWrong(); setTimeout(() => { currentQuestionIndex++; setNextQuestion(); }, 1500); }
        }, 1000);
    }

    function updateTimerDisplay() { const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60; timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; }
    function markAllWrong() { Array.from(answerButtonsElement.children).forEach(button => { setStatusClass(button, button.dataset.correct === "true"); button.disabled = true; }); }

    function endGame() {
        clearInterval(timer);
        gameEnded = true;
        quizScreen.classList.add('hide');
        endScreen.classList.remove('hide');
        scoreText.innerText = `Tu puntuación: ${score} de ${questions.length}`;
        finalMessageText.innerText = score >= Math.ceil(questions.length / 2) ? '¡Excelente! Eres un verdadero racinguista.' : '¡Sigue practicando! Seguro lo harás mejor la próxima vez.';
        shareButtonsContainer.classList.remove('hide');
    }

    // --- FUNCIONES PARA COMPARTIR (SIN CAMBIOS) ---
    function shareByWhatsApp() {
        const message = `¡He conseguido ${score} de ${questions.length} en el Quiz del Racing! ⚽️`;
        const phoneNumber = "722541508";
        const whatsappURL = `https://wa.me/34${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }

    function shareByInstagramDM() {
        const instagramUsername = 'fan_rrc_1913';
        const message = `¡He conseguido ${score} de ${questions.length} en el Quiz del Racing! ⚽️`;
        const instagramURL = `https://ig.me/m/${instagramUsername}`;
        window.open(instagramURL, '_blank');
        navigator.clipboard.writeText(message)
            .then(() => alert('Se ha abierto Instagram. El resultado se ha copiado, ¡solo tienes que pegarlo en el chat!'))
            .catch(err => {
                console.error('Error al copiar:', err);
                prompt('No se pudo copiar el texto. Cópialo manualmente y pégalo en Instagram:', message);
            });
    }

    // --- ASIGNACIÓN DE EVENTOS FINAL Y CORRECTA ---
    // Se asigna la función de INSTAGRAM al botón con id="share-btn"
    if (instagramButton) {
        instagramButton.addEventListener('click', shareByInstagramDM);
    }

    // Se asigna la función de WHATSAPP al botón con id="whatsapp-btn"
    if (whatsappButton) {
        whatsappButton.addEventListener('click', shareByWhatsApp);
    }

    // --- Código de seguridad (sin cambios) ---
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => { if ((e.ctrlKey && ['t', 'n', 'r', 'w'].includes(e.key.toLowerCase())) || e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) { e.preventDefault(); } });
    window.addEventListener('blur', () => { if (!gameEnded) { alert('¡Has cambiado de pestaña! El juego ha terminado.'); endGame(); } });
});
