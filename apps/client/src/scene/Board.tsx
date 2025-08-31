import React, { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { BOARD, BOARD_SIZE, Tile, TileKind } from '@monopoly/shared'
import { TileLabel } from './TileLabel'

export type BoardProps = {
  onHoverTile?: (i: number | null) => void
  onSelectTile?: (i: number) => void
  hovered?: number | null
  selected?: number | null
}

const TILE_COUNT_PER_SIDE = 10
const TILE_W = 1
const BORDER = 0.25
const BOARD_THICKNESS = 0.15

export const computeTileCenters = (): THREE.Vector3[] => {
  const centers: THREE.Vector3[] = []
  const half = TILE_COUNT_PER_SIDE / 2
  const span = TILE_COUNT_PER_SIDE
  const offset = half
  for (let i = 0; i < BOARD_SIZE; i++) {
    let x = 0
    let z = 0
    if (i <= 10) {
      // bottom edge: 0 corner at +x,+z quadrant
      const k = i
      x = offset - k
      z = offset
    } else if (i <= 20) {
      // left edge
      const k = i - 10
      x = -offset
      z = offset - k
    } else if (i <= 30) {
      // top edge
      const k = i - 20
      x = -offset + k
      z = -offset
    } else {
      // right edge
      const k = i - 30
      x = offset
      z = -offset + k
    }
    centers.push(new THREE.Vector3(x * TILE_W, BOARD_THICKNESS / 2, z * TILE_W))
  }
  return centers
}

export const Board: React.FC<BoardProps> = ({ onHoverTile, onSelectTile, hovered, selected }) => {
  const centers = useMemo(() => computeTileCenters(), [])
  const boardSize = useMemo(() => (TILE_COUNT_PER_SIDE + 1) * TILE_W, [])

  const grid = useMemo(() => buildGridLines(boardSize), [boardSize])

  return (
    <group>
      <RoundedBox args={[boardSize + BORDER * 2, BOARD_THICKNESS, boardSize + BORDER * 2]} radius={0.2} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f4f2ea" metalness={0.1} roughness={0.8} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BOARD_THICKNESS + 0.001, 0]}> 
        <planeGeometry args={[boardSize, boardSize]} />
        <meshStandardMaterial color="#faf8f0" />
      </mesh>
      <lineSegments geometry={grid} position={[0, BOARD_THICKNESS + 0.002, 0]}> 
        <lineBasicMaterial color="#cccccc" linewidth={1} />
      </lineSegments>

      {BOARD.map(tile => (
        <TileHit
          key={tile.index}
          tile={tile}
          center={centers[tile.index]}
          hovered={hovered === tile.index}
          selected={selected === tile.index}
          onHover={onHoverTile}
          onClick={onSelectTile}
        />
      ))}

      {BOARD.map(tile => (
        <TileLabel key={`label-${tile.index}`} tile={tile} position={centers[tile.index]} />
      ))}
    </group>
  )
}

const TileHit: React.FC<{
  tile: Tile
  center: THREE.Vector3
  hovered: boolean
  selected: boolean
  onHover?: (i: number | null) => void
  onClick?: (i: number) => void
}> = ({ tile, center, hovered, selected, onHover, onClick }) => {
  const color = selected ? '#ffd56a' : hovered ? '#ffe9a8' : 'transparent'
  const size = 1
  const rotY = rotationFor(tile.index)
  const p = center.clone().add(new THREE.Vector3().setFromSphericalCoords(0, 0, 0))
  return (
    <group position={[p.x, BOARD_THICKNESS + 0.005, p.z]} rotation={[0, rotY, 0]}> 
      <mesh
        onPointerOver={e => onHover?.(tile.index)}
        onPointerOut={e => onHover?.(null)}
        onClick={e => onClick?.(tile.index)}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={color === 'transparent' ? 0 : 0.35} />
      </mesh>
    </group>
  )
}

const rotationFor = (i: number) => {
  if (i <= 10) return 0
  if (i <= 20) return Math.PI / 2
  if (i <= 30) return Math.PI
  return -Math.PI / 2
}

const buildGridLines = (boardSize: number) => {
  const geom = new THREE.BufferGeometry()
  const positions: number[] = []
  const half = boardSize / 2
  const step = TILE_W
  // outer border
  pushLine(positions, [-half, 0, -half], [half, 0, -half])
  pushLine(positions, [half, 0, -half], [half, 0, half])
  pushLine(positions, [half, 0, half], [-half, 0, half])
  pushLine(positions, [-half, 0, half], [-half, 0, -half])
  // grid along edges every 1 unit
  for (let i = -TILE_COUNT_PER_SIDE / 2 + 1; i < TILE_COUNT_PER_SIDE / 2; i++) {
    // vertical lines top/bottom tiles
    pushLine(positions, [i * step, 0, -half], [i * step, 0, -half + step])
    pushLine(positions, [i * step, 0, half - step], [i * step, 0, half])
    // horizontal lines left/right tiles
    pushLine(positions, [-half, 0, i * step], [-half + step, 0, i * step])
    pushLine(positions, [half - step, 0, i * step], [half, 0, i * step])
  }
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geom
}

const pushLine = (arr: number[], a: [number, number, number], b: [number, number, number]) => {
  arr.push(...a, ...b)
}
