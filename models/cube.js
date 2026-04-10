// models/cube.js
class Cube {
    constructor() {
        // Вершины куба (8 вершин)
        this.vertices = [
            new Vector3(-1, -1, -1), // 0
            new Vector3(1, -1, -1), // 1
            new Vector3(1, 1, -1), // 2
            new Vector3(-1, 1, -1), // 3
            new Vector3(-1, -1, 1), // 4
            new Vector3(1, -1, 1), // 5
            new Vector3(1, 1, 1), // 6
            new Vector3(-1, 1, 1) // 7
        ];
        // Рёбра куба (12 рёбер, каждое задаётся парой индексов вершин)
        this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // задняя грань
            [4, 5], [5, 6], [6, 7], [7, 4], // передняя грань
            [0, 4], [1, 5], [2, 6], [3, 7] // соединительные рёбра
        ];
    }
    // Применение матрицы трансформации ко всем вершинам
    transform(matrix) {
        return this.vertices.map(v => matrix.multiplyVector(v));
    }
}