import { useState, useEffect } from 'react'

export interface MobileInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  isLandscape: boolean
  screenWidth: number
  screenHeight: number
}

export const useMobile = (): MobileInfo => {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isLandscape: true,
        screenWidth: 1024,
        screenHeight: 768
      }
    }

    return calculateMobileInfo()
  })

  useEffect(() => {
    const handleResize = () => {
      setMobileInfo(calculateMobileInfo())
    }

    const handleOrientationChange = () => {
      // Delay to allow for orientation change to complete
      setTimeout(() => {
        setMobileInfo(calculateMobileInfo())
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return mobileInfo
}

function calculateMobileInfo(): MobileInfo {
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Device detection
  const isMobile = width <= 768
  const isTablet = width > 768 && width <= 1024
  const isDesktop = width > 1024
  
  // Touch device detection
  const isTouchDevice = 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0

  const isLandscape = width > height

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isLandscape,
    screenWidth: width,
    screenHeight: height
  }
}

// Mobile-specific performance settings
export const getMobilePerformanceSettings = (mobileInfo: MobileInfo) => {
  if (mobileInfo.isMobile) {
    return {
      shadows: false,
      physicsDice: false,
      antialias: false,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      reducedAnimations: true
    }
  }
  
  if (mobileInfo.isTablet) {
    return {
      shadows: true,
      physicsDice: true,
      antialias: true,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      reducedAnimations: false
    }
  }

  // Desktop settings
  return {
    shadows: true,
    physicsDice: true,
    antialias: true,
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    reducedAnimations: false
  }
}

// Touch gesture helpers
export const useTouchGestures = (onPan?: (deltaX: number, deltaY: number) => void, onPinch?: (delta: number) => void) => {
  useEffect(() => {
    if (!onPan && !onPinch) return

    let lastTouches: TouchList | null = null
    let lastDistance = 0

    const handleTouchStart = (e: TouchEvent) => {
      lastTouches = e.touches
      if (e.touches.length === 2 && onPinch) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        lastDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!lastTouches) return

      if (e.touches.length === 1 && lastTouches.length === 1 && onPan) {
        // Single finger pan
        const deltaX = e.touches[0].clientX - lastTouches[0].clientX
        const deltaY = e.touches[0].clientY - lastTouches[0].clientY
        onPan(deltaX, deltaY)
      } else if (e.touches.length === 2 && lastTouches.length === 2 && onPinch) {
        // Two finger pinch
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        const delta = currentDistance - lastDistance
        onPinch(delta)
        lastDistance = currentDistance
      }

      lastTouches = e.touches
    }

    const handleTouchEnd = () => {
      lastTouches = null
      lastDistance = 0
    }

    // Add passive listeners for better performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onPan, onPinch])
}

// CSS class helpers
export const getMobileClasses = (mobileInfo: MobileInfo) => {
  const classes: string[] = []
  
  if (mobileInfo.isMobile) {
    classes.push('mobile', 'mobile-performance')
    if (!mobileInfo.isLandscape) classes.push('mobile-portrait')
    if (mobileInfo.isLandscape) classes.push('mobile-landscape')
  }
  
  if (mobileInfo.isTablet) {
    classes.push('tablet')
  }
  
  if (mobileInfo.isTouchDevice) {
    classes.push('touch-device')
  }

  return classes.join(' ')
}