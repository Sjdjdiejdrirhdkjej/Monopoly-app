import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSpring, a } from '@react-spring/three'
import { Player } from '@monopoly/shared'
import { useFrame } from '@react-three/fiber'
import { useFocusCamera } from './ThreeStage'

export const Tokens: React.FC<{
  players: Player[]
  active: number
  tileCenters: THREE.Vector3[]
}> = ({ players, active, tileCenters }) => {
  return (
    <group>
      {players.map(p => (
        <Token key={p.id} player={p} active={p.id === active} tileIndex={p.position} tileCenters={tileCenters} color={playerColor(p.id)} />
      ))}
    </group>
  )
}

const Token: React.FC<{ player: Player; active: boolean; tileIndex: number; tileCenters: THREE.Vector3[]; color: string }> = ({ player, active, tileIndex, tileCenters, color }) => {
  const focus = useFocusCamera()
  const prevIndex = useRef<number>(tileIndex)
  const spring = useSpring({ from: { x: tileCenters[tileIndex].x, y: 0.12, z: tileCenters[tileIndex].z } })

  const animatePath = async (from: number, to: number) => {
    const steps = []
    let i = from
    while (i !== to) {
      i = (i + 1) % 40
      steps.push(i)
    }
    for (const idx of steps) {
      const isCorner = idx % 10 === 0
      await spring.start({
        to: async next => {
          await next({ x: tileCenters[idx].x, z: tileCenters[idx].z, y: 0.22 })
          await next({ y: 0.12 })
        },
        config: { mass: 1.2, tension: 260, friction: 26 }
      })
    }
  }

  useEffect(() => {
    const from = prevIndex.current
    if (from !== tileIndex) {
      animatePath(from, tileIndex)
      prevIndex.current = tileIndex
    }
  }, [tileIndex])

  useEffect(() => {
    if (active) focus(tileCenters[tileIndex], 12)
  }, [active])

  const t = useRef(0)
  useFrame((_, dt) => (t.current += dt))
  const wobble = active ? 0 : Math.sin(t.current * 2 + player.id) * 0.03

  return (
    <a.group position-x={spring.x as any} position-z={spring.z as any} position-y={(spring.y as any).to(y => y + wobble)}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 24]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <icosahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
      </mesh>
    </a.group>
  )
}

const COLORS = ['#b0b7ff', '#ffb0c9', '#b6f1a3', '#ffd59c']
const playerColor = (id: number) => COLORS[id % COLORS.length]
