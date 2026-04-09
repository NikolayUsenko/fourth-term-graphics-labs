const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;

// Центр холста
ctx.translate(radius, radius);

function drawClock() {
    const now = new Date();

    // Текущее время
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Очистка холста
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    // Циферблат
    drawFace();

    // Цифры
    drawNumbers();

    // Стрелки
    drawHand(hours % 12 * 30 + minutes * 0.5, radius * 0.5, 8, '#000'); // Часовая
    drawHand(minutes * 6 + seconds * 0.1, radius * 0.7, 4, '#000');     // Минутная
    drawHand(seconds * 6 + milliseconds * 0.006, radius * 0.8, 2, '#1a29ff'); // Секундная (плавная)

    // Центральная точка
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Запрос следующего кадра анимации
    requestAnimationFrame(drawClock);
}

function drawFace() {
    // Внешняя окружность
    ctx.beginPath();
    ctx.arc(0, 0, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Деления для часов и минут
    for (let i = 0; i < 60; i++) {
        const angle = (i * 6 * Math.PI) / 180;
        const startRadius = i % 5 === 0 ? radius - 25 : radius - 15;
        const endRadius = i % 5 === 0 ? radius - 10 : radius - 12;

        const x1 = Math.sin(angle) * startRadius;
        const y1 = -Math.cos(angle) * startRadius;
        const x2 = Math.sin(angle) * endRadius;
        const y2 = -Math.cos(angle) * endRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = i % 5 === 0 ? 3 : 1;
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
}

function drawNumbers() {
    ctx.font = '25px Arial, Helvetica, sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = Math.cos(angle) * (radius - 45);
        const y = Math.sin(angle) * (radius - 45);
        ctx.fillText(i.toString(), x, y);
    }
}

function drawHand(angle, length, width, color) {
    const rad = (angle - 90) * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(rad) * length, Math.sin(rad) * length);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// Запуск анимации
drawClock();