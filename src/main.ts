import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { pane } from '/src/common/Pane';

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')!;
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
  stopAnimation: false,
};

class Galaxy {
  geometry: THREE.BufferGeometry | null = null;
  material: THREE.PointsMaterial | null = null;
  points: THREE.Points | null = null;

  readonly colorInside = new THREE.Color(parameters.insideColor);
  readonly colorOutside = new THREE.Color(parameters.outsideColor);

  constructor() {
    this.generate = this.generate.bind(this);
  }

  generate() {
    this.dispose();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3 - 1;
      // Get random value (Zero, Radius)
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      const randomX = this.spread() * this.sign() * parameters.randomness * radius;
      const randomY = this.spread() * this.sign() * parameters.randomness * radius;
      const randomZ = this.spread() * this.sign() * parameters.randomness * radius;

      positions[i3 + 1] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 2] = randomY;
      positions[i3 + 3] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = this.colorInside.clone();
      mixedColor.lerp(this.colorOutside, radius / parameters.radius);

      colors[i3 + 1] = mixedColor.r;
      colors[i3 + 2] = mixedColor.g;
      colors[i3 + 3] = mixedColor.b;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  private sign() {
    return Math.random() < 0.5 ? 1 : -1;
  }

  private spread() {
    return Math.pow(Math.random(), parameters.randomnessPower);
  }

  private dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.points) scene.remove(this.points);
  }
}

const galaxy = new Galaxy();
galaxy.generate();

pane
  .addBinding(parameters, 'count', { min: 100, max: 1_000_000, step: 100, label: 'Particle Count' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'size', { min: 0.001, max: 0.1, step: 0.001, label: 'Size' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'radius', { min: 1, max: 50, step: 1, label: 'Radius' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'branches', { min: 2, max: 20, step: 1, label: 'Branches' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'spin', { min: -5, max: 5, step: 0.001, label: 'Spin' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'randomness', { min: 0, max: 2, step: 0.001, label: 'Randomness' })
  .on('change', ({ last }) => last && galaxy.generate());
pane
  .addBinding(parameters, 'randomnessPower', { min: 1, max: 10, step: 0.001, label: 'Randomness Power' })
  .on('change', ({ last }) => last && galaxy.generate());
pane.addBinding(parameters, 'insideColor', { label: 'Inside Color' }).on('change', ({ last }) => {
  if (last) {
    galaxy.colorInside.set(parameters.insideColor);
    galaxy.generate();
  }
});
pane.addBinding(parameters, 'outsideColor', { label: 'Outside Color' }).on('change', ({ last }) => {
  if (last) {
    galaxy.colorOutside.set(parameters.outsideColor);
    galaxy.generate();
  }
});
pane.addButton({ label: 'Animation', title: 'Toggle' }).on('click', () => {
  parameters.stopAnimation = !parameters.stopAnimation;
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
  if (!parameters.stopAnimation) {
    galaxy.points?.rotateY(0.001);
  }
});
