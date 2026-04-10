class WireframeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.modelMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = Matrix4.perspective(
      Math.PI / 3,
      this.width / this.height,
      0.1,
      100.0
    );
    this.camera = {
      position: new Vector3(0, 0, 5),
      target: new Vector3(0, 0, 0),
      up: new Vector3(0, 1, 0)
    };
    this.updateViewMatrix();
  }

  updateViewMatrix() {
    this.viewMatrix = Matrix4.lookAt(
      this.camera.position,
      this.camera.target,
      this.camera.up
    );
  }

  project(vertex) {
    const mvp = this.projectionMatrix.multiply(
      this.viewMatrix.multiply(this.modelMatrix)
    );
    const clip = mvp.multiplyVector(new Vector3(vertex.x, vertex.y, vertex.z));
    if (clip.w === 0) return null;
    const ndc = {
      x: clip.x / clip.w,
      y: clip.y / clip.w,
      z: clip.z / clip.w
    };
    const screenX = (ndc.x + 1) * 0.5 * this.width;
    const screenY = (1 - (ndc.y + 1) * 0.5) * this.height;
    return { x: screenX, y: screenY, z: ndc.z };
  }

  drawLine(p1, p2) {
    if (!p1 || !p2) return;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  render(cube) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    const projected = cube.vertices.map(v => this.project(v));
    this.ctx.strokeStyle = '#0f0';
    this.ctx.lineWidth = 2;
    cube.edges.forEach(edge => {
      const p1 = projected[edge[0]];
      const p2 = projected[edge[1]];
      this.drawLine(p1, p2);
    });
    projected.forEach((p, i) => {
      if (p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff0';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(i.toString(), p.x + 5, p.y - 5);
      }
    });
  }

  setRotation(angleX, angleY, angleZ) {
    const rotX = Matrix4.rotationX(angleX);
    const rotY = Matrix4.rotationY(angleY);
    const rotZ = Matrix4.rotationZ(angleZ);
    this.modelMatrix = rotZ.multiply(rotY.multiply(rotX));
  }
}