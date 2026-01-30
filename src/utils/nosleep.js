/**
 * NoSleep.js utility wrapper
 * Prevents screen from sleeping during timer
 */

import NoSleep from 'nosleep.js'

// Singleton instance
let noSleepInstance = null

function getNoSleepInstance() {
  if (!noSleepInstance) {
    noSleepInstance = new NoSleep()
  }
  return noSleepInstance
}

/**
 * Enable wake lock to prevent screen sleep
 * MUST be called from a user gesture (button click, touch event, etc.)
 */
export async function enableNoSleep() {
  try {
    const noSleep = getNoSleepInstance()
    await noSleep.enable()
    console.log('✓ NoSleep enabled - screen will stay awake')
    return true
  } catch (error) {
    console.error('Failed to enable NoSleep:', error)
    return false
  }
}

/**
 * Disable wake lock to allow screen sleep
 * Can be called anytime (no user gesture required)
 */
export async function disableNoSleep() {
  try {
    const noSleep = getNoSleepInstance()
    await noSleep.disable()
    console.log('✓ NoSleep disabled - screen can sleep')
  } catch (error) {
    console.error('Failed to disable NoSleep:', error)
  }
}

/**
 * Check if NoSleep is currently enabled
 */
export function isNoSleepEnabled() {
  return noSleepInstance && noSleepInstance.isEnabled
}
