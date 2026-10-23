'use client';

import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { escena, pose } from '@/lib/escena';

// Medidas del celular (unidades de escena). Proporción de un 6.3".
const W = 0.78;
const H = 1.62;
const D = 0.085;
const R = 0.11;

function rectRedondeado(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 24);
  // ShapeGeometry usa las coordenadas como UV: las normalizamos a 0–1 para que la textura cubra justo la pantalla
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - x) / w, (uv.getY(i) - y) / h);
  uv.needsUpdate = true;
  return g;
}

// Pantalla de bloqueo dibujada en un canvas: hora real de Buenos Aires.
function usePantalla() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1064;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useEffect(() => {
    const c = tex.image as HTMLCanvasElement;
    const ctx = c.getContext('2d')!;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue('--font-display').trim() || 'sans-serif';
    const mono = css.getPropertyValue('--font-geist-mono').trim() || 'monospace';
    const hora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Argentina/Buenos_Aires' });
    const fecha = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Argentina/Buenos_Aires' });

    const dibujar = () => {
      const g = ctx.createLinearGradient(0, 0, 0, c.height);
      g.addColorStop(0, '#000208');
      g.addColorStop(0.55, '#001E52');
      g.addColorStop(1, '#0040F0');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      // un orbe de luz, como un wallpaper
      const o = ctx.createRadialGradient(330, 760, 10, 330, 760, 420);
      o.addColorStop(0, 'rgba(168,212,255,0.55)');
      o.addColorStop(1, 'rgba(168,212,255,0)');
      ctx.fillStyle = o;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.textAlign = 'center';
      ctx.font = `500 26px ${mono}`;
      ctx.fillText(fecha.format(new Date()), c.width / 2, 170);
      ctx.font = `800 168px ${display}`;
      ctx.fillText(hora.format(new Date()), c.width / 2, 330);
      ctx.font = `600 22px ${mono}`;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText('CLUBTECH · STORE', c.width / 2, c.height - 70);
      // la "isla" de la cámara frontal
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(c.width / 2 - 70, 34, 140, 40, 20);
      ctx.fill();
      tex.needsUpdate = true;
    };
    document.fonts.ready.then(dibujar);
    const id = setInterval(dibujar, 30_000);
    return () => clearInterval(id);
  }, [tex]);

  return tex;
}

function Celular({ mobile }: { mobile: boolean }) {
  const grupo = useRef<THREE.Group>(null);
  const marco = useRef<THREE.MeshPhysicalMaterial>(null);
  const dorso = useRef<THREE.MeshPhysicalMaterial>(null);
  const pantalla = usePantalla();
  const geoPantalla = useMemo(() => rectRedondeado(W - 0.035, H - 0.035, R - 0.02), []);
  const geoDorso = useMemo(() => rectRedondeado(W - 0.02, H - 0.02, R - 0.01), []);
  const destino = useMemo(() => new THREE.Color('#C0C0C8'), []);
  const nacimiento = useRef<number | null>(null);

  useFrame((state, dt) => {
    const g = grupo.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (nacimiento.current === null) nacimiento.current = t;
    // entrada: la pieza aparece girando y crece hasta su lugar (1.6s)
    const e = Math.min(1, (t - nacimiento.current) / 1.6);
    const entrada = 1 - Math.pow(1 - e, 3);

    const q = pose(escena.p, mobile);
    const k = 1 - Math.pow(0.0015, dt); // suavizado independiente del framerate
    g.position.x += (q.x - g.position.x) * k;
    g.position.y += (q.y + Math.sin(t * 0.8) * 0.035 - g.position.y) * k;
    const giroMouse = escena.mx * 0.22;
    const inclinMouse = -escena.my * 0.12;
    g.rotation.y += (q.rotY + giroMouse - (1 - entrada) * 2.4 - g.rotation.y) * k;
    g.rotation.x += (q.rotX + inclinMouse - g.rotation.x) * k;
    g.rotation.z = Math.sin(t * 0.5) * 0.02;
    const s = q.scale * (0.55 + 0.45 * entrada);
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);

    const c = escena.colores[escena.color];
    if (c) destino.set(c.hex);
    // cambio de color en ~0.5s, igual en una compu rápida que en un celular lento
    const kc = 1 - Math.pow(0.004, dt);
    marco.current?.color.lerp(destino, kc);
    dorso.current?.color.lerp(destino, kc);
    // un poco de luz propia del color, para que la luz azul de la escena no lo lave
    dorso.current?.emissive.lerp(destino, kc);
  });

  const lente = (x: number, y: number) => (
    <group position={[x, y, -D / 2 - 0.032]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.072, 0.03, 48]} />
        <meshPhysicalMaterial color="#9a9aa4" metalness={1} roughness={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <cylinderGeometry args={[0.052, 0.052, 0.012, 48]} />
        <meshPhysicalMaterial color="#05070d" metalness={0.2} roughness={0.05} clearcoat={1} clearcoatRoughness={0} iridescence={1} iridescenceIOR={1.6} />
      </mesh>
    </group>
  );

  return (
    <group ref={grupo} scale={0.55}>
      {/* cuerpo / marco de titanio */}
      <RoundedBox args={[W, H, D]} radius={R} smoothness={8}>
        <meshPhysicalMaterial ref={marco} color="#C0C0C8" metalness={1} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.2} envMapIntensity={1.4} />
      </RoundedBox>
      {/* pantalla */}
      <mesh geometry={geoPantalla} position={[0, 0, D / 2 + 0.0015]}>
        <meshPhysicalMaterial map={pantalla} emissiveMap={pantalla} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.08} clearcoat={1} />
      </mesh>
      {/* dorso de vidrio esmerilado */}
      <mesh geometry={geoDorso} position={[0, 0, -D / 2 - 0.0015]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial ref={dorso} color="#C0C0C8" emissive="#C0C0C8" emissiveIntensity={0.22} metalness={0.25} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />
      </mesh>
      {/* meseta de cámaras (en el dorso, arriba a la izquierda vista desde atrás) */}
      <RoundedBox args={[0.38, 0.38, 0.03]} radius={0.075} smoothness={6} position={[0.17, 0.56, -D / 2 - 0.014]}>
        <meshPhysicalMaterial color="#2a2a30" metalness={0.9} roughness={0.15} clearcoat={1} />
      </RoundedBox>
      {lente(0.1, 0.64)}
      {lente(0.1, 0.48)}
      {lente(0.25, 0.56)}
      <mesh position={[0.26, 0.69, -D / 2 - 0.031]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#fff6e0" emissive="#fff1cc" emissiveIntensity={0.4} />
      </mesh>
      {/* botones laterales */}
      <RoundedBox args={[0.012, 0.2, 0.03]} radius={0.005} position={[W / 2 + 0.004, 0.3, 0]}>
        <meshPhysicalMaterial color="#b8b8c0" metalness={1} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[0.012, 0.13, 0.03]} radius={0.005} position={[-W / 2 - 0.004, 0.38, 0]}>
        <meshPhysicalMaterial color="#b8b8c0" metalness={1} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[0.012, 0.13, 0.03]} radius={0.005} position={[-W / 2 - 0.004, 0.2, 0]}>
        <meshPhysicalMaterial color="#b8b8c0" metalness={1} roughness={0.25} />
      </RoundedBox>
    </group>
  );
}

// Polvo en el aire: deriva lento hacia arriba y se junta donde está el mouse.
function Polvo({ cantidad = 650 }: { cantidad?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const [pos, base, vel] = useMemo(() => {
    const p = new Float32Array(cantidad * 3);
    const b = new Float32Array(cantidad * 3);
    const v = new Float32Array(cantidad);
    for (let i = 0; i < cantidad; i++) {
      b[i * 3] = (Math.random() - 0.5) * 7;
      b[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      b[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.6;
      v[i] = 0.02 + Math.random() * 0.06;
    }
    p.set(b);
    return [p, b, v];
  }, [cantidad]);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const mx = (escena.mx * viewport.width) / 2;
    const my = (escena.my * viewport.height) / 2;
    for (let i = 0; i < cantidad; i++) {
      const ix = i * 3;
      base[ix + 1] += vel[i] * dt;
      if (base[ix + 1] > 2.3) base[ix + 1] = -2.3;
      // atracción suave al cursor (solo las partículas cercanas)
      const dx = mx - base[ix];
      const dy = my - base[ix + 1];
      const d2 = dx * dx + dy * dy;
      const f = d2 < 1.4 ? (1 - d2 / 1.4) * 0.35 : 0;
      arr[ix] += (base[ix] + dx * f - arr[ix]) * 0.08;
      arr[ix + 1] += (base[ix + 1] + dy * f - arr[ix + 1]) * 0.08;
      arr[ix + 2] = base[ix + 2];
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#A8D4FF" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function Escena3D({ mobile, activa }: { mobile: boolean; activa: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      style={{ pointerEvents: 'none' }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={activa ? 'always' : 'never'}
    >
      {/* estudio de fotografía armado con luces: no se descarga ningún HDR */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 3, 2]} scale={[6, 1.2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={4} color="#1E7FFF" position={[-4, 0, 0]} scale={[0.6, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.5} color="#A8D4FF" position={[4, 0.5, -1]} scale={[0.5, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2} color="#0040F0" position={[0, 0, -5]} scale={4} />
      </Environment>
      <ambientLight intensity={0.15} />
      <directionalLight position={[-3, 2, 4]} intensity={1.2} color="#dfe9ff" />
      <pointLight position={[0, 0, -2]} intensity={6} color="#1E7FFF" distance={6} />
      <Celular mobile={mobile} />
      <Polvo cantidad={mobile ? 320 : 650} />
    </Canvas>
  );
}
