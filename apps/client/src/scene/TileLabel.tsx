import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Tile, TileKind } from '@monopoly/shared'
import { useThree } from '@react-three/fiber'

export const TileLabel: React.FC<{ tile: Tile; position: THREE.Vector3 }> = ({ tile, position }) => {
  const texture = useMemo(() => new THREE.CanvasTexture(drawLabel(tile)), [tile])
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  const scale = 0.6
  const pos = useMemo(() => new THREE.Vector3(position.x, position.y + 0.02, position.z), [position])
  return (
    <sprite position={pos.toArray() as any} scale={[scale, scale * 0.5, 1] as any}>
      {/* @ts-ignore */}
      <spriteMaterial map={texture} transparent opacity={0.95} depthWrite={false} sizeAttenuation={false} />
    </sprite>
  )
}

const drawLabel = (tile: Tile): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffffee'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#111'
  ctx.font = 'bold 42px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const name = tile.name
  ctx.fillText(name, canvas.width / 2, canvas.height / 2 - 30)
  ctx.font = '32px system-ui, sans-serif'
  if (tile.kind === TileKind.Property || tile.kind === TileKind.Railroad || tile.kind === TileKind.Utility) {
    const price = (tile as any).price
    ctx.fillText(`$${price}`, canvas.width / 2, canvas.height / 2 + 28)
  } else if (tile.kind === TileKind.Tax) {
    ctx.fillText(`-$${tile.amount}`, canvas.width / 2, canvas.height / 2 + 28)
  } else if (tile.kind === TileKind.GoToJail) {
    ctx.fillText('Go to Jail', canvas.width / 2, canvas.height / 2 + 28)
  }
  ctx.strokeStyle = '#00000022'
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
  return canvas
}
