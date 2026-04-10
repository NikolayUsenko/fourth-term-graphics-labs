// renderer/solid.js
class SolidRenderer extends WireframeRenderer {
    constructor(canvas) {
        super(canvas);
        this.zbuffer = new ZBuffer(canvas.width, canvas.height);
    }
    // Рисование треугольника с проверкой глубины
    drawTriangle(v1, v2, v3, color) {
        // Проецируем вершины
        const p1 = this.project(v1);
        const p2 = this.project(v2);
        const p3 = this.project(v3);
        if (!p1 || !p2 || !p3) return;
        // Находим bounding box треугольника
        const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x)));
        const maxX = Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x,
            p3.x)));
        const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y)));
        const maxY = Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y,
            p3.y)));
        // Функция для вычисления барицентрических координат
        const edge = (a, b, c) => {
            return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        };
        const area = edge(p1, p2, p3);
        if (Math.abs(area) < 0.0001) return;
        // Проходим по всем пикселям в bounding box
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const p = { x, y };
                // Вычисляем барицентрические координаты
                const w0 = edge(p2, p3, p);
                const w1 = edge(p3, p1, p);
                const w2 = edge(p1, p2, p);
                // Нормализуем
                const alpha = w0 / area;
                const beta = w1 / area;
                const gamma = w2 / area;
                // Проверяем, внутри ли пиксель треугольника
                if (alpha >= 0 && beta >= 0 && gamma >= 0) {
                    // Интерполяция глубины
                    const z = alpha * p1.z + beta * p2.z + gamma * p3.z;
                    // Проверка Z-буфера
                    if (this.zbuffer.testAndSet(x, y, z)) {
                        // Рисуем пиксель
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
    }
    render(cube) {
        // Очистка
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Очистка Z-буфера
        this.zbuffer.clear();
        // Получаем треугольники
        const triangles = cube.triangulate();
        // Преобразуем вершины
        const transformed = cube.vertices.map(v => {
            const mvp = this.projectionMatrix.multiply(
                this.viewMatrix.multiply(this.modelMatrix)
            );
            return mvp.multiplyVector(v);
        });
        // Рисуем треугольники
        triangles.forEach(tri => {
            const v1 = transformed[tri.vertices[0]];
            const v2 = transformed[tri.vertices[1]];
            const v3 = transformed[tri.vertices[2]];
            this.drawTriangle(v1, v2, v3, tri.color);
        });
        // Опционально: поверх рисуем каркас
        if (this.showWireframe) {
            this.renderWireframe(cube);
        }
    }
    // Отображение каркаса поверх заливки
    renderWireframe(cube) {
        const projected = cube.vertices.map(v => this.project(v));
        this.ctx.strokeStyle = 'fff';
        this.ctx.lineWidth = 1;
        cube.edges.forEach(edge => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];
            if (p1 && p2) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        });
    }
}