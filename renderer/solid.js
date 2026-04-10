class SolidRenderer extends WireframeRenderer {
  constructor(canvas) {
    super(canvas);
    this.zbuffer = new ZBuffer(canvas.width, canvas.height);
  }

  drawTriangle(v1, v2, v3, color) {
    const p1 = this.project(v1);
    const p2 = this.project(v2);
    const p3 = this.project(v3);
    if (!p1 || !p2 || !p3) return;

    const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x)));
    const maxX = Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x, p3.x)));
    const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y)));
    const maxY = Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y, p3.y)));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const denominator = ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
        if (denominator === 0) continue;

        const w1 = ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) / denominator;
        const w2 = ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) / denominator;
        const w3 = 1 - w1 - w2;

        if (w1 >= 0 && w2 >= 0 && w3 >= 0) {
          const z = w1 * p1.z + w2 * p2.z + w3 * p3.z;
          if (this.zbuffer.testAndSet(x, y, z)) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  render(cube) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.zbuffer.clear();

    const mvp = this.projectionMatrix.multiply(
      this.viewMatrix.multiply(this.modelMatrix)
    );
    const transformed = cube.vertices.map(v => mvp.multiplyVector(v));

    cube.faces.forEach(face => {
      const triangles = cube.triangulateFace(face);
      triangles.forEach(tri => {
        const v1 = transformed[tri[0]];
        const v2 = transformed[tri[1]];
        const v3 = transformed[tri[2]];
        if (v1 && v2 && v3) {
          this.drawTriangle(v1, v2, v3, `#${face.color}`);
        }
      });
    });
  }
}