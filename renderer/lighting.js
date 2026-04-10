class Lighting {
  constructor() {
    this.ambient = 0.2;
    this.diffuse = 0.8;
    this.lightDir = new Vector3(1, 1, 1).normalize();
  }

  calculateIntensity(normal) {
    const dot = Math.max(0, normal.dot(this.lightDir));
    return this.ambient + this.diffuse * dot;
  }

  applyLighting(color, intensity) {
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const newR = Math.floor(r * intensity);
    const newG = Math.floor(g * intensity);
    const newB = Math.floor(b * intensity);
    return `rgb(${newR}, ${newG}, ${newB})`;
  }
}