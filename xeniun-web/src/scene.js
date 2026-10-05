/**
 * Xeniun — WebGL scene
 *
 * One fixed canvas behind the page. A glass "Xeniun core" plus a particle
 * system that morphs between procedural 3D models as the visitor scrolls.
 * Each DOM element with [data-scene="n"] maps to KEYFRAMES[n].
 *
 * Build: npm run build  →  assets/js/scene.min.js
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  EdgesGeometry,
  Euler,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  ACESFilmicToneMapping,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const root = document.documentElement;
const canvas = document.getElementById('scene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ACCENT = new Color('#8b97ff');
const ION = new Color('#5ce1e6');

/* Scene keyframes. x / y are fractions of the visible width / height. */
const KEYFRAMES = [
  { shape: 0, x: 0.22, y: 0.02, scale: 1.0, opacity: 1.0, core: 1.0 }, // 0 hero — atom
  { shape: 0, x: 0.0, y: 0.0, scale: 1.45, opacity: 0.32, core: 0.0 }, // 1 manifesto
  { shape: 1, x: 0.24, y: 0.0, scale: 1.0, opacity: 1.0, core: 0.0 }, // 2 R&D — double helix
  { shape: 2, x: 0.24, y: 0.0, scale: 1.0, opacity: 1.0, core: 0.0 }, // 3 software & AI — neural net
  { shape: 3, x: 0.24, y: -0.02, scale: 1.0, opacity: 1.0, core: 0.0 }, // 4 electrical & telecom — signal field
  { shape: 4, x: 0.24, y: 0.0, scale: 1.0, opacity: 1.0, core: 0.0 }, // 5 energy & industry — toroidal reactor
  { shape: 5, x: 0.24, y: 0.0, scale: 1.0, opacity: 1.0, core: 0.0 }, // 6 consulting — lattice
  { shape: 6, x: 0.0, y: 0.0, scale: 1.25, opacity: 0.42, core: 0.0 }, // 7 method / sectors / about — galaxy
  { shape: 7, x: 0.0, y: 0.0, scale: 1.2, opacity: 0.5, core: 0.0 }, // 8 contact — globe
];

// On narrow screens models sit above the copy (side-placed) or stay centered and dim (background)
function adaptKeyframe(kf, mobile) {
  if (!mobile) return kf;
  if (kf.x !== 0) return { ...kf, x: 0, y: 0.2, scale: kf.scale * 0.68, opacity: kf.opacity * 0.95 };
  return { ...kf, y: 0, scale: kf.scale * 0.8, opacity: kf.opacity * 0.75 };
}

/* ---------- Seeded random ---------- */
let seed = 1337;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function gauss() {
  return Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
}
function unitVector(out) {
  const z = rand() * 2 - 1;
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return out.set(r * Math.cos(a), z, r * Math.sin(a));
}

/* ---------- Procedural models ---------- */
const v = new Vector3();
const e = new Euler();

function finalize(arr, rx = 0, ry = 0, rz = 0) {
  e.set(rx, ry, rz);
  for (let i = 0; i < arr.length; i += 3) {
    v.set(arr[i], arr[i + 1], arr[i + 2]).applyEuler(e);
    arr[i] = v.x;
    arr[i + 1] = v.y;
    arr[i + 2] = v.z;
  }
  return arr;
}

// 0 — Atom: spherical electron cloud + two orbital rings
function atom(n) {
  const a = new Float32Array(n * 3);
  const tilts = [new Euler(1.15, 0.2, 0.35), new Euler(-0.9, 0.5, -0.6)];
  for (let i = 0; i < n; i++) {
    if (i < n * 0.74) {
      unitVector(v).multiplyScalar(2.45 + gauss() * 0.1);
    } else {
      const ang = rand() * Math.PI * 2;
      const R = 3.15 + gauss() * 0.025;
      v.set(Math.cos(ang) * R, gauss() * 0.02, Math.sin(ang) * R).applyEuler(tilts[i % 2]);
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return a;
}

// 1 — Double helix (research)
function helix(n) {
  const a = new Float32Array(n * 3);
  const H = 5.8, R = 1.05, turns = 2.3, rungs = 30;
  for (let i = 0; i < n; i++) {
    if (i < n * 0.6) {
      const t = rand();
      const ang = t * Math.PI * 2 * turns + (i % 2) * Math.PI;
      v.set(Math.cos(ang) * R + gauss() * 0.04, (t - 0.5) * H + gauss() * 0.04, Math.sin(ang) * R + gauss() * 0.04);
    } else {
      const j = Math.floor(rand() * rungs);
      const t = (j + 0.5) / rungs;
      const ang = t * Math.PI * 2 * turns;
      const s = rand() * 2 - 1;
      v.set(Math.cos(ang) * R * s, (t - 0.5) * H + gauss() * 0.012, Math.sin(ang) * R * s);
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 0.15, 0, -0.38);
}

// 2 — Neural network (software & AI)
function neural(n) {
  const a = new Float32Array(n * 3);
  const layers = [5, 9, 12, 9, 5];
  const nodes = layers.map((count, L) => {
    const x = -2.5 + L * 1.25;
    const rad = 0.55 + Math.sqrt(count / 12) * 1.25;
    return Array.from({ length: count }, (_, m) => {
      const r = rad * Math.sqrt((m + 0.5) / count);
      const th = m * 2.399963;
      return new Vector3(x, Math.cos(th) * r, Math.sin(th) * r);
    });
  });
  const edges = [];
  for (let L = 0; L < nodes.length - 1; L++) {
    for (const p of nodes[L]) {
      const near = nodes[L + 1]
        .map((q) => [q, Math.hypot(p.y - q.y, p.z - q.z)])
        .sort((s, t) => s[1] - t[1])
        .slice(0, 4);
      for (const [q] of near) edges.push([p, q]);
    }
  }
  const allNodes = nodes.flat();
  for (let i = 0; i < n; i++) {
    if (i < n * 0.36) {
      const p = allNodes[Math.floor(rand() * allNodes.length)];
      v.set(p.x + gauss() * 0.06, p.y + gauss() * 0.06, p.z + gauss() * 0.06);
    } else {
      const [p, q] = edges[Math.floor(rand() * edges.length)];
      v.copy(p).lerp(q, rand());
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 0.12, -0.5, 0.05);
}

// 3 — Signal field (electrical & telecom)
function waves(n) {
  const a = new Float32Array(n * 3);
  const S = 3.0;
  const f = (x, z) => {
    const r = Math.hypot(x, z);
    return 0.38 * Math.sin(x * 1.25 + z * 0.55) * Math.cos(z * 0.85) + 0.42 * Math.exp(-r * r * 0.35) * Math.cos(r * 4.2);
  };
  const linesX = 28, linesZ = 16;
  for (let i = 0; i < n; i++) {
    let x, z;
    if (i < n * 0.68) {
      z = -S + (2 * S * Math.floor(rand() * linesX)) / (linesX - 1);
      x = (rand() * 2 - 1) * S;
    } else {
      x = -S + (2 * S * Math.floor(rand() * linesZ)) / (linesZ - 1);
      z = (rand() * 2 - 1) * S;
    }
    v.set(x, f(x, z), z);
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 0.5, 0.55, 0);
}

// 4 — Toroidal reactor (energy & industry)
function torus(n) {
  const a = new Float32Array(n * 3);
  const R = 2.05, r = 0.64, lines = 22, q = 4;
  for (let i = 0; i < n; i++) {
    const u = rand() * Math.PI * 2;
    if (i < n * 0.8) {
      const l = Math.floor(rand() * lines);
      const w = u * q + (l / lines) * Math.PI * 2;
      v.set((R + r * Math.cos(w)) * Math.cos(u), r * Math.sin(w), (R + r * Math.cos(w)) * Math.sin(u));
    } else {
      const rr = R + gauss() * 0.11;
      v.set(rr * Math.cos(u), gauss() * 0.11, rr * Math.sin(u));
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 1.05, 0, 0.28);
}

// 5 — Structural lattice (consulting / architecture)
function lattice(n) {
  const a = new Float32Array(n * 3);
  const k = 4, s = 1.12, o = ((k - 1) * s) / 2;
  const P = (i, j, l) => new Vector3(i * s - o, j * s - o, l * s - o);
  const edges = [];
  const nodes = [];
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) for (let l = 0; l < k; l++) {
    nodes.push(P(i, j, l));
    if (i < k - 1) edges.push([P(i, j, l), P(i + 1, j, l)]);
    if (j < k - 1) edges.push([P(i, j, l), P(i, j + 1, l)]);
    if (l < k - 1) edges.push([P(i, j, l), P(i, j, l + 1)]);
  }
  for (let i = 0; i < n; i++) {
    if (i < n * 0.18) {
      const p = nodes[Math.floor(rand() * nodes.length)];
      v.set(p.x + gauss() * 0.045, p.y + gauss() * 0.045, p.z + gauss() * 0.045);
    } else {
      const [p, q] = edges[Math.floor(rand() * edges.length)];
      v.copy(p).lerp(q, rand());
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 0.62, 0.78, 0);
}

// 6 — Spiral galaxy (calm background for long-form sections)
function galaxy(n) {
  const a = new Float32Array(n * 3);
  const arms = 3, Rmax = 5.2;
  for (let i = 0; i < n; i++) {
    const r = Math.pow(rand(), 0.75) * Rmax + 0.15;
    const branch = ((i % arms) / arms) * Math.PI * 2;
    const spin = r * 0.95;
    const spread = 0.32 * r * Math.pow(rand(), 2.2);
    const ang = branch + spin;
    v.set(
      Math.cos(ang) * r + (rand() - 0.5) * spread,
      gauss() * 0.12 * (1 - r / (Rmax + 0.5)),
      Math.sin(ang) * r + (rand() - 0.5) * spread,
    );
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 1.0, 0, 0.22);
}

// 7 — Globe (contact — "from the Caribbean to the world")
function globe(n) {
  const a = new Float32Array(n * 3);
  const R = 2.35;
  const parallels = [-60, -40, -20, 0, 20, 40, 60];
  const meridians = 14;
  const sph = (lat, lon, rr = R) => v.set(Math.cos(lat) * Math.cos(lon) * rr, Math.sin(lat) * rr, Math.cos(lat) * Math.sin(lon) * rr);
  for (let i = 0; i < n; i++) {
    if (i < n * 0.5) {
      const lat = (parallels[Math.floor(rand() * parallels.length)] * Math.PI) / 180;
      sph(lat, rand() * Math.PI * 2);
    } else if (i < n * 0.82) {
      const lon = (Math.floor(rand() * meridians) / meridians) * Math.PI * 2;
      sph((rand() - 0.5) * Math.PI, lon);
    } else {
      unitVector(v).multiplyScalar(R + gauss() * 0.015);
    }
    a.set([v.x, v.y, v.z], i * 3);
  }
  return finalize(a, 0.18, 0, 0.41);
}

const SHAPES = [atom, helix, neural, waves, torus, lattice, galaxy, globe];

/* ---------- Shaders ---------- */
const vertexShader = /* glsl */ `
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute vec3 p5;
  attribute vec3 p6;
  attribute vec3 p7;
  attribute float aRand;
  attribute vec3 aDir;

  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBurst;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec3 vColor;
  varying float vAlpha;

  float is(float k, float target) { return 1.0 - step(0.5, abs(k - target)); }

  vec3 shapeAt(float k) {
    return position * is(k, 0.0) + p1 * is(k, 1.0) + p2 * is(k, 2.0) + p3 * is(k, 3.0)
         + p4 * is(k, 4.0) + p5 * is(k, 5.0) + p6 * is(k, 6.0) + p7 * is(k, 7.0);
  }

  void main() {
    float delay = aRand * 0.4;
    float t = smoothstep(delay, delay + 0.6, uMix);
    vec3 a = shapeAt(uFrom);
    vec3 b = shapeAt(uTo);
    vec3 pos = mix(a, b, t);

    // Burst outwards mid-transition between different models
    float moving = step(0.5, abs(uTo - uFrom));
    pos += aDir * sin(t * 3.14159265) * uBurst * moving;

    // Signal field ripples while active
    float waveW = is(uFrom, 3.0) * (1.0 - t) + is(uTo, 3.0) * t;
    pos.y += waveW * 0.12 * sin(uTime * 1.6 + pos.x * 1.8 + pos.z * 0.9);

    // Idle shimmer
    pos += aDir * sin(uTime * 0.9 + aRand * 6.2831) * 0.025;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float sparkle = step(0.94, aRand);
    gl_PointSize = uSize * (0.55 + aRand * 0.9 + sparkle * 0.9) * uPixelRatio / -mv.z;

    float h = smoothstep(-2.8, 2.8, pos.y + pos.x * 0.35 + (aRand - 0.5) * 1.2);
    vColor = mix(uColorA, uColorB, h);
    vColor = mix(vColor, vec3(1.0), sparkle * 0.7);

    float twinkle = 0.65 + 0.35 * sin(uTime * (1.2 + aRand * 2.0) + aRand * 40.0);
    vAlpha = twinkle * smoothstep(18.0, 6.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

/* ---------- Helpers ---------- */
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.2, 'rgba(255,255,255,0.45)');
  grd.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function signalReady() {
  root.classList.add('is-ready');
  document.dispatchEvent(new CustomEvent('scene:ready'));
}

/* ---------- Init ---------- */
function init() {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    root.classList.add('no-webgl');
    signalReady();
    return;
  }

  let mobile = window.innerWidth < 900;
  const maxDpr = mobile ? 1.5 : 1.75;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10);

  const glow = glowTexture();

  // Rig: positioned per keyframe. Spin: continuous rotation.
  const rig = new Group();
  const spin = new Group();
  rig.add(spin);
  scene.add(rig);

  /* Particles */
  const N = mobile ? 7000 : 15000;
  const geo = new BufferGeometry();
  SHAPES.forEach((fn, idx) => {
    geo.setAttribute(idx === 0 ? 'position' : `p${idx}`, new BufferAttribute(fn(N), 3));
  });
  const rnd = new Float32Array(N);
  const dir = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    rnd[i] = rand();
    unitVector(v).multiplyScalar(0.6 + rand() * 1.4);
    dir.set([v.x, v.y, v.z], i * 3);
  }
  geo.setAttribute('aRand', new BufferAttribute(rnd, 1));
  geo.setAttribute('aDir', new BufferAttribute(dir, 3));

  const uniforms = {
    uFrom: { value: 0 },
    uTo: { value: 0 },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: mobile ? 26 : 30 },
    uPixelRatio: { value: dpr },
    uBurst: { value: reduceMotion ? 0 : 1.1 },
    uOpacity: { value: 1 },
    uColorA: { value: ACCENT.clone() },
    uColorB: { value: ION.clone() },
  };
  const particles = new Points(
    geo,
    new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending }),
  );
  particles.frustumCulled = false;
  spin.add(particles);

  /* Xeniun core */
  const core = new Group();
  const crystal = new Mesh(
    new IcosahedronGeometry(0.95, 0),
    new MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 1,
      thickness: 1.4,
      ior: 1.6,
      iridescence: 1,
      iridescenceIOR: 1.35,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.6,
      attenuationColor: new Color('#9aa6ff'),
      attenuationDistance: 1.2,
      flatShading: true,
    }),
  );
  core.add(crystal);

  const edges = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(0.965, 0)),
    new LineBasicMaterial({ color: 0xc9d0ff, transparent: true, opacity: 0.45 }),
  );
  core.add(edges);

  const nucleus = new Mesh(new SphereGeometry(0.2, 32, 32), new MeshBasicMaterial({ color: 0xe8ecff }));
  core.add(nucleus);

  const halo = new Sprite(new SpriteMaterial({ map: glow, color: ACCENT, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(3.4);
  core.add(halo);

  const rings = [];
  const ringDefs = [
    { r: 1.45, rot: [1.2, 0.2, 0.3], speed: 0.9 },
    { r: 1.68, rot: [-0.7, 0.9, -0.2], speed: -0.65 },
    { r: 1.9, rot: [0.25, -0.4, 1.1], speed: 0.5 },
  ];
  ringDefs.forEach((d, i) => {
    const g = new Group();
    g.rotation.set(...d.rot);
    const ring = new Mesh(
      new TorusGeometry(d.r, 0.0045, 6, 220),
      new MeshBasicMaterial({ color: i === 1 ? ION : 0xdfe3ff, transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    const electron = new Sprite(new SpriteMaterial({ map: glow, color: i === 1 ? ION : 0xffffff, blending: AdditiveBlending, depthWrite: false, transparent: true }));
    electron.scale.setScalar(0.32);
    g.add(electron);
    core.add(g);
    rings.push({ group: g, electron, r: d.r, speed: d.speed, phase: i * 2.1 });
  });
  rig.add(core);

  /* Dust */
  const DUST = mobile ? 500 : 1200;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos.set([(rand() - 0.5) * 30, (rand() - 0.5) * 20, (rand() - 0.5) * 14 - 3], i * 3);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3));
  const dust = new Points(
    dustGeo,
    new PointsMaterial({ size: 0.05, map: glow, color: 0x9aa6ff, transparent: true, opacity: 0.45, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true }),
  );
  scene.add(dust);

  /* ---------- Scroll → keyframe mapping ---------- */
  let stops = [];
  let vh = window.innerHeight;

  function measure() {
    vh = window.innerHeight;
    const y0 = window.scrollY;
    stops = [];
    document.querySelectorAll('[data-scene]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const top = r.top + y0;
      const h = r.height;
      const k = Number(el.dataset.scene);
      const pad = Math.min(h * 0.3, vh * 0.35);
      stops.push({ y: top + pad, k }, { y: top + h - pad, k });
    });
    stops.sort((a, b) => a.y - b.y);
  }

  function targetK() {
    if (!stops.length) return 0;
    const m = window.scrollY + vh * 0.5;
    if (m <= stops[0].y) return stops[0].k;
    for (let i = 1; i < stops.length; i++) {
      if (m <= stops[i].y) {
        const a = stops[i - 1], b = stops[i];
        const t = (m - a.y) / Math.max(1, b.y - a.y);
        return lerp(a.k, b.k, t);
      }
    }
    return stops[stops.length - 1].k;
  }

  measure();
  let K = targetK();

  /* ---------- Pointer ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (ev) => {
      pointer.tx = (ev.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (ev.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* ---------- Resize ---------- */
  function resize() {
    mobile = window.innerWidth < 900;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    measure();
  }
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  });
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if ('ResizeObserver' in window) new ResizeObserver(() => measure()).observe(document.body);

  /* ---------- Loop ---------- */
  let last = performance.now();
  let time = 0;
  let frames = 0;
  let slowFrames = 0;
  let first = true;
  let running = true;

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      requestAnimationFrame(tick);
    }
  });

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += reduceMotion ? 0 : dt;

    // Adaptive quality: drop resolution if the first frames are slow
    if (frames < 120) {
      frames++;
      if (dt > 0.03) slowFrames++;
      if (frames === 120 && slowFrames > 50 && dpr > 1) {
        dpr = 1;
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        uniforms.uPixelRatio.value = dpr;
      }
    }

    // Smoothly follow the scroll position through the keyframes
    const tk = targetK();
    K = reduceMotion ? tk : K + (tk - K) * (1 - Math.exp(-dt * 3.2));
    const last_ = KEYFRAMES.length - 1;
    const i = clamp(Math.floor(K), 0, last_ - 1);
    const f = clamp(K - i, 0, 1);
    const a = adaptKeyframe(KEYFRAMES[i], mobile);
    const b = adaptKeyframe(KEYFRAMES[i + 1], mobile);
    const ef = easeInOut(f);

    uniforms.uFrom.value = a.shape;
    uniforms.uTo.value = b.shape;
    uniforms.uMix.value = f;
    uniforms.uTime.value = time;
    uniforms.uOpacity.value = lerp(a.opacity, b.opacity, ef);

    // Place the rig in screen-relative units
    const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const visW = visH * camera.aspect;
    rig.position.x = lerp(a.x, b.x, ef) * visW;
    rig.position.y = lerp(a.y, b.y, ef) * visH;
    const fit = Math.min(1, camera.aspect / 1.2) * (mobile ? 1.15 : 0.82);
    rig.scale.setScalar(lerp(a.scale, b.scale, ef) * Math.max(fit, 0.55));

    // Core
    const coreT = b.core > a.core ? clamp((f - 0.55) / 0.45, 0, 1) : clamp(f / 0.45, 0, 1);
    const coreS = lerp(a.core, b.core, easeInOut(coreT));
    core.visible = coreS > 0.01;
    core.scale.setScalar(Math.max(coreS, 0.0001));
    crystal.rotation.x += dt * 0.18;
    crystal.rotation.y += dt * 0.26;
    edges.rotation.copy(crystal.rotation);
    halo.material.opacity = 0.55 + 0.25 * Math.sin(time * 1.4);
    rings.forEach((r) => {
      const ang = time * r.speed + r.phase;
      r.electron.position.set(Math.cos(ang) * r.r, Math.sin(ang) * r.r, 0);
      r.group.rotation.z += dt * r.speed * 0.08;
    });

    // Rotation: gentle sway around each model's best view + scroll + pointer
    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2.5));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2.5));
    const sway = Math.sin(time * 0.16) * 0.42;
    spin.rotation.y = sway + Math.sin(K * Math.PI) * 0.7 + pointer.x * 0.3;
    spin.rotation.x = pointer.y * 0.12 + Math.sin(time * 0.11) * 0.05;

    camera.position.x = pointer.x * 0.35;
    camera.position.y = -pointer.y * 0.25;
    camera.lookAt(0, 0, 0);

    dust.rotation.y = time * 0.01 + K * 0.03;
    dust.position.y = (window.scrollY / Math.max(1, vh)) * 0.25;

    renderer.render(scene, camera);

    if (first) {
      first = false;
      signalReady();
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

try {
  init();
} catch (err) {
  console.error('[xeniun] scene failed', err);
  root.classList.add('no-webgl');
  signalReady();
}
