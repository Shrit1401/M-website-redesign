"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const BRAND_LIGHT = "#35a8e6";
const BACKDROP_Z = -3;

// Window-level pointer (-1..1) so the hero copy layered above the canvas doesn't block parallax.
const pointer = { x: 0, y: 0 };

// Final resting layout of the four slabs (local to the group), echoing the dark design's staggered stack.
const SLABS = [
  { pos: [-1.5, -0.2, 1.2], tint: "#ffffff" },
  { pos: [-0.5, 0.0, 0.4], tint: "#d6eefb" },
  { pos: [0.5, 0.2, -0.4], tint: "#ffffff" },
  { pos: [1.5, 0.4, -1.2], tint: "#f1f8fd" },
] as const;

/**
 * Paints the hero background (page gradient, grid, blue light streaks, ring) into one opaque,
 * full-resolution texture. Because it is opaque and sharp, the glass refracts real detail —
 * grid lines bending and light splitting at the bevels — instead of a blurry blob.
 */
function paintBackdrop(w: number, h: number, fx: number, fy: number, unit: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = fx * w;
  const cy = fy * h;
  // Size decorations off the shorter side so tall phone screens don't get an oversized ring.
  const m = Math.min(h, w * 1.1);

  // Base: same white → page-bg fade as the rest of the site.
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#ffffff");
  base.addColorStop(1, "#f5f8fc");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Soft atmosphere behind the stack.
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.42);
  glow.addColorStop(0, "rgba(53,168,230,0.30)");
  glow.addColorStop(0.45, "rgba(0,119,181,0.08)");
  glow.addColorStop(1, "rgba(0,119,181,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Grid, faded out towards the edges — the lines are what make refraction legible.
  const grid = document.createElement("canvas");
  grid.width = w;
  grid.height = h;
  const g = grid.getContext("2d")!;
  const step = 72 * unit;
  g.strokeStyle = "rgba(10,22,34,0.09)";
  g.lineWidth = Math.max(1, unit);
  g.beginPath();
  for (let x = (cx % step) + 0.5; x < w; x += step) {
    g.moveTo(x, 0);
    g.lineTo(x, h);
  }
  for (let y = (cy % step) + 0.5; y < h; y += step) {
    g.moveTo(0, y);
    g.lineTo(w, y);
  }
  g.stroke();
  g.globalCompositeOperation = "destination-in";
  const mask = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
  mask.addColorStop(0, "rgba(0,0,0,1)");
  mask.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = mask;
  g.fillRect(0, 0, w, h);
  ctx.drawImage(grid, 0, 0);

  // Thin ring + nodes ("connected systems").
  const r = m * 0.2;
  ctx.strokeStyle = "rgba(0,119,181,0.55)";
  ctx.lineWidth = 1.5 * unit;
  ctx.beginPath();
  ctx.arc(cx + r * 0.25, cy - r * 0.1, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0077b5";
  for (const a of [-0.6, 1.9, 3.6]) {
    ctx.beginPath();
    ctx.arc(cx + r * 0.25 + Math.cos(a) * r, cy - r * 0.1 + Math.sin(a) * r, 4 * unit, 0, Math.PI * 2);
    ctx.fill();
  }

  // Light streaks: blue beams with a white-hot core, fading at both ends.
  // Fade each beam to a transparent version of its own colour — fading to transparent black greys it out.
  const beam = (x: number, width: number, [r, g, b, a]: number[], len: number) => {
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(0.12);
    const lg = ctx.createLinearGradient(0, -len / 2, 0, len / 2);
    lg.addColorStop(0, `rgba(${r},${g},${b},0)`);
    lg.addColorStop(0.5, `rgba(${r},${g},${b},${a})`);
    lg.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.shadowColor = "rgba(53,168,230,0.9)";
    ctx.shadowBlur = 24 * unit;
    ctx.fillStyle = lg;
    ctx.fillRect(-width / 2, -len / 2, width, len);
    ctx.restore();
  };
  beam(cx - m * 0.2, 5 * unit, [53, 168, 230, 1], m * 0.55);
  beam(cx + m * 0.02, 14 * unit, [0, 119, 181, 0.95], m * 0.7);
  beam(cx + m * 0.02, 3 * unit, [255, 255, 255, 1], m * 0.6);
  beam(cx + m * 0.24, 4 * unit, [53, 168, 230, 0.9], m * 0.45);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Backdrop({ fx, fy }: { fx: number; fy: number }) {
  const { size, camera, viewport } = useThree();
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, BACKDROP_Z));
  const unit = Math.min(viewport.dpr, 2);
  const texture = useMemo(
    () => paintBackdrop(Math.round(size.width * unit), Math.round(size.height * unit), fx, fy, unit),
    [size.width, size.height, unit, fx, fy],
  );
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 0, BACKDROP_Z]}>
      <planeGeometry args={[vp.width, vp.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Slab({ index, scroll }: { index: number; scroll: React.RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const { pos, tint } = SLABS[index];
  const start = 0.2 + index * 0.1;

  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    // Intro: slabs deal in from the right and settle; scroll then fans the stack out.
    const intro = THREE.MathUtils.smootherstep(t, start, start + 1.6);
    const s = scroll.current ?? 0;
    g.position.x = THREE.MathUtils.damp(g.position.x, pos[0] * (1 + s * 0.8) + (1 - intro) * 3, 8, delta);
    g.position.y = pos[1] + Math.sin(t * 0.7 + index * 1.3) * 0.05 - s * index * 0.12;
    g.position.z = pos[2];
    g.rotation.y = (1 - intro) * -0.9 + s * (index - 1.5) * 0.16;
    g.rotation.z = Math.sin(t * 0.5 + index) * 0.008;
  });

  return (
    <group ref={ref} position={[pos[0] + 3, pos[1], pos[2]]}>
      <RoundedBox args={[1.8, 2.6, 0.22]} radius={0.07} smoothness={8} bevelSegments={8} creaseAngle={0.6}>
        <MeshTransmissionMaterial
          transmissionSampler
          samples={10}
          thickness={0.35}
          roughness={0}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropicBlur={0.05}
          distortion={0}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={0.7}
          attenuationDistance={1.8}
          attenuationColor="#d8eef9"
          color={tint}
        />
      </RoundedBox>
      {index === 1 && (
        // The lit edge from the dark design, embedded inside the glass so the bevel refracts it.
        <mesh position={[0.86, 0, 0]}>
          <boxGeometry args={[0.022, 2.44, 0.06]} />
          <meshBasicMaterial color={BRAND_LIGHT} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ scroll }: { scroll: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const wide = size.width >= 1024;
  // Desktop: stack on the right; mobile: centred under the copy. Backdrop focus follows it.
  const fx = wide ? 0.74 : 0.5;
  const fy = wide ? 0.52 : 0.8;
  const baseX = (fx - 0.5) * viewport.width;
  const baseY = -(fy - 0.5) * viewport.height;
  const scale = wide ? Math.min(0.78, viewport.width / 13) : Math.min(0.5, viewport.width / 9);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = scroll.current ?? 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.55 + pointer.x * 0.14, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.05 - pointer.y * 0.06, 2.5, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + s * 1.2, 5, delta);
  });

  return (
    <>
      <Backdrop fx={fx} fy={fy} />
      <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
        {SLABS.map((_, i) => (
          <Slab key={i} index={i} scroll={scroll} />
        ))}
      </group>
    </>
  );
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [visible, setVisible] = useState(true);

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
      {/* `flat` disables tone mapping: filmic curves turn white glass grey on a light page. */}
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 8.5], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene scroll={scroll} />
        {/* Local lightformers only — no HDR download. Hard-edged strips give the bevels crisp highlights. */}
        <Environment resolution={512}>
          <color attach="background" args={["#eef4f9"]} />
          <Lightformer form="rect" intensity={3} position={[0, 6, -1]} rotation-x={Math.PI / 2} scale={[12, 1.2, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[-6, 0, 0]} rotation-y={Math.PI / 2} scale={[0.5, 10, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[6, 0, -1]} rotation-y={-Math.PI / 2} scale={[0.6, 10, 1]} />
          <Lightformer form="rect" intensity={1.5} color={BRAND_LIGHT} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1} position={[0, 0, -6]} scale={[4, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
