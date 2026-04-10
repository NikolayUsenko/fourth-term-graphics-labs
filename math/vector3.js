class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // Сложение
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    // Вычитание
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    // Умножение на скаляр
    multiplyScalar(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }
    // Деление на скаляр
    divideScalar(s) {
        if (s === 0) return new Vector3(0, 0, 0);
        return new Vector3(this.x / s, this.y / s, this.z / s);
    }
    // Длина вектора
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    // Квадрат длины (быстрее, если не нужен корень)
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    // Нормализация
    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3(0, 0, 0);
        return this.divideScalar(len);
    }
    // Скалярное произведение
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    // Векторное произведение
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    // Копирование
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    // Строковое представление (для отладки)
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }
    // Статические методы для часто используемых векторов
    static zero() { return new Vector3(0, 0, 0); }
    static one() { return new Vector3(1, 1, 1); }
    static up() { return new Vector3(0, 1, 0); }
    static down() { return new Vector3(0, -1, 0); }
    static right() { return new Vector3(1, 0, 0); }
    static left() { return new Vector3(-1, 0, 0); }
    static forward() { return new Vector3(0, 0, 1); }
    static back() { return new Vector3(0, 0, -1); }
}