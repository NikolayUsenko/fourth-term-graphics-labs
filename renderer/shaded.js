class ShadedRenderer extends SolidRenderer {
  constructor(canvas) {
    super(canvas);
    this.lighting = new Lighting();
  }

  render(cube) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.zbuffer.clear();

    const mvp = this.projectionMatrix.multiply(
      this.viewMatrix.multiply(this.modelMatrix)
    );
    const transformed = cube.vertices.map(v => mvp.multiplyVector(v));

    const normalMatrix = this.modelMatrix;

    const transformedNormals = cube.faces.map(face => {
      const worldNormal = normalMatrix.multiplyVector(face.normal);
      return new Vector3(worldNormal.x, worldNormal.y, worldNormal.z).normalize();
    });

    cube.faces.forEach((face, idx) => {
      const intensity = this.lighting.calculateIntensity(transformedNormals[idx]);
      const color = this.lighting.applyLighting(face.color, intensity);

      const triangles = cube.triangulateFace(face);
      triangles.forEach(tri => {
        const v1 = transformed[tri[0]];
        const v2 = transformed[tri[1]];
        const v3 = transformed[tri[2]];
        if (v1 && v2 && v3) {
          this.drawTriangle(v1, v2, v3, color);
        }
      });
    });
  }
}