// renderer/zbuffer.js
class ZBuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.clear();
    }
    clear() {
        // Инициализируем массив дальним значением (1.0 в NDC)
        this.buffer = new Array(this.width * this.height).fill(1.0);
    }
    // Проверка и установка глубины
    testAndSet(x, y, z) {
        // Проверка границ
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        const index = y * this.width + x;
        // z должен быть в диапазоне [0, 1] (0 = ближе, 1 = дальше)
        if (z < this.buffer[index]) {
            this.buffer[index] = z;
            return true;
        }
        return false;
    }
    // Получить значение глубины
    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 1.0;
        }
        return this.buffer[y * this.width + x];
    }
    // Визуализация Z-буфера (для отладки)
    renderToCanvas(ctx) {
        const imageData = ctx.createImageData(this.width, this.height);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const z = this.get(x, y);
                const intensity = Math.floor((1 - z) * 255);
                const index = (y * this.width + x) * 4;
                imageData.data[index] = intensity;
                imageData.data[index + 1] = intensity;
                imageData.data[index + 2] = intensity;
                imageData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
}