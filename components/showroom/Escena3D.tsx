'use client';

import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { escena, pose } from '@/lib/escena';

// Modelo 3D real: «iPhone 17 Pro» de Ranguel (sketchfab.com/Ranguel), licencia CC BY 4.0.
// Convertido de .usdz a .glb y optimizado (texturas WebP 1024px + geometría meshopt): 23,5 MB → 2,2 MB.
const MODELO = '/models/celular.glb';
useGLTF.preload(MODELO, false, true);

// Alto del celular en unidades de escena (con la cámara actual ocupa ~60% de la pantalla)
const H = 1.62;

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
      ctx.font = `700 118px ${display}`;
      ctx.fillText(hora.format(new Date()), c.width / 2, 330);
      ctx.font = `600 22px ${mono}`;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText('CLUBTECH', c.width / 2, c.height - 70);
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
  const { scene } = useGLTF(MODELO, false, true);
  const pantalla = usePantalla();
  const destino = useMemo(() => new THREE.Color('#C0C0C8'), []);
  const destinoClaro = useMemo(() => new THREE.Color('#C0C0C8'), []);
  const blanco = useMemo(() => new THREE.Color('#ffffff'), []);
  const nacimiento = useRef<number | null>(null);

  // Preparamos el modelo una sola vez: materiales propios, cuerpo a tintar, pantalla con la hora,
  // centrado y a escala, y girado para que la pantalla mire a cámara.
  const { modelo, tintes, vidrios, escala, centro, giro } = useMemo(() => {
    const m = scene.clone(true);
    const tintes: THREE.MeshStandardMaterial[] = [];
    const vidrios: THREE.MeshStandardMaterial[] = [];
    let zPantalla = 0;
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      mesh.material = mat;
      if (mat.name === 'Anodized_aluminum') {
        // aluminio anodizado: metálico satinado, del color de la variante
        mat.metalness = 0.62;
        mat.roughness = 0.3;
        mat.envMapIntensity = 1.3;
        // el relieve original, achicado, se ve como purpurina: lo dejamos muy sutil
        mat.normalScale.set(0.12, 0.12);
        tintes.push(mat);
      }
      if (mat.name === 'Frosted_glass') {
        // panel de vidrio esmerilado del dorso: mismo color, un tono más claro
        mat.roughness = 0.45;
        mat.metalness = 0.1;
        mat.normalScale.set(0.15, 0.15);
        vidrios.push(mat);
      }
      if (mat.name === 'OLED') {
        pantalla.flipY = false; // las texturas de glTF no van invertidas
        // la pantalla del modelo está modelada mirando hacia adentro: espejamos la imagen para que se lea bien
        pantalla.wrapS = THREE.RepeatWrapping;
        pantalla.repeat.x = -1;
        mat.map = pantalla;
        mat.emissiveMap = pantalla;
        mat.color.set('#ffffff');
        mat.emissive.set('#ffffff');
        mat.emissiveIntensity = 0.6;
        m.updateMatrixWorld(true);
        zPantalla = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3()).z;
      }
    });
    const caja = new THREE.Box3().setFromObject(m);
    const centro = caja.getCenter(new THREE.Vector3());
    const escala = H / caja.getSize(new THREE.Vector3()).y;
    // si la pantalla quedó del lado -z, lo damos vuelta para que de frente se vea la pantalla
    const giro = zPantalla < centro.z ? Math.PI : 0;
    return { modelo: m, tintes, vidrios, escala, centro, giro };
  }, [scene, pantalla]);

  useFrame((state, dt) => {
    const g = grupo.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (nacimiento.current === null) nacimiento.current = t;
    // entrada: el celular aparece girando y crece hasta su lugar (1.6s)
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
    tintes.forEach((m) => m.color.lerp(destino, kc));
    // el vidrio va un tono más claro, salvo en colores oscuros (ej. Deep Blue), donde en el real es casi igual al cuerpo
    const luz = 0.2126 * destino.r + 0.7152 * destino.g + 0.0722 * destino.b;
    destinoClaro.copy(destino).lerp(blanco, luz < 0.2 ? 0.04 : 0.3);
    vidrios.forEach((m) => m.color.lerp(destinoClaro, kc));
  });

  return (
    <group ref={grupo} scale={0.55}>
      <group rotation={[0, giro, 0]} scale={escala}>
        <primitive object={modelo} position={[-centro.x, -centro.y, -centro.z]} />
      </group>
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
      <pointLight position={[0, 0, -2]} intensity={3} color="#dfe5ee" distance={6} />
      <Suspense fallback={null}>
        <Celular mobile={mobile} />
      </Suspense>
      <Polvo cantidad={mobile ? 320 : 650} />
    </Canvas>
  );
}
