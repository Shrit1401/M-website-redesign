"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Window-level pointer (-1..1) so the hero copy layered above the canvas doesn't block parallax.
const pointer = { x: 0, y: 0 };

// Custom shaders write colours straight to the screen, so feed them sRGB values as-is.
const srgb = (hex: string) => new THREE.Color(hex).convertLinearToSRGB();

const CORE = srgb("#ffe6f8");
const INNER = srgb("#f06ac8");
const OUTER = srgb("#6b3cf0");
const STAR = srgb("#8fd8ff");

/** Small seeded PRNG so the galaxy has the same shape on every render and every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------- galaxy */

const galaxyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    // Differential rotation: inner stars orbit faster, which slowly winds the spiral arms.
    vec3 p = position;
    float d = length(p.xz);
    float a = atan(p.x, p.z) + uTime * 0.18 / (d + 0.6);
    p.x = sin(a) * d;
    p.z = cos(a) * d;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale / -mv.z;
    vColor = aColor;
  }
`;

const galaxyFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.6);
    gl_FragColor = vec4(vColor, glow);
  }
`;

function buildGalaxy(count: number) {
  const radius = 5;
  const branches = 3;
  const spin = 1.15;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const c = new THREE.Color();
  const random = rng(7);

  for (let i = 0; i < count; i++) {
    const r = Math.pow(random(), 1.5) * radius;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const angle = branch + r * spin;
    // Scatter falls off away from the arm's spine; flatter vertically than horizontally.
    const scatter = (axis: number) =>
      Math.pow(random(), 3) * (random() < 0.5 ? 1 : -1) * (0.3 + r * 0.22) * axis;

    positions[i * 3] = Math.cos(angle) * r + scatter(1);
    positions[i * 3 + 1] = scatter(0.35);
    positions[i * 3 + 2] = Math.sin(angle) * r + scatter(1);

    const t = r / radius;
    if (random() < 0.05) c.copy(STAR);
    else if (t < 0.18) c.copy(CORE).lerp(INNER, t / 0.18);
    else c.copy(INNER).lerp(OUTER, Math.min(1, (t - 0.18) / 0.55));
    colors.set([c.r, c.g, c.b], i * 3);

    scales[i] = random() < 0.02 ? 2.6 + random() * 2 : 0.6 + random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  return geo;
}

function Galaxy({ count, size }: { count: number; size: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => buildGalaxy(count), [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: size } }), [size]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={galaxyVertex}
        fragmentShader={galaxyFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------- glow + orbits */

function glowTexture() {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.15, "rgba(255,214,245,0.75)");
  g.addColorStop(0.4, "rgba(200,110,240,0.25)");
  g.addColorStop(1, "rgba(120,60,240,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Elliptical orbit + a satellite riding it — the two rings and the dot from the Nebula mark. */
function Orbit({
  rx,
  rz,
  tilt,
  speed,
  phase,
  glow,
}: {
  rx: number;
  rz: number;
  tilt: [number, number, number];
  speed: number;
  phase: number;
  glow: THREE.Texture;
}) {
  const sat = useRef<THREE.Sprite>(null);
  const line = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, rx, rz, 0, Math.PI * 2).getPoints(256);
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0, p.y)));
    const mat = new THREE.LineBasicMaterial({
      color: srgb("#c9b0ff"),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.LineLoop(geo, mat);
  }, [rx, rz]);
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    },
    [line],
  );

  useFrame(({ clock }) => {
    const a = phase + clock.elapsedTime * speed;
    sat.current?.position.set(Math.cos(a) * rx, 0, Math.sin(a) * rz);
  });

  return (
    <group rotation={tilt}>
      <primitive object={line} />
      <sprite ref={sat} scale={0.55}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </sprite>
    </group>
  );
}

/* -------------------------------------------------------------- stars */

function Stars({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const random = rng(42);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniform direction on a sphere, pushed out to a shell behind the galaxy.
      const z = random() * 2 - 1;
      const a = random() * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      const d = 18 + random() * 22;
      pos.set([Math.cos(a) * r * d, Math.sin(a) * r * d, z * d], i * 3);
    }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pos, 3));
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.09} color="#ddd3ff" transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  );
}

/* -------------------------------------------------------------- scene */

function Scene({ scroll }: { scroll: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const wide = size.width >= 1024;
  const glow = useMemo(() => glowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);

  // Desktop: galaxy sits right of the copy. Mobile: centred in the lower part of the hero.
  const baseX = wide ? viewport.width * 0.2 : 0;
  const baseY = wide ? 0 : -viewport.height * 0.2;
  const scale = wide ? Math.min(1, viewport.width / 15) : Math.min(0.62, viewport.width / 9);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = scroll.current ?? 0;
    // Scrolling tips the disc toward the viewer and lifts it away with the hero.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.95 - s * 0.55 - pointer.y * 0.08, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0.32 + pointer.x * 0.08, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX + pointer.x * 0.25, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + s * 2.5, 5, delta);
    g.rotation.y += delta * 0.03;
  });

  return (
    <>
      <Stars count={wide ? 1400 : 700} />
      <group ref={group} position={[baseX, baseY, 0]} rotation={[0.95, 0, 0.32]} scale={scale}>
        <Galaxy count={wide ? 42000 : 18000} size={wide ? 36 * Math.min(viewport.dpr, 2) : 30 * Math.min(viewport.dpr, 2)} />
        <sprite scale={4.2}>
          <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.9} />
        </sprite>
        <Orbit rx={6.4} rz={3.6} tilt={[0.22, 0, -0.12]} speed={0.22} phase={0.6} glow={glow} />
        <Orbit rx={3.4} rz={1.9} tilt={[-0.18, 0.4, 0.1]} speed={-0.35} phase={2.4} glow={glow} />
      </group>
    </>
  );
}

export default function NebulaScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / window.innerHeight);
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        camera={{ position: [0, 0, 12], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene scroll={scroll} />
      </Canvas>
    </div>
  );
}
