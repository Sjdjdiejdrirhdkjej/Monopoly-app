import React, { useMemo } from 'react'
import * as THREE from 'three'
import { GameState, TileKind } from '@monopoly/shared'
import { computeTileCenters } from './Board'

export const HousesHotels: React.FC<{ state: GameState }> = ({ state }) => {
  const centers = useMemo(() => computeTileCenters(), [])
  const houseInstances = useMemo(() => {
    const transforms: { position: THREE.Vector3; rotationY: number }[] = []
    Object.entries(state.ownership).forEach(([k, own]) => {
      const idx = Number(k)
      const tile = state.board[idx]
      if (tile.kind !== TileKind.Property) return
      const c = centers[idx]
      const rot = rotationFor(idx)
      const normal = sideNormal(idx).multiplyScalar(-0.35)
      const base = c.clone().add(normal).setY(c.y + 0.12)
      const count = own.hotel ? 1 : Math.min(own.houses ?? 0, 4)
      const spread = 0.6
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : (i - (count - 1) / 2) * (spread / (count - 1))
        const tangent = tangentFor(idx).multiplyScalar(t)
        transforms.push({ position: base.clone().add(tangent), rotationY: rot })
      }
    })
    return transforms
  }, [state])

  const hotelInstances = useMemo(() => {
    const transforms: { position: THREE.Vector3; rotationY: number }[] = []
    Object.entries(state.ownership).forEach(([k, own]) => {
      const idx = Number(k)
      const tile = state.board[idx]
      if (tile.kind !== TileKind.Property) return
      if (!own.hotel) return
      const c = centers[idx]
      const rot = rotationFor(idx)
      const normal = sideNormal(idx).multiplyScalar(-0.2)
      const base = c.clone().add(normal).setY(c.y + 0.18)
      transforms.push({ position: base, rotationY: rot })
    })
    return transforms
  }, [state])

  return (
    <group>
      {/* Houses */}
      {houseInstances.map((t, i) => (
        <mesh key={i} position={t.position.toArray() as any} rotation={[0, t.rotationY, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.12, 0.22]} />
          <meshStandardMaterial color="#3bb24a" metalness={0.1} roughness={0.7} />
        </mesh>
      ))}
      {/* Hotels */}
      {hotelInstances.map((t, i) => (
        <mesh key={`h-${i}`} position={t.position.toArray() as any} rotation={[0, t.rotationY, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.18, 0.28]} />
          <meshStandardMaterial color="#c62828" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

const rotationFor = (i: number) => {
  if (i <= 10) return 0
  if (i <= 20) return Math.PI / 2
  if (i <= 30) return Math.PI
  return -Math.PI / 2
}

const sideNormal = (i: number): THREE.Vector3 => {
  if (i <= 10) return new THREE.Vector3(0, 0, -1)
  if (i <= 20) return new THREE.Vector3(1, 0, 0)
  if (i <= 30) return new THREE.Vector3(0, 0, 1)
  return new THREE.Vector3(-1, 0, 0)
}

const tangentFor = (i: number): THREE.Vector3 => {
  if (i <= 10) return new THREE.Vector3(-1, 0, 0)
  if (i <= 20) return new THREE.Vector3(0, 0, -1)
  if (i <= 30) return new THREE.Vector3(1, 0, 0)
  return new THREE.Vector3(0, 0, 1)
}
