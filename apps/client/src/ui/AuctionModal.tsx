import React, { useState, useEffect, useMemo } from 'react'
import { GameState, Phase, TileKind, Player } from '@monopoly/shared'
import { BOARD } from '@monopoly/shared'

interface AuctionModalProps {
  state: GameState
  onBid: (amount: number) => void
  onPass: () => void
  getAIRationale?: (playerId: number, bid: number) => string
  isMobile?: boolean
}

export const AuctionModal: React.FC<AuctionModalProps> = ({ 
  state, 
  onBid, 
  onPass,
  getAIRationale,
  isMobile 
}) => {
  const [bidAmount, setBidAmount] = useState(0)
  const [animatingBid, setAnimatingBid] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30) // Simulated countdown

  if (state.phase !== Phase.Auction || !state.auction?.active) return null

  const auction = state.auction
  const tile = state.board[auction.tile]
  const currentPlayer = state.players[state.currentPlayer]
  const participants = auction.participants.map(id => state.players[id])
  const minBid = auction.currentBid + auction.minIncrement

  // Initialize bid amount
  useEffect(() => {
    setBidAmount(minBid)
  }, [minBid])

  // Simulated countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  // Animate new bids
  useEffect(() => {
    if (auction.currentBid > 0) {
      setAnimatingBid(auction.currentBid)
      setTimeout(() => setAnimatingBid(null), 800)
    }
  }, [auction.currentBid])

  const handleBid = () => {
    if (bidAmount >= minBid && currentPlayer.cash >= bidAmount) {
      onBid(bidAmount)
    }
  }

  const canBid = bidAmount >= minBid && currentPlayer.cash >= bidAmount
  const isCurrentPlayerTurn = state.currentPlayer === participants.find(p => !p.bankrupt)?.id

  const getPropertyDescription = () => {
    if (tile.kind === TileKind.Property) {
      return {
        type: 'Property',
        price: tile.price,
        color: tile.color,
        rent: tile.rents[0]
      }
    } else if (tile.kind === TileKind.Railroad) {
      return {
        type: 'Railroad',
        price: tile.price,
        rent: 25 // Base railroad rent
      }
    } else if (tile.kind === TileKind.Utility) {
      return {
        type: 'Utility',
        price: tile.price,
        rent: 0 // Variable utility rent
      }
    }
    return { type: 'Property', price: 0, rent: 0 }
  }

  const propertyInfo = getPropertyDescription()
  const highestBidder = auction.highestBidder !== null ? state.players[auction.highestBidder] : null

  const getAIBidRationale = (player: Player, amount: number) => {
    if (getAIRationale) {
      return getAIRationale(player.id, amount)
    }
    
    // Default rationale based on bid amount vs property price
    const ratio = amount / (propertyInfo.price || 1)
    if (ratio < 0.7) return "Excellent value opportunity"
    if (ratio < 0.9) return "Good strategic fit"  
    if (ratio < 1.1) return "Fair market price"
    if (ratio < 1.3) return "Preventing opponent monopoly"
    return "Aggressive defensive bidding"
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className={isMobile ? 'modal-mobile auction-modal-mobile' : ''}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>🏛️ Property Auction</h2>
          <div style={timerStyle}>
            <span style={{color: timeLeft < 10 ? '#e74c3c' : '#27ae60'}}>
              ⏱️ {timeLeft}s
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div style={propertyCardStyle}>
          <div style={propertyNameStyle}>{tile.name}</div>
          <div style={propertyDetailsStyle}>
            <span style={propertyTypeStyle}>{propertyInfo.type}</span>
            <span style={propertyPriceStyle}>List Price: ${propertyInfo.price}</span>
            {propertyInfo.rent > 0 && (
              <span style={propertyRentStyle}>Base Rent: ${propertyInfo.rent}</span>
            )}
          </div>
        </div>

        {/* Current Bid Status */}
        <div style={bidStatusStyle}>
          <div style={currentBidStyle}>
            <span style={bidLabelStyle}>Current Bid</span>
            <span 
              style={{
                ...bidAmountStyle,
                ...(animatingBid && { 
                  animation: 'bidPulse 0.8s ease-out',
                  color: '#e74c3c' 
                })
              }}
            >
              ${auction.currentBid || 'Starting'}
            </span>
          </div>
          
          {highestBidder && (
            <div style={bidderInfoStyle}>
              <span style={bidderLabelStyle}>Highest Bidder</span>
              <span style={bidderNameStyle}>{highestBidder.name}</span>
              <div style={rationaleStyle}>
                {getAIBidRationale(highestBidder, auction.currentBid)}
              </div>
            </div>
          )}
        </div>

        {/* Participants */}
        <div style={participantsStyle}>
          <div style={participantsHeaderStyle}>Participants</div>
          <div style={participantsGridStyle}>
            {participants.map(player => (
              <div 
                key={player.id} 
                style={{
                  ...participantStyle,
                  ...(player.id === auction.highestBidder && leadingBidderStyle),
                  ...(player.id === state.currentPlayer && activePlayerStyle)
                }}
              >
                <div style={participantNameStyle}>
                  {player.name}
                  {player.id === state.currentPlayer && ' (You)'}
                </div>
                <div style={participantCashStyle}>
                  ${player.cash}
                </div>
                <div style={participantStatusStyle}>
                  {player.id === auction.highestBidder ? '👑 Leading' : 
                   player.id === state.currentPlayer ? '🎯 Your turn' : '⏳ Waiting'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bidding Controls */}
        {isCurrentPlayerTurn && (
          <div style={controlsStyle}>
            <div style={bidInputStyle}>
              <label style={bidInputLabelStyle}>Your Bid (Min: ${minBid})</label>
              <div style={bidInputRowStyle}>
                <button 
                  style={quickBidButtonStyle}
                  onClick={() => setBidAmount(minBid)}
                >
                  Min
                </button>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Math.max(minBid, parseInt(e.target.value) || minBid))}
                  style={bidInputFieldStyle}
                  min={minBid}
                  step={auction.minIncrement}
                />
                <button 
                  style={quickBidButtonStyle}
                  onClick={() => setBidAmount(Math.min(currentPlayer.cash, bidAmount + 50))}
                >
                  +$50
                </button>
              </div>
            </div>

            <div style={actionButtonsStyle}>
              <button 
                style={{...bidButtonStyle, ...(canBid ? {} : disabledButtonStyle)}}
                onClick={handleBid}
                disabled={!canBid}
              >
                Bid ${bidAmount}
              </button>
              <button 
                style={passButtonStyle}
                onClick={onPass}
              >
                Pass
              </button>
            </div>
            
            {!canBid && bidAmount >= minBid && (
              <div style={warningStyle}>
                ⚠️ Insufficient funds (Available: ${currentPlayer.cash})
              </div>
            )}
          </div>
        )}
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
  backdropFilter: 'blur(6px)'
}

const modalStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #2c3e50 0%, #34495e 100%)',
  borderRadius: 20,
  padding: 24,
  maxWidth: 600,
  width: '95%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
  color: 'white',
  animation: 'slideUp 0.3s ease-out'
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  paddingBottom: 16,
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 'bold'
}

const timerStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 'bold'
}

const propertyCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
  textAlign: 'center'
}

const propertyNameStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 8
}

const propertyDetailsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  fontSize: 14
}

const propertyTypeStyle: React.CSSProperties = {
  opacity: 0.9
}

const propertyPriceStyle: React.CSSProperties = {
  fontWeight: 'bold'
}

const propertyRentStyle: React.CSSProperties = {
  opacity: 0.9
}

const bidStatusStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20
}

const currentBidStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12
}

const bidLabelStyle: React.CSSProperties = {
  fontSize: 16,
  opacity: 0.8
}

const bidAmountStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#f39c12'
}

const bidderInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4
}

const bidderLabelStyle: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.8
}

const bidderNameStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#e74c3c'
}

const rationaleStyle: React.CSSProperties = {
  fontSize: 12,
  fontStyle: 'italic',
  opacity: 0.7,
  color: '#bdc3c7'
}

const participantsStyle: React.CSSProperties = {
  marginBottom: 20
}

const participantsHeaderStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 12,
  opacity: 0.9
}

const participantsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 8
}

const participantStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 8,
  padding: 12,
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}

const leadingBidderStyle: React.CSSProperties = {
  background: 'rgba(231, 76, 60, 0.2)',
  border: '1px solid #e74c3c'
}

const activePlayerStyle: React.CSSProperties = {
  background: 'rgba(52, 152, 219, 0.2)',
  border: '1px solid #3498db'
}

const participantNameStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 4
}

const participantCashStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#27ae60',
  marginBottom: 4
}

const participantStatusStyle: React.CSSProperties = {
  fontSize: 11,
  opacity: 0.8
}

const controlsStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: 20
}

const bidInputStyle: React.CSSProperties = {
  marginBottom: 16
}

const bidInputLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  marginBottom: 8,
  opacity: 0.9
}

const bidInputRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center'
}

const quickBidButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 12,
  cursor: 'pointer',
  transition: 'background 0.2s'
}

const bidInputFieldStyle: React.CSSProperties = {
  flex: 1,
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 6,
  padding: '10px 12px',
  color: 'white',
  fontSize: 16,
  textAlign: 'center'
}

const actionButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  marginBottom: 8
}

const bidButtonStyle: React.CSSProperties = {
  flex: 2,
  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
}

const passButtonStyle: React.CSSProperties = {
  flex: 1,
  background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s'
}

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
  background: '#7f8c8d'
}

const warningStyle: React.CSSProperties = {
  color: '#e74c3c',
  fontSize: 14,
  textAlign: 'center',
  marginTop: 8
}