const canvas = document.getElementById('canvas');
const renderer = new WireframeRenderer(canvas);
const octahedron = new Octahedron();

let angleX = 0;
let angleY = 0;
let angleZ = 0;
let rotating = false;
let lastTimestamp = 0;
let frameCount = 0;
let fps = 0;

function updateFPS(timestamp) {
  frameCount++;
  if (timestamp - lastTimestamp >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTimestamp = timestamp;
    const infoDiv = document.getElementById('info');
    if (infoDiv) {
      infoDiv.innerHTML = `FPS: ${fps} | Рёбер: 12`;
    }
  }
}

function animate(timestamp) {
  if (rotating) {
    angleX += 0.015;
    angleY += 0.02;
    angleZ += 0.01;
    renderer.setRotation(angleX, angleY, angleZ);
  }
  renderer.render(octahedron);
  updateFPS(timestamp);
  requestAnimationFrame(animate);
}

document.getElementById('rotateBtn').addEventListener('click', () => {
  rotating = !rotating;
  document.getElementById('rotateBtn').textContent = rotating ? '⏸ Стоп' : '▶ Вращать';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  rotating = false;
  angleX = 0;
  angleY = 0;
  angleZ = 0;
  renderer.setRotation(0, 0, 0);
  document.getElementById('rotateBtn').textContent = '▶ Вращать';
});

document.getElementById('projectionSelect').addEventListener('change', (e) => {
  const aspect = canvas.width / canvas.height;
  renderer.setProjection(e.target.value, aspect);
});

window.addEventListener('resize', () => {
  const aspect = canvas.width / canvas.height;
  const currentProj = document.getElementById('projectionSelect').value;
  renderer.setProjection(currentProj, aspect);
});

renderer.setRotation(0.3, 0.4, 0.2);
animate(0);