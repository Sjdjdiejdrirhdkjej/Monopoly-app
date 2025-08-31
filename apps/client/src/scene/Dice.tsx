import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { DiceRoll } from '@monopoly/shared'

export type DiceApi = {
  roll: (target?: DiceRoll | null, fast?: boolean) => Promise<DiceRoll>
}

export const Dice = forwardRef<DiceApi, { enabled: boolean }>((props, ref) => {
  const diceRef = useRef<DiceInnerHandle>(null)
  useImperativeHandle(ref, () => ({
    roll: (target?: DiceRoll | null, fast?: boolean) => diceRef.current!.roll(target ?? null, !!fast)
  }))
  if (!props.enabled) return null
  return (
    <Physics gravity={[0, -20, 0]} allowSleep broadphase="SAP">
      <Ground />
      <DiceInner ref={diceRef} />
    </Physics>
  )
})

const Ground = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0.07, 0] }))
  return (
    <mesh ref={ref as any} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <shadowMaterial transparent opacity={0.18} />
    </mesh>
  )
}

type DiceInnerHandle = { roll: (target: DiceRoll | null, fast: boolean) => Promise<DiceRoll> }
const DiceInner = forwardRef<DiceInnerHandle, {}>((_, ref) => {
  const size = 0.5
  const [aRef, aApi] = useBox(() => ({ mass: 1, args: [size, size, size], position: [-1, 2, 0], sleepSpeedLimit: 0.3, sleepTimeLimit: 0.6 }))
  const [bRef, bApi] = useBox(() => ({ mass: 1, args: [size, size, size], position: [1, 2.2, 0], sleepSpeedLimit: 0.3, sleepTimeLimit: 0.6 }))

  const [resolve, setResolve] = useState<((r: DiceRoll) => void) | null>(null)
  const attempts = useRef(0)
  const targetRef = useRef<DiceRoll | null>(null)

  const resetDie = (api: any, x: number) => {
    api.position.set(x, 2.5, -1)
    api.velocity.set(0, 0, 0)
    api.angularVelocity.set(0, 0, 0)
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI))
    api.quaternion.copy(q as any)
  }

  const throwDie = (api: any, xImpulse: number) => {
    api.applyImpulse([xImpulse, 5 + Math.random() * 2, 2 + Math.random() * 2], [0.1, 0.1, 0.1])
    api.applyTorque([Math.random() * 8, Math.random() * 8, Math.random() * 8])
  }

  const computeTop = (m: THREE.Matrix4): number => {
    const q = new THREE.Quaternion()
    m.decompose(new THREE.Vector3(), q, new THREE.Vector3())
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q.invert()).normalize()
    // local face normals for +Y is 1, other faces map arbitrarily to standard d6
    const faces: { n: THREE.Vector3; value: number }[] = [
      { n: new THREE.Vector3(0, 1, 0), value: 1 },
      { n: new THREE.Vector3(0, -1, 0), value: 6 },
      { n: new THREE.Vector3(1, 0, 0), value: 2 },
      { n: new THREE.Vector3(-1, 0, 0), value: 5 },
      { n: new THREE.Vector3(0, 0, 1), value: 3 },
      { n: new THREE.Vector3(0, 0, -1), value: 4 }
    ]
    let best = faces[0]
    let max = -Infinity
    for (const f of faces) {
      const d = f.n.dot(up)
      if (d > max) {
        max = d
        best = f
      }
    }
    return best.value
  }

  const getMatrices = () => {
    const ma = new THREE.Matrix4()
    const mb = new THREE.Matrix4()
    ;(aRef.current as any)?.matrixWorld?.decompose?.(new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3())
    if ((aRef.current as any)?.matrixWorld) ma.copy((aRef.current as any).matrixWorld)
    if ((bRef.current as any)?.matrixWorld) mb.copy((bRef.current as any).matrixWorld)
    return { ma, mb }
  }

  const checkSleep = async () => {
    const { ma, mb } = getMatrices()
    const d1 = computeTop(ma)
    const d2 = computeTop(mb)
    const result: DiceRoll = { d1, d2, total: d1 + d2, isDouble: d1 === d2 }
    const target = targetRef.current
    if (target && (result.d1 !== target.d1 || result.d2 !== target.d2) && attempts.current < 2) {
      attempts.current += 1
      resetDie(aApi, -1)
      resetDie(bApi, 1)
      setTimeout(() => {
        throwDie(aApi, 3)
        throwDie(bApi, -3)
      }, 0)
      return
    }
    if (target && attempts.current >= 2 && (result.d1 !== target.d1 || result.d2 !== target.d2)) {
      // snap visually to target
      snapTo(target)
      resolve?.(target)
      setResolve(null)
      return
    }
    resolve?.(result)
    setResolve(null)
  }

  const snapTo = (t: DiceRoll) => {
    const qForFace = (val: number) => {
      // Orient so "val" is on top; just map minimal set
      switch (val) {
        case 1:
          return new THREE.Quaternion()
        case 2:
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2))
        case 3:
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
        case 4:
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
        case 5:
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
        case 6:
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0))
      }
      return new THREE.Quaternion()
    }
    aApi.angularVelocity.set(0, 0, 0)
    bApi.angularVelocity.set(0, 0, 0)
    aApi.velocity.set(0, 0, 0)
    bApi.velocity.set(0, 0, 0)
    aApi.quaternion.copy(qForFace(t.d1) as any)
    bApi.quaternion.copy(qForFace(t.d2) as any)
  }

  useEffect(() => {
    const unsubA = (aApi as any)?.sleep?.(() => tryFinish())
    const unsubB = (bApi as any)?.sleep?.(() => tryFinish())
    return () => {
      unsubA?.()
      unsubB?.()
    }
  }, [])

  const sleepy = { a: false, b: false }
  const tryFinish = () => {
    sleepy.a = true
    sleepy.b = true
    setTimeout(() => checkSleep(), 10)
  }

  useImperativeHandle(ref, () => ({
    roll: (target: DiceRoll | null, fast: boolean) => {
      targetRef.current = target
      attempts.current = 0
      return new Promise<DiceRoll>(res => {
        setResolve(() => res)
        if (fast) {
          const r: DiceRoll = target ?? { d1: 1, d2: 1, total: 2, isDouble: true }
          // quick snap without physics
          snapTo(r)
          setTimeout(() => res(r), 50)
          return
        }
        resetDie(aApi, -1)
        resetDie(bApi, 1)
        setTimeout(() => {
          throwDie(aApi, 3)
          throwDie(bApi, -3)
        }, 0)
      })
    }
  }))

  return (
    <group position={[0, 0.1, 0]}>
      <mesh ref={aRef as any} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh ref={bRef as any} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  )
})
