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
      position: new Vector3(0, 0, 4.5),
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
    let x0 = Math.round(p1.x);
    let y0 = Math.round(p1.y);
    let x1 = Math.round(p2.x);
    let y1 = Math.round(p2.y);
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    
    while (true) {
      if (x0 >= 0 && x0 < this.width && y0 >= 0 && y0 < this.height) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x0, y0, 1, 1);
      }
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  render(octahedron) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const transformed = octahedron.vertices.map(v => this.project(v));
    
    const edges = octahedron.getEdges();
    edges.forEach(edge => {
      const p1 = transformed[edge[0]];
      const p2 = transformed[edge[1]];
      this.drawLine(p1, p2);
    });
    
    transformed.forEach((p, i) => {
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

  setProjection(type, aspect) {
    if (type === 'perspective') {
      this.projectionMatrix = Matrix4.perspective(Math.PI / 3, aspect, 0.1, 100);
    } else {
      this.projectionMatrix = Matrix4.orthographic(-2, 2, -2, 2, 0.1, 100);
    }
  }
}