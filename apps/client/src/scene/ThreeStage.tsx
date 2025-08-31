import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Sky, StatsGl } from '@react-three/drei'
import * as THREE from 'three'

export type ThreeStageProps = {
  children: React.ReactNode
  quality: { shadows: boolean; showPerf: boolean }
  onFocus?: (v: THREE.Vector3) => void
}

export const ThreeStage: React.FC<ThreeStageProps> = ({ children, quality }) => {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  return (
    <Canvas
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={dpr}
      shadows={quality.shadows}
      camera={{ position: [10, 10, 10], fov: 45, near: 0.1, far: 200 }}
    >
      <color attach="background" args={[0.94, 0.96, 0.98]} />
      <SceneLighting />
      <OrbitControls
        enablePan={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={(5 * Math.PI) / 12}
        minDistance={8}
        maxDistance={26}
        makeDefault
      />
      {children}
      {quality.showPerf ? <StatsGl className="perf" /> : null}
    </Canvas>
  )
}

const SceneLighting: React.FC = () => {
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const hemi = useMemo(() => new THREE.HemisphereLight(0xffffff, 0x667799, 0.5), [])
  return (
    <>
      <Sky sunPosition={[50, 60, 20]} turbidity={6} rayleigh={2} mieCoefficient={0.02} mieDirectionalG={0.9} />
      <primitive object={hemi} />
      <directionalLight
        ref={dirRef}
        position={[8, 12, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
      />
      <ambientLight intensity={0.25} />
      <pointLight position={[-10, 6, -8]} intensity={0.3} />
    </>
  )
}

export const useFocusCamera = () => {
  const { camera, controls } = useThree(state => ({ camera: state.camera, controls: state.controls as any }))
  return (target: THREE.Vector3, distance = 12) => {
    const dir = new THREE.Vector3().subVectors(camera.position, (controls?.target as THREE.Vector3) ?? new THREE.Vector3(0, 0, 0))
    const newPos = new THREE.Vector3().copy(target).add(dir.setLength(distance))
    ;(controls as any)?.target?.copy(target)
    camera.position.copy(newPos)
    ;(controls as any)?.update?.()
  }
}
