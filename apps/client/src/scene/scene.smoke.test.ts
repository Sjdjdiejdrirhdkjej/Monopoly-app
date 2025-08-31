import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { computeTileCenters } from './Board'

// Headless smoke tests that don't create a real WebGL context.

describe('scene smoke', () => {
  it('three constructs a scene', () => {
    const scene = new THREE.Scene()
    expect(scene).toBeTruthy()
  })

  it('computes 40 tile centers', () => {
    const centers = computeTileCenters()
    expect(centers.length).toBe(40)
    const unique = new Set(centers.map(v => `${v.x.toFixed(2)}:${v.z.toFixed(2)}`))
    expect(unique.size).toBe(40)
  })
})
