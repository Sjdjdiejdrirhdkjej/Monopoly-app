import React from 'react'

interface HelpPanelProps {
  isVisible: boolean
  onClose: () => void
  isMobile?: boolean
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ isVisible, onClose, isMobile }) => {
  if (!isVisible) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className={isMobile ? 'modal-mobile help-modal-mobile' : ''}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>📖 Game Rules & Help</h2>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>

        <div style={contentStyle}>
          {/* Quick Rules */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🎯 Objective</h3>
            <p style={textStyle}>
              Be the last player standing! Force all other players into bankruptcy by owning properties 
              and charging rent. Build monopolies (complete color groups) to charge higher rent.
            </p>
          </section>

          {/* Game Flow */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🔄 Game Flow</h3>
            <ol style={listStyle}>
              <li><strong>Roll dice</strong> to move around the board</li>
              <li><strong>Land on spaces</strong> and follow their rules</li>
              <li><strong>Buy properties</strong> or participate in auctions</li>
              <li><strong>Collect rent</strong> from other players</li>
              <li><strong>Trade</strong> to complete monopolies</li>
              <li><strong>Build houses/hotels</strong> to increase rent</li>
              <li><strong>Avoid bankruptcy</strong> - manage your cash wisely!</li>
            </ol>
          </section>

          {/* Icon Legend */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🏷️ Board Spaces</h3>
            <div style={iconGridStyle}>
              <div style={iconItemStyle}><span style={iconStyle}>🏠</span> Properties - Buy to earn rent</div>
              <div style={iconItemStyle}><span style={iconStyle}>🚂</span> Railroads - Own multiple for higher rent</div>
              <div style={iconItemStyle}><span style={iconStyle}>⚡</span> Utilities - Rent based on dice roll</div>
              <div style={iconItemStyle}><span style={iconStyle}>🃏</span> Chance - Draw a random card</div>
              <div style={iconItemStyle}><span style={iconStyle}>📮</span> Community Chest - Draw a random card</div>
              <div style={iconItemStyle}><span style={iconStyle}>🚔</span> Jail - Skip turns or pay to get out</div>
              <div style={iconItemStyle}><span style={iconStyle}>🚗</span> Free Parking - Nothing happens</div>
              <div style={iconItemStyle}><span style={iconStyle}>💰</span> GO - Collect $200 when passing</div>
            </div>
          </section>

          {/* Card Types */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🃏 Card Effects</h3>
            <div style={iconGridStyle}>
              <div style={iconItemStyle}><span style={iconStyle}>🎯</span> Movement - Move to specific spaces</div>
              <div style={iconItemStyle}><span style={iconStyle}>💰</span> Money - Receive cash from bank</div>
              <div style={iconItemStyle}><span style={iconStyle}>💸</span> Payments - Pay bank or other players</div>
              <div style={iconItemStyle}><span style={iconStyle}>🔨</span> Repairs - Pay based on buildings owned</div>
              <div style={iconItemStyle}><span style={iconStyle}>🚔</span> Jail - Go directly to jail</div>
              <div style={iconItemStyle}><span style={iconStyle}>🗝️</span> Jail Free - Keep to avoid jail once</div>
            </div>
          </section>

          {/* Trading Rules */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🤝 Trading Rules</h3>
            <ul style={listStyle}>
              <li>Trade properties, cash, and jail cards</li>
              <li>Both players must agree to the trade</li>
              <li>Can't trade mortgaged properties</li>
              <li>Must maintain even building after trades</li>
              <li>No loans between players - trades only</li>
            </ul>
          </section>

          {/* Auction Rules */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🏛️ Auction Rules</h3>
            <ul style={listStyle}>
              <li>If a property isn't purchased, it goes to auction</li>
              <li>All players can bid (including the one who declined)</li>
              <li>Bidding starts at $1 with $10 minimum increments</li>
              <li>Last remaining bidder wins the property</li>
              <li>Must have sufficient cash to bid</li>
            </ul>
          </section>

          {/* Building Rules */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🏗️ Building Rules</h3>
            <ul style={listStyle}>
              <li>Must own all properties in a color group (monopoly)</li>
              <li>Build houses evenly across the monopoly</li>
              <li>4 houses per property maximum, then upgrade to hotel</li>
              <li>Sell buildings for half price when needed</li>
              <li>Can't build on mortgaged properties</li>
            </ul>
          </section>

          {/* Controls Help */}
          <section style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>🎮 Controls</h3>
            <div style={iconGridStyle}>
              <div style={iconItemStyle}><span style={iconStyle}>🖱️</span> Click & drag - Rotate camera</div>
              <div style={iconItemStyle}><span style={iconStyle}>🎳</span> Scroll wheel - Zoom in/out</div>
              <div style={iconItemStyle}><span style={iconStyle}>👆</span> Click tiles - View property details</div>
              <div style={iconItemStyle}><span style={iconStyle}>⚙️</span> Quality panel - Adjust graphics</div>
              <div style={iconItemStyle}><span style={iconStyle}>📜</span> Event log - Game history</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 25,
  backdropFilter: 'blur(4px)'
}

const modalStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #2c3e50 0%, #34495e 100%)',
  borderRadius: 20,
  padding: 0,
  maxWidth: 800,
  width: '95%',
  maxHeight: '90vh',
  overflow: 'hidden',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
  color: 'white'
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 24,
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)'
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 'bold'
}

const closeButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'none',
  borderRadius: 8,
  width: 32,
  height: 32,
  color: 'white',
  cursor: 'pointer',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const contentStyle: React.CSSProperties = {
  padding: 24,
  maxHeight: 'calc(90vh - 120px)',
  overflow: 'auto'
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 24
}

const sectionHeaderStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: 18,
  fontWeight: 'bold',
  color: '#3498db'
}

const textStyle: React.CSSProperties = {
  lineHeight: 1.6,
  margin: 0,
  opacity: 0.9
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.6
}

const iconGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 8,
  fontSize: 14
}

const iconItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: 4
}

const iconStyle: React.CSSProperties = {
  fontSize: 16,
  width: 20,
  textAlign: 'center'
}