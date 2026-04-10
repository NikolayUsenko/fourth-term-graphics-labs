class CubeWithNormals {
  constructor() {
    this.vertices = [
      new Vector3(-1, -1, -1),
      new Vector3(1, -1, -1),
      new Vector3(1, 1, -1),
      new Vector3(-1, 1, -1),
      new Vector3(-1, -1, 1),
      new Vector3(1, -1, 1),
      new Vector3(1, 1, 1),
      new Vector3(-1, 1, 1)
    ];
    this.edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    this.faces = [
      { vertices: [0, 1, 2, 3], color: 'ff0000' },
      { vertices: [4, 5, 6, 7], color: '00ff00' },
      { vertices: [0, 4, 7, 3], color: '0000ff' },
      { vertices: [1, 5, 6, 2], color: 'ffff00' },
      { vertices: [0, 1, 5, 4], color: 'ff00ff' },
      { vertices: [3, 2, 6, 7], color: '00ffff' }
    ];

    this.faces = this.faces.map(face => {
      const v0 = this.vertices[face.vertices[0]];
      const v1 = this.vertices[face.vertices[1]];
      const v2 = this.vertices[face.vertices[2]];
      const edge1 = v1.subtract(v0);
      const edge2 = v2.subtract(v0);
      const normal = edge1.cross(edge2).normalize();
      return { ...face, normal };
    });
  }

  triangulateFace(face) {
    const v = face.vertices;
    return [
      [v[0], v[1], v[2]],
      [v[0], v[2], v[3]]
    ];
  }

  transform(matrix) {
    return this.vertices.map(v => matrix.multiplyVector(v));
  }
}