document.addEventListener("DOMContentLoaded", function () {
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.querySelector(".start");
    const pauseBtn = document.querySelector(".pause");
    const resetBtn = document.querySelector(".reset");
    const minutesInput = document.getElementById("minutesInput");
    const secondsInput = document.getElementById("secondsInput");
    const setBtn = document.querySelector(".set");
    const tickSound = document.getElementById("ticksound");
    const alarmSound = document.getElementById("alarmsound");

    let duration = 10 * 60;
    let remainingTime = duration;
    let timerInterval = null;
    let isRunning = false;
    let alarmTimeout = null; // untuk menyimpan timeout penghentian alarm

    function updateDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning || remainingTime <= 0) return;
        isRunning = true;

        tickSound.loop = true;
        tickSound.play();

        timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                isRunning = false;

                tickSound.pause();
                tickSound.currentTime = 0;
                tickSound.loop = false; // pastikan loop dimatikan

                alarmSound.play();

                // Hentikan alarm otomatis setelah 7 detik (bisa disesuaikan)
                alarmTimeout = setTimeout(() => {
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                }, 8000);

                return;
            }

            remainingTime--;
            updateDisplay(remainingTime);
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;

        tickSound.pause();

        // Hentikan alarm dan timeoutnya jika ada
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
            alarmTimeout = null;
        }
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        remainingTime = duration;
        isRunning = false;
        updateDisplay(remainingTime);

        tickSound.pause();
        tickSound.currentTime = 0;
        tickSound.loop = false;

        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
            alarmTimeout = null;
        }
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function setTimerFromInput() {
        const min = parseInt(minutesInput.value) || 0;
        const sec = parseInt(secondsInput.value) || 0;

        duration = (min * 60) + sec;
        remainingTime = duration;
        isRunning = false;
        clearInterval(timerInterval);
        updateDisplay(remainingTime);

        tickSound.pause();
        tickSound.currentTime = 0;
        tickSound.loop = false;

        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
            alarmTimeout = null;
        }
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
    setBtn.addEventListener("click", setTimerFromInput);

    updateDisplay(remainingTime);
});
