import React, { useState, useEffect } from 'react'
import { GameState, Phase } from '@monopoly/shared'

interface TutorialStep {
  id: string
  phase: Phase | 'any'
  title: string
  description: string
  highlight?: string // CSS selector or element description
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  trigger?: (state: GameState) => boolean
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    phase: 'Setup',
    title: '🎲 Welcome to Monopoly!',
    description: 'Let\'s learn the basics. This tutorial will guide you through your first game. You can disable it anytime from the game menu.',
    position: 'center'
  },
  {
    id: 'board-overview',
    phase: 'TurnStart',
    title: '🗺️ The Board',
    description: 'This is the Monopoly board. You can click and drag to rotate the view, and scroll to zoom. Your token will move around the board automatically.',
    position: 'top'
  },
  {
    id: 'rolling-dice',
    phase: 'PreRoll',
    title: '🎲 Rolling Dice',
    description: 'Click "Roll Dice" to move around the board. The dice use realistic physics - they\'ll roll and show your movement!',
    highlight: 'Roll button',
    position: 'bottom'
  },
  {
    id: 'moving',
    phase: 'Move',
    title: '🚶 Movement',
    description: 'Watch your token move tile by tile. If you pass GO, you\'ll collect $200!',
    position: 'center'
  },
  {
    id: 'buy-decision',
    phase: 'BuyDecision',
    title: '🏠 Buying Properties',
    description: 'When you land on an unowned property, you can buy it for the listed price. Owning properties lets you collect rent from other players!',
    highlight: 'Purchase modal',
    position: 'center'
  },
  {
    id: 'rent-payment',
    phase: 'any',
    title: '💸 Paying Rent',
    description: 'When you land on another player\'s property, you pay rent. The amount depends on how many properties they own in that color group.',
    position: 'top',
    trigger: (state) => state.logs.some(e => e.type === 'Paid' && e.reason.includes('rent'))
  },
  {
    id: 'auction',
    phase: 'Auction',
    title: '🏛️ Auctions',
    description: 'If nobody buys a property, it goes to auction! Bid strategically - properties are valuable for building monopolies.',
    highlight: 'Auction modal',
    position: 'center'
  },
  {
    id: 'cards',
    phase: 'any',
    title: '🃏 Chance & Community Chest',
    description: 'When you land on these spaces, you\'ll draw a card with special effects. Some help you, others might cost money!',
    position: 'center',
    trigger: (state) => state.logs.some(e => e.type === 'DrewCard')
  },
  {
    id: 'jail',
    phase: 'PreRoll',
    title: '🚔 Jail Mechanics',
    description: 'Being in jail isn\'t always bad - you can still collect rent! You can pay $50, use a Get Out of Jail Free card, or try to roll doubles.',
    highlight: 'Jail controls',
    position: 'bottom',
    trigger: (state) => state.players[state.currentPlayer]?.inJail
  },
  {
    id: 'trading',
    phase: 'any',
    title: '🤝 Trading',
    description: 'You can trade properties, cash, and jail cards with other players. Look for opportunities to complete color monopolies!',
    position: 'center',
    trigger: (state) => state.phase === Phase.PreRoll || state.phase === Phase.EndTurn
  },
  {
    id: 'building',
    phase: 'any',
    title: '🏗️ Building Houses & Hotels',
    description: 'When you own all properties in a color group, you can build houses and hotels to increase rent. Build evenly across the group!',
    position: 'top',
    trigger: (state) => {
      const player = state.players[state.currentPlayer]
      // Check if player has any monopolies
      const monopolies = Object.entries(state.ownership)
        .filter(([_, ownership]) => ownership.owner === player.id)
        .map(([tileId]) => state.board[parseInt(tileId)])
        .filter(tile => tile.kind === 'Property')
      return monopolies.length > 0
    }
  },
  {
    id: 'hud-info',
    phase: 'any',
    title: '📊 Game Information',
    description: 'The HUD shows your current cash, properties owned, and game phase. The event log tracks all game actions.',
    highlight: 'HUD and Event Log',
    position: 'left'
  },
  {
    id: 'completion',
    phase: 'any',
    title: '🎉 Tutorial Complete!',
    description: 'You\'re ready to play! Remember: build monopolies, trade strategically, and bankrupt your opponents to win. Good luck!',
    position: 'center'
  }
]

interface TutorialProps {
  state: GameState | null
  isVisible: boolean
  onToggle: () => void
  onComplete: () => void
  isMobile?: boolean
}

export const Tutorial: React.FC<TutorialProps> = ({ 
  state, 
  isVisible, 
  onToggle, 
  onComplete,
  isMobile 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [hasStarted, setHasStarted] = useState(false)

  const currentStep = tutorialSteps[currentStepIndex]
  const isLastStep = currentStepIndex === tutorialSteps.length - 1

  // Auto-advance based on game state and triggers
  useEffect(() => {
    if (!state || !isVisible || !hasStarted) return

    const step = tutorialSteps[currentStepIndex]
    
    // Check if current step should trigger
    const shouldShow = step.phase === 'any' || 
      step.phase === state.phase ||
      (step.trigger && step.trigger(state))

    if (shouldShow && !completedSteps.has(step.id)) {
      // Step is now relevant, show it
      return
    }

    // Auto-advance if step is completed or no longer relevant
    if (completedSteps.has(step.id) || (step.phase !== 'any' && step.phase !== state.phase && !step.trigger)) {
      nextStep()
    }
  }, [state, currentStepIndex, completedSteps, isVisible, hasStarted])

  const nextStep = () => {
    if (isLastStep) {
      onComplete()
      return
    }
    
    setCompletedSteps(prev => new Set([...prev, currentStep.id]))
    setCurrentStepIndex(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const skipTutorial = () => {
    onComplete()
  }

  const startTutorial = () => {
    setHasStarted(true)
    setCurrentStepIndex(0)
    setCompletedSteps(new Set())
  }

  if (!isVisible) return null

  // Welcome screen before starting
  if (!hasStarted) {
    return (
      <div style={overlayStyle}>
        <div style={welcomeModalStyle}>
          <div style={welcomeHeaderStyle}>
            <h2>🎯 Tutorial Mode</h2>
            <p>Learn how to play Monopoly with interactive guidance</p>
          </div>
          
          <div style={welcomeContentStyle}>
            <div style={tutorialFeatureStyle}>
              <h4>📚 What you'll learn:</h4>
              <ul style={featureListStyle}>
                <li>Rolling dice and moving around the board</li>
                <li>Buying and managing properties</li>
                <li>Participating in auctions</li>
                <li>Trading with other players</li>
                <li>Handling Chance and Community Chest cards</li>
                <li>Jail mechanics and strategy</li>
                <li>Building houses and hotels</li>
              </ul>
            </div>
          </div>

          <div style={welcomeActionsStyle}>
            <button style={startTutorialButtonStyle} onClick={startTutorial}>
              Start Tutorial
            </button>
            <button style={skipTutorialButtonStyle} onClick={skipTutorial}>
              Skip & Play
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tutorial step display
  return (
    <div style={overlayStyle}>
      {/* Backdrop with highlight effect */}
      <div style={backdropStyle} onClick={nextStep} />
      
      {/* Tutorial step card */}
      <div style={{
        ...stepModalStyle,
        ...(currentStep.position === 'center' && centerPositionStyle),
        ...(currentStep.position === 'top' && topPositionStyle),
        ...(currentStep.position === 'bottom' && bottomPositionStyle),
        ...(currentStep.position === 'left' && leftPositionStyle),
        ...(currentStep.position === 'right' && rightPositionStyle)
      }} className={isMobile ? 'tutorial-mobile' : ''}>
        <div style={stepHeaderStyle}>
          <h3 style={stepTitleStyle}>{currentStep.title}</h3>
          <div style={stepCounterStyle}>
            {currentStepIndex + 1} / {tutorialSteps.length}
          </div>
        </div>

        <div style={stepContentStyle}>
          <p style={stepDescriptionStyle}>{currentStep.description}</p>
          
          {currentStep.highlight && (
            <div style={highlightHintStyle}>
              💡 Look for: {currentStep.highlight}
            </div>
          )}
        </div>

        <div style={stepActionsStyle}>
          {currentStepIndex > 0 && (
            <button style={prevButtonStyle} onClick={prevStep}>
              ← Previous
            </button>
          )}
          
          <div style={stepProgressStyle}>
            <div style={progressBarStyle}>
              <div 
                style={{
                  ...progressFillStyle,
                  width: `${((currentStepIndex + 1) / tutorialSteps.length) * 100}%`
                }}
              />
            </div>
          </div>

          <button 
            style={nextButtonStyle} 
            onClick={nextStep}
          >
            {isLastStep ? 'Finish' : 'Next →'}
          </button>
        </div>

        <button style={closeTutorialStyle} onClick={skipTutorial}>
          ✕ Close Tutorial
        </button>
      </div>
    </div>
  )
}

// Tutorial trigger hook for App component
export const useTutorial = (state: GameState | null) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(() => {
    return localStorage.getItem('monopoly-tutorial-completed') === 'true'
  })

  // Auto-enable tutorial for new games if not completed
  useEffect(() => {
    if (state && !hasCompletedTutorial && state.logs.length <= 3) {
      setIsEnabled(true)
    }
  }, [state, hasCompletedTutorial])

  const completeTutorial = () => {
    setIsEnabled(false)
    setHasCompletedTutorial(true)
    localStorage.setItem('monopoly-tutorial-completed', 'true')
  }

  const toggleTutorial = () => {
    setIsEnabled(!isEnabled)
  }

  return {
    isEnabled,
    hasCompletedTutorial,
    toggleTutorial,
    completeTutorial
  }
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  zIndex: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  cursor: 'pointer'
}

const welcomeModalStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  padding: 32,
  maxWidth: 500,
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  zIndex: 31
}

const welcomeHeaderStyle: React.CSSProperties = {
  marginBottom: 24
}

const welcomeContentStyle: React.CSSProperties = {
  marginBottom: 24,
  textAlign: 'left'
}

const tutorialFeatureStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  padding: 16
}

const featureListStyle: React.CSSProperties = {
  margin: '8px 0',
  paddingLeft: 20
}

const welcomeActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  justifyContent: 'center'
}

const startTutorialButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
  border: 'none',
  borderRadius: 12,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
}

const skipTutorialButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 12,
  padding: '14px 24px',
  color: 'white',
  fontSize: 16,
  cursor: 'pointer'
}

const stepModalStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #2c3e50 0%, #34495e 100%)',
  borderRadius: 16,
  padding: 24,
  maxWidth: 400,
  color: 'white',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
  position: 'relative',
  zIndex: 31,
  animation: 'tutorialPop 0.3s ease-out'
}

const centerPositionStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const topPositionStyle: React.CSSProperties = {
  position: 'fixed',
  top: 80,
  left: '50%',
  transform: 'translateX(-50%)'
}

const bottomPositionStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 80,
  left: '50%',
  transform: 'translateX(-50%)'
}

const leftPositionStyle: React.CSSProperties = {
  position: 'fixed',
  left: 80,
  top: '50%',
  transform: 'translateY(-50%)'
}

const rightPositionStyle: React.CSSProperties = {
  position: 'fixed',
  right: 80,
  top: '50%',
  transform: 'translateY(-50%)'
}

const stepHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
}

const stepTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 'bold'
}

const stepCounterStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 20,
  padding: '4px 12px',
  fontSize: 12,
  fontWeight: 'bold'
}

const stepContentStyle: React.CSSProperties = {
  marginBottom: 20
}

const stepDescriptionStyle: React.CSSProperties = {
  lineHeight: 1.5,
  margin: 0,
  fontSize: 14
}

const highlightHintStyle: React.CSSProperties = {
  background: 'rgba(241, 196, 15, 0.2)',
  border: '1px solid #f1c40f',
  borderRadius: 8,
  padding: 8,
  marginTop: 12,
  fontSize: 12,
  textAlign: 'center'
}

const stepActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12
}

const prevButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 8,
  padding: '8px 16px',
  color: 'white',
  fontSize: 14,
  cursor: 'pointer'
}

const nextButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
  cursor: 'pointer'
}

const stepProgressStyle: React.CSSProperties = {
  flex: 1,
  margin: '0 16px'
}

const progressBarStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 10,
  height: 6,
  overflow: 'hidden'
}

const progressFillStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)',
  height: '100%',
  transition: 'width 0.3s ease'
}

const closeTutorialStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'none',
  borderRadius: 6,
  width: 24,
  height: 24,
  color: 'white',
  cursor: 'pointer',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

// Add CSS animations
const tutorialCSS = `
@keyframes tutorialPop {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
`

// Inject CSS when component mounts
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = tutorialCSS
  document.head.appendChild(style)
}head.appendChild(style)
}