class Octahedron {
  constructor() {
    this.vertices = [
      new Vector3(0, 1.2, 0),     // 0 - верхняя вершина
      new Vector3(0, -1.2, 0),    // 1 - нижняя вершина
      new Vector3(1, 0, 0),       // 2 - правая
      new Vector3(-1, 0, 0),      // 3 - левая
      new Vector3(0, 0, 1),       // 4 - передняя
      new Vector3(0, 0, -1)       // 5 - задняя
    ];

    this.edges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];
  }

  getEdges() {
    return this.edges;
  }

  transform(matrix) {
    return this.vertices.map(v => matrix.multiplyVector(v));
  }
}