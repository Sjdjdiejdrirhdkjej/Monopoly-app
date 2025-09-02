import React, { useState, useEffect } from 'react'
import { Card, CardKind, Event, GameState } from '@monopoly/shared'

interface CardModalProps {
  state: GameState
  onConfirm: () => void
  isMobile?: boolean
}

export const CardModal: React.FC<CardModalProps> = ({ state, onConfirm, isMobile }) => {
  const [lastCardEvent, setLastCardEvent] = useState<Event & { type: 'DrewCard' } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  // Listen for new card draws
  useEffect(() => {
    const recentEvents = state.logs.slice(-5)
    const cardEvent = recentEvents.find(e => e.type === 'DrewCard') as Event & { type: 'DrewCard' } | undefined
    
    if (cardEvent && cardEvent !== lastCardEvent) {
      setLastCardEvent(cardEvent)
      setIsVisible(true)
      setIsFlipped(false)
      
      // Auto-flip card after animation
      setTimeout(() => setIsFlipped(true), 600)
    }
  }, [state.logs, lastCardEvent])

  if (!isVisible || !lastCardEvent) return null

  const isDeckChance = lastCardEvent.deck === 'chance'
  const playerName = state.players[lastCardEvent.player]?.name || 'Player'

  const handleConfirm = () => {
    setIsVisible(false)
    setIsFlipped(false)
    setLastCardEvent(null)
    onConfirm()
  }

  const cardText = lastCardEvent.text
  const cardIcon = getCardIcon(cardText)

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className={isMobile ? 'modal-mobile card-modal-mobile' : ''}>
        <div style={headerStyle}>
          <h3>{playerName} drew a {isDeckChance ? 'Chance' : 'Community Chest'} card</h3>
        </div>
        
        <div style={cardContainerStyle}>
          <div 
            style={{
              ...cardStyle,
              backgroundColor: isDeckChance ? '#e74c3c' : '#3498db',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              ...(!isFlipped && cardBackStyle)
            }}
          >
            {isFlipped ? (
              <div style={cardFrontStyle}>
                <div style={cardIconStyle}>{cardIcon}</div>
                <div style={cardTextStyle}>
                  {cardText}
                </div>
                <div style={cardTypeStyle}>
                  {isDeckChance ? 'CHANCE' : 'COMMUNITY CHEST'}
                </div>
              </div>
            ) : (
              <div style={cardBackContentStyle}>
                <div style={cardTypeStyle}>
                  {isDeckChance ? 'CHANCE' : 'COMMUNITY CHEST'}
                </div>
                <div style={questionMarkStyle}>?</div>
              </div>
            )}
          </div>
        </div>

        {isFlipped && (
          <div style={actionsStyle}>
            <button style={confirmButtonStyle} onClick={handleConfirm}>
              Apply Effect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const getCardIcon = (text: string): string => {
  if (text.includes('Jail')) return '🚔'
  if (text.includes('Advance') || text.includes('Move')) return '🎯'
  if (text.includes('collect') || text.includes('Receive') || text.includes('$')) return '💰'
  if (text.includes('Pay') || text.includes('pay') || text.includes('fees')) return '💸'
  if (text.includes('repairs')) return '🔨'
  if (text.includes('Railroad')) return '🚂'
  if (text.includes('inherit')) return '🎁'
  return '📋'
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 25,
  backdropFilter: 'blur(4px)'
}

const modalStyle: React.CSSProperties = {
  background: '#2c3e50',
  borderRadius: 16,
  padding: 24,
  maxWidth: 400,
  width: '90%',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
  color: 'white',
  textAlign: 'center'
}

const headerStyle: React.CSSProperties = {
  marginBottom: 20
}

const cardContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 20,
  perspective: '1000px'
}

const cardStyle: React.CSSProperties = {
  width: 280,
  height: 180,
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  transition: 'transform 0.8s ease-in-out',
  transformStyle: 'preserve-3d',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  position: 'relative'
}

const cardBackStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

const cardBackContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: 16
}

const cardFrontStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: 16,
  gap: 12,
  transform: 'rotateY(180deg)'
}

const cardIconStyle: React.CSSProperties = {
  fontSize: 32,
  marginBottom: 8
}

const cardTextStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.4,
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  alignItems: 'center'
}

const cardTypeStyle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.8,
  letterSpacing: 1,
  fontWeight: 'bold'
}

const questionMarkStyle: React.CSSProperties = {
  fontSize: 48,
  opacity: 0.6
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center'
}

const confirmButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '12px 24px',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
}