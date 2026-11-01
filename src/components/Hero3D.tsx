import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { material, polish, tileField } from '../lib/textures';

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

function tex(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  return t;
}

/** The polished Calacatta slab — the hero's centrepiece. */
function Slab() {
  const group = useRef<THREE.Group>(null!);
  const map = useMemo(() => tex(polish(material('calacatta', mobile ? 512 : 1024, 11), 0.4)), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = Math.min(1, window.scrollY / window.innerHeight);
    if (!reduced) {
      group.current.rotation.y = t * 0.16 + s * 1.2;
      group.current.position.y = 1.75 + Math.sin(t * 0.6) * 0.06 - s * 0.6;
    }
    group.current.rotation.z = -0.06 + s * 0.15;
  });
  return (
    <group ref={group} position={[mobile ? 0 : 1.5, 1.75, 0]} rotation={[0.08, 0.6, -0.06]}>
      <RoundedBox args={[2.1, 3.1, 0.14]} radius={0.02} smoothness={4}>
        <meshPhysicalMaterial map={map} roughness={0.12} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={1.2} />
      </RoundedBox>
      {/* champagne-gold frame line */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[2.16, 3.16, 0.012]} />
        <meshStandardMaterial color="#B69A68" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Book-matched stone wall panels with recessed gold reveals. */
function Wall() {
  const trav = useMemo(() => tex(material('travertine', 512, 4)), []);
  const nero = useMemo(() => tex(material('nero', 512, 9)), []);
  const panels = [-6, -3.6, -1.2, 1.2, 3.6, 6];
  return (
    <group position={[0, 0, -4.5]}>
      {panels.map((x, i) => (
        <mesh key={x} position={[x, 3, 0]}>
          <boxGeometry args={[2.36, 6, 0.2]} />
          <meshStandardMaterial map={i === 2 || i === 3 ? nero : trav} roughness={i === 2 || i === 3 ? 0.2 : 0.7} color={i === 2 || i === 3 ? '#fff' : '#9d9488'} />
        </mesh>
      ))}
      {[-4.8, -2.4, 0, 2.4, 4.8].map((x) => (
        <mesh key={x} position={[x, 3, 0.12]}>
          <boxGeometry args={[0.025, 6, 0.02]} />
          <meshStandardMaterial color="#B69A68" emissive="#B69A68" emissiveIntensity={0.35} metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* gold horizontal reveal */}
      <mesh position={[0, 0.5, 0.12]}>
        <boxGeometry args={[15, 0.02, 0.02]} />
        <meshStandardMaterial color="#B69A68" emissive="#B69A68" emissiveIntensity={0.4} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Floor() {
  const map = useMemo(() => tex(tileField('calacatta', 1024, 1024, 2, '#bdb3a2', 3, 2), 6), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      {mobile ? (
        <meshStandardMaterial map={map} roughness={0.25} metalness={0.1} color="#9a9488" />
      ) : (
        <MeshReflectorMaterial
          map={map} color="#8d877c" blur={[320, 90]} resolution={768} mixBlur={1} mixStrength={6}
          roughness={0.9} depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.4} metalness={0.2} mirror={0.7}
        />
      )}
    </mesh>
  );
}

/** Floating stone dust catching the light. */
function Dust({ count = mobile ? 260 : 700 }) {
  const ref = useRef<THREE.Points>(null!);
  const [positions, speeds] = useMemo(() => {
    const p = new Float32Array(count * 3), s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14; p[i * 3 + 1] = Math.random() * 6; p[i * 3 + 2] = (Math.random() - 0.5) * 9;
      s[i] = 0.02 + Math.random() * 0.06;
    }
    return [p, s];
  }, [count]);
  useFrame((_, dt) => {
    if (reduced) return;
    const a = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + speeds[i] * dt;
      if (y > 6) y = 0;
      a.setY(i, y);
      a.setX(i, a.getX(i) + Math.sin(y * 2 + i) * 0.0015);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#e8d7b4" transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/** Mouse-driven camera drift + scroll dolly. */
function Rig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 1.6, 0), []);
  useFrame(() => {
    const s = Math.min(1, window.scrollY / window.innerHeight);
    const k = reduced ? 0 : 1;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.9 * k, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.9 + pointer.y * 0.35 * k + s * 0.8, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.4 + s * 1.6, 0.05);
    camera.lookAt(target);
  });
  return null;
}

/** Moving light card: sweeps a soft reflection across the polished surfaces. */
function SweepingLight() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!reduced) ref.current.position.x = Math.sin(clock.getElapsedTime() * 0.25) * 6;
  });
  return <Lightformer ref={ref as any} form="rect" intensity={3} color="#fff1d6" scale={[2, 8, 1]} position={[0, 3, 5]} />;
}

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, mobile ? 1.5 : 1.8]}
        camera={{ position: [0, 1.9, 7.4], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <color attach="background" args={['#0c0b0a']} />
        <fog attach="fog" args={['#0c0b0a', 7, 20]} />
        <ambientLight intensity={0.25} />
        <spotLight position={[2.5, 7, 3]} angle={0.45} penumbra={0.9} intensity={60} color="#ffe2b8" distance={18} />
        <spotLight position={[-4, 6, -1]} angle={0.5} penumbra={1} intensity={30} color="#ffd9a0" distance={14} />
        <pointLight position={[0, 0.4, -3.8]} intensity={4} color="#B69A68" distance={6} />
        <Wall />
        <Floor />
        <Slab />
        <Dust />
        <Rig />
        <Environment resolution={256} frames={reduced || mobile ? 1 : Infinity}>
          <Lightformer form="rect" intensity={1.5} color="#f6e7c9" scale={[10, 2, 1]} position={[0, 6, -2]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={0.8} color="#B69A68" scale={[4, 6, 1]} position={[-6, 2, 0]} rotation-y={Math.PI / 2} />
          <SweepingLight />
        </Environment>
      </Canvas>
    </div>
  );
}
