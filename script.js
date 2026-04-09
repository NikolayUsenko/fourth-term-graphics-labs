// Класс PixelBuffer
class PixelBuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.imageData = this.ctx.createImageData(width, height);
        this.data = this.imageData.data;
    }

    // Установка пикселя с проверкой границ
    setPixel(x, y, r, g, b, a = 255) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        const index = (y * this.width + x) * 4;
        this.data[index] = r;
        this.data[index + 1] = g;
        this.data[index + 2] = b;
        this.data[index + 3] = a;
        return true;
    }

    // Очистка буфера заданным цветом
    clear(r = 0, g = 0, b = 0, a = 255) {
        for (let i = 0; i < this.data.length; i += 4) {
            this.data[i] = r;
            this.data[i + 1] = g;
            this.data[i + 2] = b;
            this.data[i + 3] = a;
        }
    }

    // Вывод на экран
    render() {
        this.ctx.putImageData(this.imageData, 0, 0);
        return this.canvas;
    }
}

// Вспомогательная функция для рисования горизонтальной линии
function drawHorizontalLine(buffer, x0, y, x1, color) {
    if (y < 0 || y >= buffer.height) return;
    let start = Math.min(x0, x1);
    let end = Math.max(x0, x1);
    start = Math.max(0, Math.floor(start));
    end = Math.min(buffer.width - 1, Math.floor(end));
    for (let x = start; x <= end; x++) {
        buffer.setPixel(x, y, color[0], color[1], color[2], color[3] || 255);
    }
}

// Алгоритм Брезенхема для окружности
function drawCircleBresenham(buffer, xc, yc, r, color) {
    let x = 0;
    let y = r;
    let d = 1 - r;

    while (x <= y) {
        buffer.setPixel(xc + x, yc + y, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc - x, yc + y, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc + x, yc - y, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc - x, yc - y, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc + y, yc + x, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc - y, yc + x, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc + y, yc - x, color[0], color[1], color[2], color[3] || 255);
        buffer.setPixel(xc - y, yc - x, color[0], color[1], color[2], color[3] || 255);

        if (d < 0) {
            d += 2 * x + 3;
        } else {
            d += 2 * (x - y) + 5;
            y--;
        }
        x++;
    }
}

// Заливка круга на основе алгоритма Брезенхема
function fillCircleBresenham(buffer, xc, yc, r, color) {
    let x = 0;
    let y = r;
    let d = 1 - r;

    while (x <= y) {
        // Горизонтальные линии на высоте yc + y и yc - y
        drawHorizontalLine(buffer, xc - x, yc + y, xc + x, color);
        drawHorizontalLine(buffer, xc - x, yc - y, xc + x, color);

        // Горизонтальные линии на высоте yc + x и yc - x
        drawHorizontalLine(buffer, xc - y, yc + x, xc + y, color);
        drawHorizontalLine(buffer, xc - y, yc - x, xc + y, color);

        if (d < 0) {
            d += 2 * x + 3;
        } else {
            d += 2 * (x - y) + 5;
            y--;
        }
        x++;
    }
}

//Алгоритм Ву для окружности
function drawCircleWu(buffer, xc, yc, r, color) {
    // Основной цвет
    const baseR = color[0], baseG = color[1], baseB = color[2];

    for (let x = 0; x <= r; x++) {
        // Точное значение y на окружности
        const yExact = Math.sqrt(r * r - x * x);
        const y1 = Math.floor(yExact);
        const y2 = y1 + 1;
        const frac = yExact - y1; // дробная часть

        // Интенсивность (alpha) для двух пикселей
        const alpha1 = Math.round((1 - frac) * 255);
        const alpha2 = Math.round(frac * 255);

        if (y1 >= 0 && y1 <= r) {
            // Рисуем 8 октантов для пары (x, y1)
            put8Wu(buffer, xc, yc, x, y1, baseR, baseG, baseB, alpha1);
        }
        if (y2 >= 0 && y2 <= r && alpha2 > 0) {
            put8Wu(buffer, xc, yc, x, y2, baseR, baseG, baseB, alpha2);
        }
    }
}


// Вспомогательная функция для отрисовки 8 симметричных точек с заданной альфой (алгоритм Ву)
function put8Wu(buffer, xc, yc, dx, dy, r, g, b, alpha) {
    // (dx, dy)
    buffer.setPixel(xc + dx, yc + dy, r, g, b, alpha);
    buffer.setPixel(xc - dx, yc + dy, r, g, b, alpha);
    buffer.setPixel(xc + dx, yc - dy, r, g, b, alpha);
    buffer.setPixel(xc - dx, yc - dy, r, g, b, alpha);
    // (dy, dx) — если dx != dy, иначе это те же точки, но повторная установка не страшна
    if (dx !== dy) {
        buffer.setPixel(xc + dy, yc + dx, r, g, b, alpha);
        buffer.setPixel(xc - dy, yc + dx, r, g, b, alpha);
        buffer.setPixel(xc + dy, yc - dx, r, g, b, alpha);
        buffer.setPixel(xc - dy, yc - dx, r, g, b, alpha);
    }
}

// Отрисовка всех четырёх окружностей на основном canvas
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const regions = [
    { method: 'arc', label: 'arc()', color: '#e63946', offsetX: 200, offsetY: 150 },
    { method: 'bresenham', label: 'Брезенхем', color: '#2ecc71', offsetX: 600, offsetY: 150 },
    { method: 'fill', label: 'Заливка', color: '#3498db', offsetX: 200, offsetY: 450 },
    { method: 'wu', label: 'Ву', color: '#9b59b6', offsetX: 600, offsetY: 450 }
];

function drawAllCircles() {
    // Очищаем основной canvas
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);

    // Для каждой области создаём свой PixelBuffer 200x200, рисуем, затем вставляем
    regions.forEach(reg => {
        const buffer = new PixelBuffer(200, 200);
        buffer.clear(255, 255, 255, 255); // белый фон

        const centerX = 100; // относительно буфера
        const centerY = 100;
        const radius = 90;   // чуть меньше, чтобы не упираться в края (90 пикселей)

        if (reg.method === 'arc') {
            // Для arc не используем буфер, рисуем прямо на основном canvas
            ctx.save();
            ctx.strokeStyle = reg.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(reg.offsetX, reg.offsetY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        } else {
            // Рисуем в буфер соответствующим алгоритмом
            if (reg.method === 'bresenham') {
                drawCircleBresenham(buffer, centerX, centerY, radius, [46, 204, 113, 255]); // зеленый
            } else if (reg.method === 'fill') {
                fillCircleBresenham(buffer, centerX, centerY, radius, [52, 152, 219, 255]); // синий
            } else if (reg.method === 'wu') {
                drawCircleWu(buffer, centerX, centerY, radius, [155, 89, 182, 255]); // фиолетовый
            }

            // Вставляем буфер на основной canvas
            ctx.drawImage(buffer.render(), reg.offsetX - 100, reg.offsetY - 100, 200, 200);
        }

        // Подпись под окружностью
        ctx.save();
        ctx.font = 'bold 16px "Segoe UI", sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(reg.label, reg.offsetX, reg.offsetY + 115);
        ctx.restore();
    });
}

// Тест производительности
function runPerformanceTest() {
    const perfDiv = document.getElementById('perfDisplay');
    perfDiv.innerHTML = 'Выполняется замер...';

    // Создаём небольшой буфер 200x200 для тестов
    const testBuffer = new PixelBuffer(200, 200);
    const radius = 50;
    const cx = 100, cy = 100;
    const iterations = 1000;

    // Тест Брезенхема
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
        drawCircleBresenham(testBuffer, cx, cy, radius, [255, 0, 0, 255]);
    }
    let timeBres = performance.now() - start;

    // Тест заливки
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fillCircleBresenham(testBuffer, cx, cy, radius, [0, 255, 0, 255]);
    }
    let timeFill = performance.now() - start;

    // Тест Ву
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
        drawCircleWu(testBuffer, cx, cy, radius, [0, 0, 255, 255]);
    }
    let timeWu = performance.now() - start;

    // Тест встроенного arc
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 200;
    offCanvas.height = 200;
    const offCtx = offCanvas.getContext('2d');
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
        offCtx.clearRect(0, 0, 200, 200);
        offCtx.beginPath();
        offCtx.arc(cx, cy, radius, 0, 2 * Math.PI);
        offCtx.strokeStyle = 'black';
        offCtx.stroke();
    }
    let timeArc = performance.now() - start;

    perfDiv.innerHTML = `
                <span>arc():</span> ${timeArc.toFixed(2)} ms &nbsp;|&nbsp;
                <span>Брезенхем:</span> ${timeBres.toFixed(2)} ms &nbsp;|&nbsp;
                <span>Заливка:</span> ${timeFill.toFixed(2)} ms &nbsp;|&nbsp;
                <span>Ву:</span> ${timeWu.toFixed(2)} ms
            `;
}

// Инициализация и обработчики кнопок
document.getElementById('perfBtn').addEventListener('click', () => {
    runPerformanceTest();
});

// При загрузке страницы автоматически рисуем окружности
window.addEventListener('load', () => {
    drawAllCircles();
});