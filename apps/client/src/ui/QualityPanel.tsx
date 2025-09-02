import React from 'react'

export const QualityPanel: React.FC<{
  shadows: boolean
  setShadows: (v: boolean) => void
  physicsDice: boolean
  setPhysicsDice: (v: boolean) => void
  isMobile?: boolean
}> = ({ shadows, setShadows, physicsDice, setPhysicsDice, isMobile }) => {
  return (
    <div style={panel} className={isMobile ? 'quality-mobile' : ''}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Quality</div>
      <label style={row}><input type="checkbox" checked={shadows} onChange={e => setShadows(e.target.checked)} /> Shadows</label>
      <label style={row}><input type="checkbox" checked={physicsDice} onChange={e => setPhysicsDice(e.target.checked)} /> Physics Dice</label>
    </div>
  )
}

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 }
const panel: React.CSSProperties = {
  position: 'fixed', right: 16, bottom: 16, background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: 12, width: 220, zIndex: 10
}
