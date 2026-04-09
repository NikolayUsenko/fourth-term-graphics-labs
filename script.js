// Получение ссылок на элементы DOM
const canvas = document.getElementById('bezierCanvas');
const ctx = canvas.getContext('2d');
const quadraticBtn = document.getElementById('quadraticBtn');
const cubicBtn = document.getElementById('cubicBtn');
const clearBtn = document.getElementById('clearBtn');
const statusMessage = document.getElementById('statusMessage');

// Текущее состояние
let points = [];                 // массив точек {x, y}
let mode = 'quadratic';          // 'quadratic' или 'cubic'
let maxPoints = 3;               // для квадратичной по умолчанию

function setActiveMode(activeMode) {
    mode = activeMode;
    maxPoints = mode === 'quadratic' ? 3 : 4;
    
    quadraticBtn.classList.remove('active');
    cubicBtn.classList.remove('active');
    
    if (mode === 'quadratic') {
        quadraticBtn.classList.add('active');
    } else {
        cubicBtn.classList.add('active');
    }
    
    // Если точек больше, чем нужно для нового режима - обрезаем
    if (points.length > maxPoints) {
        points = points.slice(0, maxPoints);
    }
    
    updateStatus();
    drawCanvas();
}

// Обновление статусного сообщения
function updateStatus() {
    if (points.length === maxPoints) {
        statusMessage.textContent = `Набрано ${maxPoints} точек. Кривая нарисована!`;
    } else {
        statusMessage.textContent = `Добавьте еще ${maxPoints - points.length} точек`;
    }
}

// Отрисовка canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length === 0) return;

    // Рисуем соединительные линии (серый пунктир)
    if (points.length > 1) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]); // сбрасываем пунктир
    }

    // Рисуем кривую Безье, если достаточно точек
    if (points.length === maxPoints) {
        ctx.beginPath();
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        
        if (mode === 'quadratic' && points.length === 3) {
            // Квадратичная кривая: start, control, end
            ctx.moveTo(points[0].x, points[0].y);
            ctx.quadraticCurveTo(
                points[1].x, points[1].y,
                points[2].x, points[2].y
            );
        } else if (mode === 'cubic' && points.length === 4) {
            // Кубическая кривая: start, control1, control2, end
            ctx.moveTo(points[0].x, points[0].y);
            ctx.bezierCurveTo(
                points[1].x, points[1].y,
                points[2].x, points[2].y,
                points[3].x, points[3].y
            );
        }
        ctx.stroke();
    }

    // Рисуем точки (синие кружки)
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = '#2196F3';
        ctx.arc(points[i].x, points[i].y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Подпись точки
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i + 1, points[i].x, points[i].y);
    }
}

// Обработчик клика по canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Ограничиваем координаты пределами canvas
    const clampedX = Math.min(Math.max(x, 0), canvas.width);
    const clampedY = Math.min(Math.max(y, 0), canvas.height);
    
    // Если уже достигнут лимит - не добавляем
    if (points.length >= maxPoints) {
        statusMessage.textContent = `Уже есть ${maxPoints} точек. Нажмите "Очистить" или смените режим`;
        return;
    }
    
    // Добавляем точку
    points.push({ x: clampedX, y: clampedY });
    
    updateStatus();
    drawCanvas();
});

// Обработчики кнопок
quadraticBtn.addEventListener('click', () => {
    setActiveMode('quadratic');
    drawCanvas();
});

cubicBtn.addEventListener('click', () => {
    setActiveMode('cubic');
    drawCanvas();
});

clearBtn.addEventListener('click', () => {
    points = [];
    updateStatus();
    drawCanvas();
});

// Инициализация
setActiveMode('quadratic');
drawCanvas();