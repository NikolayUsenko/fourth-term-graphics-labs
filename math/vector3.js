class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiplyScalar(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }

  divideScalar(s) {
    if (s === 0) return new Vector3(0, 0, 0);
    return new Vector3(this.x / s, this.y / s, this.z / s);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  normalize() {
    const len = this.length();
    if (len === 0) return new Vector3(0, 0, 0);
    return this.divideScalar(len);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  static up() {
    return new Vector3(0, 1, 0);
  }

  static down() {
    return new Vector3(0, -1, 0);
  }

  static right() {
    return new Vector3(1, 0, 0);
  }

  static left() {
    return new Vector3(-1, 0, 0);
  }

  static forward() {
    return new Vector3(0, 0, 1);
  }

  static back() {
    return new Vector3(0, 0, -1);
  }
}