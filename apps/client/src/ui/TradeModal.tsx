import React, { useState, useEffect } from 'react'
import { GameState, Phase, TradeOffer, Player, TileKind } from '@monopoly/shared'

interface TradeModalProps {
  state: GameState
  onProposeTrade: (offer: TradeOffer) => void
  onAcceptTrade: () => void
  onRejectTrade: () => void
  getTradeValue?: (offer: TradeOffer) => { fair: boolean; advantage: string }
  isMobile?: boolean
}

export const TradeModal: React.FC<TradeModalProps> = ({ 
  state, 
  onProposeTrade, 
  onAcceptTrade, 
  onRejectTrade,
  getTradeValue,
  isMobile 
}) => {
  const [activeTab, setActiveTab] = useState<'propose' | 'respond'>('propose')
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [offer, setOffer] = useState<Partial<TradeOffer>>({
    cashFrom: 0,
    cashTo: 0,
    tilesFrom: [],
    tilesTo: [],
    jailCardsFrom: 0,
    jailCardsTo: 0
  })

  const currentPlayerId = state.currentPlayer
  const currentPlayer = state.players[currentPlayerId]
  const isTradeActive = state.trade?.active && state.trade.offer
  const existingOffer = state.trade?.offer

  // Show modal if we can propose trades OR there's an active trade
  const canPropose = !isTradeActive && 
    (state.phase === Phase.PreRoll || state.phase === Phase.EndTurn) && 
    !state.auction?.active
  
  if (!canPropose && !isTradeActive) return null

  // Reset when trade becomes inactive
  useEffect(() => {
    if (!isTradeActive) {
      setActiveTab('propose')
      setSelectedPlayer(null)
      setOffer({
        cashFrom: 0,
        cashTo: 0,
        tilesFrom: [],
        tilesTo: [],
        jailCardsFrom: 0,
        jailCardsTo: 0
      })
    } else {
      setActiveTab('respond')
    }
  }, [isTradeActive])

  const getPlayerAssets = (playerId: number) => {
    const player = state.players[playerId]
    const ownedTiles = Object.entries(state.ownership)
      .filter(([_, ownership]) => ownership.owner === playerId)
      .map(([tileId]) => parseInt(tileId))
      .map(tileId => ({
        id: tileId,
        tile: state.board[tileId],
        ownership: state.ownership[tileId]
      }))

    return {
      cash: player.cash,
      properties: ownedTiles.filter(t => t.tile.kind === TileKind.Property),
      railroads: ownedTiles.filter(t => t.tile.kind === TileKind.Railroad),
      utilities: ownedTiles.filter(t => t.tile.kind === TileKind.Utility),
      jailCards: player.getOutOfJailCards
    }
  }

  const availablePlayers = state.players.filter((p, idx) => 
    idx !== currentPlayerId && !p.bankrupt
  )

  const toggleTileSelection = (tileId: number, isFromCurrent: boolean) => {
    const key = isFromCurrent ? 'tilesFrom' : 'tilesTo'
    const currentTiles = offer[key] || []
    const newTiles = currentTiles.includes(tileId)
      ? currentTiles.filter(id => id !== tileId)
      : [...currentTiles, tileId]
    
    setOffer(prev => ({ ...prev, [key]: newTiles }))
  }

  const handleCashChange = (amount: number, isFromCurrent: boolean) => {
    const key = isFromCurrent ? 'cashFrom' : 'cashTo'
    setOffer(prev => ({ ...prev, [key]: Math.max(0, amount) }))
  }

  const handleJailCardChange = (amount: number, isFromCurrent: boolean) => {
    const key = isFromCurrent ? 'jailCardsFrom' : 'jailCardsTo'
    const maxCards = isFromCurrent ? currentPlayer.getOutOfJailCards : 
      (selectedPlayer !== null ? state.players[selectedPlayer].getOutOfJailCards : 0)
    setOffer(prev => ({ ...prev, [key]: Math.max(0, Math.min(maxCards, amount)) }))
  }

  const canSubmitOffer = selectedPlayer !== null && (
    (offer.cashFrom || 0) > 0 || 
    (offer.cashTo || 0) > 0 || 
    (offer.tilesFrom || []).length > 0 || 
    (offer.tilesTo || []).length > 0 ||
    (offer.jailCardsFrom || 0) > 0 ||
    (offer.jailCardsTo || 0) > 0
  )

  const submitOffer = () => {
    if (selectedPlayer !== null && canSubmitOffer) {
      const fullOffer: TradeOffer = {
        from: currentPlayerId,
        to: selectedPlayer,
        cashFrom: offer.cashFrom || 0,
        cashTo: offer.cashTo || 0,
        tilesFrom: offer.tilesFrom || [],
        tilesTo: offer.tilesTo || [],
        jailCardsFrom: offer.jailCardsFrom || 0,
        jailCardsTo: offer.jailCardsTo || 0
      }
      onProposeTrade(fullOffer)
    }
  }

  const getTradeAnalysis = () => {
    if (!selectedPlayer || !getTradeValue) return null
    
    const fullOffer: TradeOffer = {
      from: currentPlayerId,
      to: selectedPlayer,
      cashFrom: offer.cashFrom || 0,
      cashTo: offer.cashTo || 0,
      tilesFrom: offer.tilesFrom || [],
      tilesTo: offer.tilesTo || [],
      jailCardsFrom: offer.jailCardsFrom || 0,
      jailCardsTo: offer.jailCardsTo || 0
    }
    
    return getTradeValue(fullOffer)
  }

  const renderAssetPicker = (playerId: number, label: string, isFromCurrent: boolean) => {
    const assets = getPlayerAssets(playerId)
    const selectedTiles = isFromCurrent ? (offer.tilesFrom || []) : (offer.tilesTo || [])
    const selectedCash = isFromCurrent ? (offer.cashFrom || 0) : (offer.cashTo || 0)
    const selectedJailCards = isFromCurrent ? (offer.jailCardsFrom || 0) : (offer.jailCardsTo || 0)

    return (
      <div style={assetPaneStyle}>
        <h4 style={assetPaneHeaderStyle}>{label}</h4>
        
        {/* Cash */}
        <div style={assetSectionStyle}>
          <div style={assetSectionHeaderStyle}>
            💰 Cash (Available: ${assets.cash})
          </div>
          <input
            type="number"
            value={selectedCash}
            onChange={(e) => handleCashChange(parseInt(e.target.value) || 0, isFromCurrent)}
            min={0}
            max={assets.cash}
            style={cashInputStyle}
            placeholder="Enter cash amount"
          />
        </div>

        {/* Properties */}
        {assets.properties.length > 0 && (
          <div style={assetSectionStyle}>
            <div style={assetSectionHeaderStyle}>🏠 Properties</div>
            <div style={assetGridStyle}>
              {assets.properties.map(({ id, tile, ownership }) => (
                <div
                  key={id}
                  style={{
                    ...assetItemStyle,
                    ...(selectedTiles.includes(id) && selectedAssetStyle),
                    ...(tile.kind === TileKind.Property && {
                      borderLeft: `4px solid ${getColorForGroup(tile.color)}`
                    })
                  }}
                  onClick={() => toggleTileSelection(id, isFromCurrent)}
                >
                  <div style={assetNameStyle}>{tile.name}</div>
                  {tile.kind === TileKind.Property && (
                    <>
                      <div style={assetPriceStyle}>${tile.price}</div>
                      <div style={assetDetailsStyle}>
                        {ownership.houses ? `${ownership.houses}🏠` : ''}
                        {ownership.hotel ? '🏨' : ''}
                        {ownership.mortgaged ? '🔒' : ''}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Railroads & Utilities */}
        {(assets.railroads.length > 0 || assets.utilities.length > 0) && (
          <div style={assetSectionStyle}>
            <div style={assetSectionHeaderStyle}>🚂 Railroads & Utilities</div>
            <div style={assetGridStyle}>
              {[...assets.railroads, ...assets.utilities].map(({ id, tile }) => (
                <div
                  key={id}
                  style={{
                    ...assetItemStyle,
                    ...(selectedTiles.includes(id) && selectedAssetStyle)
                  }}
                  onClick={() => toggleTileSelection(id, isFromCurrent)}
                >
                  <div style={assetNameStyle}>
                    {tile.kind === TileKind.Railroad ? '🚂' : '⚡'} {tile.name}
                  </div>
                  {tile.kind === TileKind.Railroad || tile.kind === TileKind.Utility ? (
                    <div style={assetPriceStyle}>${tile.price}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jail Cards */}
        {assets.jailCards > 0 && (
          <div style={assetSectionStyle}>
            <div style={assetSectionHeaderStyle}>
              🗝️ Get Out of Jail Free Cards (Available: {assets.jailCards})
            </div>
            <input
              type="number"
              value={selectedJailCards}
              onChange={(e) => handleJailCardChange(parseInt(e.target.value) || 0, isFromCurrent)}
              min={0}
              max={assets.jailCards}
              style={cashInputStyle}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className={isMobile ? 'modal-mobile trade-modal-mobile' : ''}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>🤝 Trade Center</h2>
          <div style={tabsStyle}>
            {!isTradeActive && (
              <button 
                style={{...tabStyle, ...(activeTab === 'propose' && activeTabStyle)}}
                onClick={() => setActiveTab('propose')}
              >
                Propose Trade
              </button>
            )}
            {isTradeActive && (
              <button style={{...tabStyle, ...activeTabStyle}}>
                Respond to Trade
              </button>
            )}
          </div>
        </div>

        {/* Propose Trade Tab */}
        {activeTab === 'propose' && !isTradeActive && (
          <div>
            {/* Player Selection */}
            <div style={playerSelectionStyle}>
              <div style={sectionHeaderStyle}>Select Trading Partner</div>
              <div style={playerGridStyle}>
                {availablePlayers.map(player => (
                  <button
                    key={player.id}
                    style={{
                      ...playerButtonStyle,
                      ...(selectedPlayer === player.id && selectedPlayerStyle)
                    }}
                    onClick={() => setSelectedPlayer(player.id)}
                  >
                    <div style={playerNameStyle}>{player.name}</div>
                    <div style={playerCashStyle}>${player.cash}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Pickers */}
            {selectedPlayer !== null && (
              <div style={tradePanesStyle}>
                {renderAssetPicker(currentPlayerId, `Your Offer (${currentPlayer.name})`, true)}
                {renderAssetPicker(selectedPlayer, `Request from ${state.players[selectedPlayer].name}`, false)}
              </div>
            )}

            {/* Trade Analysis */}
            {selectedPlayer !== null && (
              <div style={analysisStyle}>
                <div style={sectionHeaderStyle}>Trade Analysis</div>
                {getTradeAnalysis() && (
                  <div style={analysisContentStyle}>
                    {getTradeAnalysis()?.fair ? '✅ Fair trade' : '⚠️ Unbalanced trade'}
                    <span style={analysisDetailsStyle}>{getTradeAnalysis()?.advantage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div style={actionsStyle}>
              <button
                style={{...submitButtonStyle, ...(canSubmitOffer ? {} : disabledButtonStyle)}}
                onClick={submitOffer}
                disabled={!canSubmitOffer}
              >
                Propose Trade
              </button>
            </div>
          </div>
        )}

        {/* Respond Trade Tab */}
        {isTradeActive && existingOffer && (
          <div>
            <div style={offerHeaderStyle}>
              <div style={offerTitleStyle}>
                Trade Offer from {state.players[existingOffer.from].name}
              </div>
            </div>

            <div style={tradePanesStyle}>
              <div style={assetPaneStyle}>
                <h4 style={assetPaneHeaderStyle}>They Offer</h4>
                {existingOffer.cashFrom > 0 && (
                  <div style={offerItemStyle}>💰 ${existingOffer.cashFrom} cash</div>
                )}
                {existingOffer.tilesFrom.map(tileId => (
                  <div key={tileId} style={offerItemStyle}>
                    🏠 {state.board[tileId].name}
                  </div>
                ))}
                {existingOffer.jailCardsFrom > 0 && (
                  <div style={offerItemStyle}>🗝️ {existingOffer.jailCardsFrom} jail card(s)</div>
                )}
              </div>

              <div style={assetPaneStyle}>
                <h4 style={assetPaneHeaderStyle}>They Want</h4>
                {existingOffer.cashTo > 0 && (
                  <div style={offerItemStyle}>💰 ${existingOffer.cashTo} cash</div>
                )}
                {existingOffer.tilesTo.map(tileId => (
                  <div key={tileId} style={offerItemStyle}>
                    🏠 {state.board[tileId].name}
                  </div>
                ))}
                {existingOffer.jailCardsTo > 0 && (
                  <div style={offerItemStyle}>🗝️ {existingOffer.jailCardsTo} jail card(s)</div>
                )}
              </div>
            </div>

            <div style={actionsStyle}>
              <button style={acceptButtonStyle} onClick={onAcceptTrade}>
                Accept Trade
              </button>
              <button style={rejectButtonStyle} onClick={onRejectTrade}>
                Reject Trade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function for property colors
const getColorForGroup = (color: string): string => {
  const colorMap: Record<string, string> = {
    'Brown': '#8B4513',
    'LightBlue': '#87CEEB',
    'Purple': '#8A2BE2',
    'Orange': '#FFA500',
    'Red': '#FF0000',
    'Yellow': '#FFFF00',
    'Green': '#008000',
    'DarkBlue': '#00008B'
  }
  return colorMap[color] || '#ccc'
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
  maxWidth: 1000,
  width: '95%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
  color: 'white'
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  paddingBottom: 16,
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 'bold'
}

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8
}

const tabStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: 'pointer',
  transition: 'background 0.2s'
}

const activeTabStyle: React.CSSProperties = {
  background: 'rgba(52, 152, 219, 0.3)',
  border: '1px solid #3498db'
}

const playerSelectionStyle: React.CSSProperties = {
  marginBottom: 24
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 12,
  opacity: 0.9
}

const playerGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 12
}

const playerButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 8,
  padding: 12,
  color: 'white',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s'
}

const selectedPlayerStyle: React.CSSProperties = {
  background: 'rgba(52, 152, 219, 0.3)',
  border: '1px solid #3498db'
}

const playerNameStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 4
}

const playerCashStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#27ae60'
}

const tradePanesStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
  marginBottom: 24
}

const assetPaneStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)'
}

const assetPaneHeaderStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingBottom: 8,
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
}

const assetSectionStyle: React.CSSProperties = {
  marginBottom: 16
}

const assetSectionHeaderStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 8,
  opacity: 0.9
}

const cashInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 6,
  padding: 8,
  color: 'white',
  fontSize: 14
}

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 4
}

const assetItemStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 6,
  padding: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: 12
}

const selectedAssetStyle: React.CSSProperties = {
  background: 'rgba(52, 152, 219, 0.3)',
  border: '1px solid #3498db'
}

const assetNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginBottom: 2
}

const assetPriceStyle: React.CSSProperties = {
  color: '#f39c12',
  fontSize: 11
}

const assetDetailsStyle: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.8,
  marginTop: 2
}

const analysisStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 8,
  padding: 16,
  marginBottom: 24
}

const analysisContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12
}

const analysisDetailsStyle: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.8
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center'
}

const submitButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '14px 32px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
}

const acceptButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer'
}

const rejectButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer'
}

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed'
}

const offerHeaderStyle: React.CSSProperties = {
  marginBottom: 20,
  textAlign: 'center'
}

const offerTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#f39c12'
}

const offerItemStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 6,
  padding: 8,
  marginBottom: 4,
  fontSize: 14
}