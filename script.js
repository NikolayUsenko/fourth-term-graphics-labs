const canvas = document.getElementById('canvas');
const renderer = new WireframeRenderer(canvas);
const cube = new Cube();
let angle = 0;
let rotating = false;
function animate() {
    if (rotating) {
        angle += 0.02;
        renderer.setRotation(angle, angle * 0.5, angle * 0.3);
    }
    renderer.render(cube);
    // Обновление FPS
    updateFPS();
    requestAnimationFrame(animate);
}
document.getElementById('rotateBtn').addEventListener('click', () => {
    rotating = !rotating;
});
document.getElementById('resetBtn').addEventListener('click', () => {
    rotating = false;
    angle = 0;
    renderer.setRotation(0, 0, 0);
});
document.getElementById('projectionSelect').addEventListener('change', (e) => {
    const aspect = canvas.width / canvas.height;
    if (e.target.value === 'perspective') {
        renderer.projectionMatrix = Matrix4.perspective(Math.PI / 3, aspect, 0.1,
            100);
    } else {
        renderer.projectionMatrix = Matrix4.orthographic(-2, 2, -2, 2, 0.1, 100);
    }
});
// Запуск анимации
animate();