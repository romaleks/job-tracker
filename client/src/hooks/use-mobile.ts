import * as React from 'react'

const MOBILE_BREAKPOINT = 870

const subscribeToMobileQuery = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
  )
  mediaQuery.addEventListener('change', onStoreChange)

  return () => mediaQuery.removeEventListener('change', onStoreChange)
}

const getMobileSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
const getServerMobileSnapshot = () => false

export function useIsMobile() {
  const isMobile = React.useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getServerMobileSnapshot,
  )

  return isMobile
}
