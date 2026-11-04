import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AdaptiveDpr,
  ContactShadows,
  Float,
  Preload,
  RoundedBox,
  Sparkles,
  useTexture,
} from '@react-three/drei'
import * as THREE from 'three'
import { HERO_COVER } from '../../lib/data'

const ORANGE = '#FF6B27'
const GOLD = '#FFB15C'
const CREAM = '#EFE4D2'

function drawSpacedText(ctx, text, x, y, spacing) {
  let cursor = x
  for (const char of text) {
    ctx.fillText(char, cursor, y)
    cursor += ctx.measureText(char).width + spacing
  }
}

function makePageTexture(pageNumber = 1, chapterLabel = 'CHAPTER ONE', titleLineOne = "The Mapmaker's", titleLineTwo = 'Window') {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1400
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, 1024, 0)
  bg.addColorStop(0, '#d7cbb9')
  bg.addColorStop(0.06, '#f1e8d8')
  bg.addColorStop(0.5, '#f8f1e4')
  bg.addColorStop(1, '#e7dccb')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 1024, 1400)

  ctx.fillStyle = 'rgba(73,55,39,0.5)'
  ctx.font = '400 17px monospace'
  ctx.fillText(`THE SILENT MERIDIAN`, 110, 112)
  ctx.fillText(String(pageNumber), 890, 112)

  ctx.fillStyle = 'rgba(54,40,28,0.4)'
  ctx.font = '400 15px monospace'
  drawSpacedText(ctx, chapterLabel, 110, 196, 2)

  ctx.fillStyle = 'rgba(33,24,18,0.84)'
  ctx.font = '600 52px Georgia, serif'
  ctx.fillText(titleLineOne, 110, 286)
  ctx.fillText(titleLineTwo, 110, 348)

  ctx.fillStyle = 'rgba(255,255,255,0.32)'
  ctx.fillRect(110, 398, 804, 1)

  ctx.font = '400 24px Georgia, serif'
  ctx.fillStyle = 'rgba(48,37,27,0.62)'
  let y = 468
  for (let line = 0; line < 26; line += 1) {
    if (line === 8 || line === 19) {
      ctx.fillStyle = 'rgba(48,37,27,0.24)'
      ctx.font = 'italic 29px Georgia, serif'
      ctx.fillText(line === 8 ? 'Somewhere beyond the northern line,' : 'there is a place that remembers every voice.', 150, y)
      ctx.fillStyle = 'rgba(48,37,27,0.62)'
      ctx.font = '400 24px Georgia, serif'
      y += 54
    }
    const width = 780 - ((line * 47) % 170)
    ctx.fillStyle = 'rgba(48,37,27,0.3)'
    ctx.fillRect(110, y, width, 1.5)
    y += 38
  }

  ctx.fillStyle = 'rgba(120,84,46,0.38)'
  ctx.font = '400 14px monospace'
  ctx.fillText(String(pageNumber), 512, 1322)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function makeEdgeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#d9cebd'
  ctx.fillRect(0, 0, 128, 1024)
  for (let i = 0; i < 160; i += 1) {
    const a = 0.12 + ((i * 13) % 16) / 100
    ctx.strokeStyle = `rgba(80,58,38,${a})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, i * 6.4 + (i % 3))
    ctx.lineTo(128, i * 6.4 + (i % 5))
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function TurningPage({ texture, backTexture, index, reducedMotion }) {
  const pivot = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    if (!pivot.current) return
    const t = state.clock.elapsedTime
    const delay = 1.35 + index * 0.3
    if (t < delay && !reducedMotion) return
    const target = THREE.MathUtils.degToRad(-38 + index * 4) + Math.sin(t * 0.34 + index) * (reducedMotion ? 0 : 0.012)
    pivot.current.rotation.y = THREE.MathUtils.damp(pivot.current.rotation.y, target, 1.8, delta)
    if (mesh.current) {
      const bend = Math.sin(Math.min(1, Math.abs(pivot.current.rotation.y) / Math.PI) * Math.PI) * 0.06
      mesh.current.rotation.x = bend * 0.2
    }
  })

  return (
    <group ref={pivot} position={[-1.54, 0, 0.26 + index * 0.012]} rotation={[0, reducedMotion ? THREE.MathUtils.degToRad(-38 + index * 4) : 0, 0]}>
      <group ref={mesh} position={[1.54, 0, 0]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[3.08, 4.24, 20, 1]} />
          <meshStandardMaterial map={texture} roughness={0.92} metalness={0} side={THREE.FrontSide} />
        </mesh>
        <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.001]} castShadow receiveShadow>
          <planeGeometry args={[3.08, 4.24, 20, 1]} />
          <meshStandardMaterial map={backTexture} roughness={0.92} metalness={0} side={THREE.FrontSide} />
        </mesh>
      </group>
    </group>
  )
}

function SoundBars({ reducedMotion, lightTheme }) {
  const bars = useRef([])
  const group = useRef()
  const data = useMemo(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        x: -3.15 + (i / 37) * 6.3,
        base: 0.16 + Math.abs(Math.sin(i * 0.52)) * 0.5 + Math.abs(Math.sin(i * 0.17)) * 0.25,
      })),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    bars.current.forEach((bar, i) => {
      if (!bar) return
      const target = reducedMotion
        ? data[i].base
        : data[i].base * (0.55 + Math.abs(Math.sin(t * 1.35 + i * 0.42)) * 0.82)
      bar.scale.y = THREE.MathUtils.damp(bar.scale.y, target, 5, 0.016)
    })
    if (group.current && !reducedMotion) {
      group.current.position.y = -2.12 + Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <group ref={group} position={[0, -2.12, -0.4]}>
      {data.map((bar, i) => (
        <mesh key={i} position={[bar.x, 0, 0]} ref={(node) => (bars.current[i] = node)}>
          <boxGeometry args={[0.022, 1, 0.022]} />
          <meshBasicMaterial
            color={lightTheme ? (i % 7 === 0 ? '#985b20' : '#c34d16') : i % 7 === 0 ? GOLD : ORANGE}
            transparent
            opacity={0.34 + (i % 5) * 0.07}
            blending={lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function SoundRings({ reducedMotion, lightTheme }) {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (!reducedMotion) {
      group.current.rotation.z = t * 0.035
      group.current.rotation.x = -0.1 + Math.sin(t * 0.23) * 0.05
    }
    group.current.children.forEach((ring, index) => {
      if (ring.material) {
        const pulse = Math.abs(Math.sin(t * 0.45 + index * 1.4))
        ring.material.opacity = lightTheme
          ? reducedMotion ? 0.35 : 0.28 + pulse * 0.17
          : reducedMotion ? 0.16 : 0.12 + pulse * 0.17
      }
    })
  })

  return (
    <group ref={group} position={[0, 0.1, -0.7]} rotation={[0.2, 0.15, 0.65]}>
      {[2.45, 2.8, 3.15].map((radius, i) => (
        <mesh key={radius} rotation={[0, 0, i * 0.35]}>
          <torusGeometry args={[radius, 0.005, 4, 128, Math.PI * 1.15]} />
          <meshBasicMaterial color={lightTheme ? (i === 1 ? '#985b20' : '#c34d16') : i === 1 ? GOLD : ORANGE} transparent opacity={0.2} blending={lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Book({ reducedMotion }) {
  const book = useRef()
  const coverPivot = useRef()
  const { size } = useThree()
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontReady(true)).catch(() => setFontReady(true))
    } else {
      setFontReady(true)
    }
  }, [])

  const coverTexture = useTexture(HERO_COVER)
  const pageTexture = useMemo(() => makePageTexture(12, 'CHAPTER ONE', "The Mapmaker's", 'Window'), [fontReady])
  const pageTexture2 = useMemo(() => makePageTexture(13, 'CHAPTER TWO', 'A City', 'Without Clocks'), [fontReady])
  const edgeTexture = useMemo(() => makeEdgeTexture(), [])

  useEffect(() => {
    coverTexture.colorSpace = THREE.SRGBColorSpace
    coverTexture.anisotropy = 8
    coverTexture.wrapS = THREE.ClampToEdgeWrapping
    coverTexture.wrapT = THREE.ClampToEdgeWrapping
    coverTexture.repeat.set(1, 0.918)
    coverTexture.offset.set(0, 0.041)
    coverTexture.needsUpdate = true
  }, [coverTexture])

  useEffect(() => {
    return () => {
      pageTexture.dispose()
      pageTexture2.dispose()
      edgeTexture.dispose()
    }
  }, [pageTexture, pageTexture2, edgeTexture])

  const scale =
    size.width < 480 ? 0.66 : size.width < 768 ? 0.8 : size.width < 1100 ? 0.82 : size.width < 1300 ? 0.92 : 0.98
  const horizontalShift = size.width < 768 ? 0 : size.width < 1100 ? 0.35 : 0.6

  useFrame((state, delta) => {
    if (!book.current) return
    const t = state.clock.elapsedTime
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y

    const targetY = -0.22 + pointerX * 0.22 + (reducedMotion ? 0 : Math.sin(t * 0.22) * 0.055) + scroll * 0.16
    const targetX = 0.04 - pointerY * 0.1 + (reducedMotion ? 0 : Math.sin(t * 0.17) * 0.02)
    book.current.rotation.y = THREE.MathUtils.damp(book.current.rotation.y, targetY, 2.2, delta)
    book.current.rotation.x = THREE.MathUtils.damp(book.current.rotation.x, targetX, 2.2, delta)
    book.current.rotation.z = THREE.MathUtils.damp(book.current.rotation.z, scroll * 0.08, 2, delta)
    book.current.position.y = THREE.MathUtils.damp(book.current.position.y, 0.18 - scroll * 0.5, 2, delta)
    book.current.position.x = THREE.MathUtils.damp(book.current.position.x, horizontalShift, 2, delta)

    if (coverPivot.current) {
      const base = THREE.MathUtils.degToRad(-45)
      const target = t > 0.7 || reducedMotion ? base : THREE.MathUtils.degToRad(-16)
      coverPivot.current.rotation.y = THREE.MathUtils.damp(coverPivot.current.rotation.y, target, 1.8, delta)
    }
  })

  return (
    <group ref={book} position={[size.width < 768 ? 0 : size.width < 1100 ? 0.35 : 0.6, 0.18, 0]} scale={scale}>
      <group rotation={[0.02, 0, 0]}>
        {/* Page block */}
        <RoundedBox args={[3.08, 4.26, 0.38]} radius={0.03} smoothness={3} position={[0.03, 0, -0.02]} castShadow receiveShadow>
          <meshStandardMaterial color={CREAM} roughness={0.86} metalness={0.02} />
        </RoundedBox>
        <mesh position={[1.585, 0, -0.02]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[0.4, 4.22]} />
          <meshStandardMaterial map={edgeTexture} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>

        {/* Back cover */}
        <RoundedBox args={[3.24, 4.44, 0.12]} radius={0.05} smoothness={3} position={[0, 0, -0.25]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#0b0907" roughness={0.5} metalness={0.18} clearcoat={0.55} clearcoatRoughness={0.34} />
        </RoundedBox>

        {/* Spine */}
        <RoundedBox args={[0.23, 4.44, 0.58]} radius={0.04} smoothness={3} position={[-1.58, 0, -0.01]} castShadow>
          <meshPhysicalMaterial color="#1a0e08" roughness={0.58} metalness={0.3} clearcoat={0.4} />
        </RoundedBox>

        {/* Inside page visible beneath fan */}
        <mesh position={[0.03, 0, 0.18]} receiveShadow>
          <planeGeometry args={[3.08, 4.24]} />
          <meshStandardMaterial map={pageTexture} roughness={0.93} side={THREE.DoubleSide} />
        </mesh>

        {[0, 1, 2, 3].map((index) => (
          <TurningPage
            key={index}
            index={index}
            texture={index % 2 === 0 ? pageTexture : pageTexture2}
            backTexture={index % 2 === 0 ? pageTexture2 : pageTexture}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Front cover */}
        <group
          ref={coverPivot}
          position={[-1.6, 0, 0.285]}
          rotation={[0, reducedMotion ? THREE.MathUtils.degToRad(-45) : THREE.MathUtils.degToRad(-16), 0]}
        >
          <RoundedBox args={[3.24, 4.44, 0.13]} radius={0.045} smoothness={3} position={[1.6, 0, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial color="#100c09" roughness={0.44} metalness={0.25} clearcoat={0.8} clearcoatRoughness={0.25} />
          </RoundedBox>
          <mesh position={[1.6, 0, 0.071]} castShadow>
            <planeGeometry args={[3.18, 4.38]} />
            <meshPhysicalMaterial map={coverTexture} roughness={0.52} metalness={0.12} clearcoat={0.5} clearcoatRoughness={0.3} />
          </mesh>
          <mesh position={[1.6, 0, -0.071]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.18, 4.38]} />
            <meshStandardMaterial color="#17110c" roughness={0.85} />
          </mesh>
        </group>

        <mesh position={[0, -2.235, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.06, 0.5]} />
          <meshStandardMaterial map={edgeTexture} roughness={0.95} />
        </mesh>
      </group>
    </group>
  )
}

function CameraRig({ reducedMotion, mobile }) {
  const { camera, size } = useThree()
  useFrame((state, delta) => {
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    const targetX = state.pointer.x * (reducedMotion ? 0 : 0.28)
    const targetY = 0.15 + state.pointer.y * (reducedMotion ? 0 : 0.18) - scroll * 0.2
    const distance = mobile ? 8 / Math.min(1, size.width / size.height) : size.width < 768 ? 8 : size.width < 1100 ? 10.1 : 9.1
    const targetZ = distance + scroll * 0.75
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2, delta)
    camera.lookAt(0, -0.1, 0)
  })
  return null
}

function Scene({ reducedMotion, mobile }) {
  const { size } = useThree()
  const isSmall = size.width < 768
  const [lightTheme, setLightTheme] = useState(() => document.documentElement.dataset.theme !== 'dark')

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setLightTheme(root.dataset.theme !== 'dark'))
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <ambientLight intensity={0.64} />
      <directionalLight
        position={[5.5, 7, 6]}
        intensity={2.5}
        color="#ffdcc0"
        castShadow
        shadow-mapSize-width={mobile ? 512 : 1024}
        shadow-mapSize-height={mobile ? 512 : 1024}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <spotLight position={[-6, 3, 5]} angle={0.55} penumbra={1} intensity={24} color={ORANGE} />
      <pointLight position={[0, -2.2, 3.5]} intensity={7} distance={9} color="#ff8c45" />
      <pointLight position={[3.5, 2, -2]} intensity={5} distance={8} color="#ffd9ab" />

      <CameraRig reducedMotion={reducedMotion} mobile={mobile} />

      {reducedMotion ? (
        <Book reducedMotion />
      ) : (
        <Float speed={1.35} rotationIntensity={0.1} floatIntensity={0.42} floatingRange={[-0.08, 0.1]}>
          <Book reducedMotion={false} />
        </Float>
      )}

      <SoundRings reducedMotion={reducedMotion} lightTheme={lightTheme} />
      <SoundBars reducedMotion={reducedMotion} lightTheme={lightTheme} />
      <Sparkles
        count={reducedMotion ? 16 : isSmall ? 36 : 85}
        scale={[8, 7, 5]}
        size={2.2}
        speed={reducedMotion ? 0 : 0.25}
        opacity={0.3}
        color="#FF8D45"
        noise={0.45}
      />
      <ContactShadows
        position={[0, -2.52, 0]}
        opacity={0.3}
        scale={11}
        blur={3.2}
        far={4}
        color="#5a3a20"
        resolution={mobile ? 128 : 256}
        frames={1}
      />
      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  )
}

export default function HeroScene({ reducedMotion = false, active = true, mobile = false }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, mobile ? 1.25 : 1.5]}
      shadows
      camera={{ position: [0, 0.15, 9.1], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      frameloop={active ? 'always' : 'never'}
    >
      <Suspense fallback={null}>
          <Scene reducedMotion={reducedMotion} mobile={mobile} />
      </Suspense>
    </Canvas>
  )
}
