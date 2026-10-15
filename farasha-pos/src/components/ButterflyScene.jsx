import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Seeded PRNG so the butterfly is identical every visit.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Temple Fay's butterfly curve: r = e^sin t − 2cos 4t + sin^5((2t − π)/24)
function butterflyRadius(t) {
  return Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((2 * t - Math.PI) / 24), 5);
}

function buildGeometry(count) {
  const rand = mulberry32(1405);
  const pos = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const kind = new Float32Array(count); // 0 wing, 1 body, 2 dust

  const bodyCount = Math.floor(count * 0.05);
  const dustCount = Math.floor(count * 0.07);
  const wingCount = count - bodyCount - dustCount;

  let i = 0;
  const push = (x, y, z, k) => {
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    scatter[i * 3] = Math.sin(ph) * Math.cos(th);
    scatter[i * 3 + 1] = Math.sin(ph) * Math.sin(th) + 0.35;
    scatter[i * 3 + 2] = Math.cos(ph);
    seed[i] = rand();
    kind[i] = k;
    i++;
  };

  const S = 0.44;
  for (let n = 0; n < wingCount; n++) {
    const t = rand() * Math.PI * 12;
    const r = butterflyRadius(t);
    // Dense outline, softer fill.
    const edge = rand() < 0.42;
    const f = edge ? 0.94 + rand() * 0.06 : Math.pow(rand(), 0.42);
    let x = Math.sin(t) * r * f;
    let y = Math.cos(t) * r * f;
    if (Math.abs(x) < 0.04) x += Math.sign(x || 1) * 0.06;
    push(x * S, (y - 0.9) * S, (rand() - 0.5) * 0.04, 0);
  }
  for (let n = 0; n < bodyCount; n++) {
    const a = rand();
    if (a < 0.7) {
      // Thorax + abdomen
      const y = -1.7 + rand() * 2.6;
      const w = 0.07 * Math.sin(((y + 1.7) / 2.6) * Math.PI) + 0.015;
      push((rand() - 0.5) * w * 2 * S, y * S * 0.9, (rand() - 0.5) * w * S, 1);
    } else {
      // Antennae
      const side = rand() < 0.5 ? -1 : 1;
      const u = rand();
      const x = side * (0.05 + u * 0.75 + Math.pow(u, 3) * 0.2);
      const y = 1.0 + u * 1.25 - Math.pow(u, 4) * 0.25;
      push(x * S, y * S * 0.9, 0, 1);
    }
  }
  for (let n = 0; n < dustCount; n++) {
    push((rand() - 0.5) * 9, (rand() - 0.5) * 6, (rand() - 0.5) * 4, 2);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  g.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
  return g;
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uPixelRatio;
  uniform float uFlap;
  uniform float uReveal;
  attribute vec3 aScatter;
  attribute float aSeed;
  attribute float aKind;
  varying float vSeed;
  varying float vKind;
  varying float vDist;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    vSeed = aSeed;
    vKind = aKind;
    vDist = length(p.xy);

    if (aKind < 1.5) {
      // Wing flap: fold each wing around the body axis. Hind wings lag a touch.
      float lag = (p.y < -0.3 ? 0.35 : 0.0);
      float beat = sin(uTime * 2.1 - lag) * 0.5 + 0.5;
      float a = (0.12 + beat * 0.95) * uFlap * (aKind < 0.5 ? 1.0 : 0.0);
      float ax = abs(p.x);
      p.z += ax * sin(a);
      p.x = sign(p.x) * ax * cos(a);
      // Breathing shimmer
      p += aScatter * 0.012 * sin(uTime * 1.5 + aSeed * 40.0);
    } else {
      p.y += sin(uTime * 0.25 + aSeed * 20.0) * 0.25;
      p.x += cos(uTime * 0.2 + aSeed * 30.0) * 0.25;
    }

    // Intro: particles fly in from a cloud.
    float intro = 1.0 - smoothstep(0.0, 1.0, clamp(uReveal * 1.4 - aSeed * 0.4, 0.0, 1.0));
    // Scroll: dissolve into drifting dust.
    float s = uScatter * (1.6 + aSeed * 3.4) + intro * (3.0 + aSeed * 4.0);
    p += aScatter * s;
    float swirl = (uScatter + intro) * (1.0 + aSeed);
    p.xz = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * p.xz;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aKind > 1.5 ? 1.4 : (aKind > 0.5 ? 1.6 : 1.1 + aSeed * 2.0);
    gl_PointSize = size * uPixelRatio * (11.0 / -mv.z);
    vAlpha = (1.0 - uScatter * 0.75) * (1.0 - intro * 0.9);
  }
`;

const fragment = /* glsl */ `
  varying float vSeed;
  varying float vKind;
  varying float vDist;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    a *= a;
    vec3 deep = vec3(0.016, 0.6, 0.32);   // #049952
    vec3 mint = vec3(0.34, 0.88, 0.59);   // #57e197
    vec3 cream = vec3(0.96, 0.95, 0.88);
    vec3 gold = vec3(0.92, 0.82, 0.52);
    vec3 col = mix(deep, mint, smoothstep(0.2, 2.2, vDist));
    col = mix(col, cream, smoothstep(0.86, 1.0, vSeed) * 0.85);
    if (vSeed > 0.975) col = gold;
    if (vKind > 0.5 && vKind < 1.5) col = mix(cream, mint, 0.3);
    float alpha = a * vAlpha * (vKind > 1.5 ? 0.35 : 0.9);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function Butterfly({ progress, reduced }) {
  const group = useRef(null);
  const geometry = useMemo(() => buildGeometry(window.innerWidth < 700 ? 12000 : 22000), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScatter: { value: 0 },
      uFlap: { value: reduced ? 0.35 : 1 },
      uReveal: { value: reduced ? 1 : 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    [reduced],
  );
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const mat = useRef(null);
  useFrame((state, delta) => {
    // r3f copies the uniforms prop, so drive the material's own object.
    const u = mat.current?.uniforms;
    if (!u) return;
    if (!reduced) {
      u.uTime.value += Math.min(delta, 0.05);
      u.uReveal.value = Math.min(1, u.uReveal.value + delta * 0.38);
    }
    u.uScatter.value += (progress.current - u.uScatter.value) * 0.08;
    const g = group.current;
    if (!g) return;
    const t = u.uTime.value;
    const tx = -0.32 + pointer.current.y * 0.18 + Math.sin(t * 0.4) * 0.04;
    const ty = pointer.current.x * 0.35 + Math.sin(t * 0.23) * 0.12;
    g.rotation.x += (tx - g.rotation.x) * 0.04;
    g.rotation.y += (ty - g.rotation.y) * 0.04;
    g.position.y = 0.35 + Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={group} rotation={[-0.32, 0, 0]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** progress: ref with a 0..1 number (scroll-driven dissolve). */
export default function ButterflyScene({ progress, active = true, fallback = null }) {
  const [ok] = useState(canUseWebGL);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (!ok) return fallback;
  return (
    <Canvas
      className="butterfly-canvas"
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Butterfly progress={progress} reduced={reduced} />
    </Canvas>
  );
}
