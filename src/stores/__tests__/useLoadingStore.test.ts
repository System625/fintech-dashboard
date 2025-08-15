import { describe, it, expect, beforeEach } from 'vitest'
import { useLoadingStore } from '../useLoadingStore'

describe('useLoadingStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLoadingStore.setState({
      global: { visible: false, message: 'Loading', counter: 0 },
      content: { visible: false, message: 'Loading content', counter: 0 }
    })
  })

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const state = useLoadingStore.getState()
      
      expect(state.global.visible).toBe(false)
      expect(state.global.message).toBe('Loading')
      expect(state.global.counter).toBe(0)
      expect(typeof state.showGlobal).toBe('function')
      expect(typeof state.hideGlobal).toBe('function')
      expect(typeof state.setGlobalMessage).toBe('function')
    })
  })

  describe('showGlobal method', () => {
    it('should make loading visible and increment counter', () => {
      const { showGlobal } = useLoadingStore.getState()
      
      showGlobal()
      
      const state = useLoadingStore.getState()
      expect(state.global.visible).toBe(true)
      expect(state.global.counter).toBe(1)
      expect(state.global.message).toBe('Loading')
    })

    it('should update message when provided', () => {
      const { showGlobal } = useLoadingStore.getState()
      
      showGlobal('Processing payment...')
      
      const state = useLoadingStore.getState()
      expect(state.global.visible).toBe(true)
      expect(state.global.counter).toBe(1)
      expect(state.global.message).toBe('Processing payment...')
    })

    it('should increment counter on multiple calls', () => {
      const { showGlobal } = useLoadingStore.getState()
      
      showGlobal('First operation')
      
      let state = useLoadingStore.getState()
      expect(state.global.counter).toBe(1)
      expect(state.global.visible).toBe(true)
      
      showGlobal('Second operation')
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(2)
      expect(state.global.visible).toBe(true)
      expect(state.global.message).toBe('Second operation')
    })

    it('should keep existing message when no new message provided', () => {
      const { showGlobal } = useLoadingStore.getState()
      
      showGlobal('Initial message')
      
      let state = useLoadingStore.getState()
      expect(state.global.message).toBe('Initial message')
      
      showGlobal() // No message provided
      
      state = useLoadingStore.getState()
      expect(state.global.message).toBe('Initial message')
      expect(state.global.counter).toBe(2)
    })
  })

  describe('hideGlobal method', () => {
    it('should decrement counter and hide when counter reaches 0', () => {
      const { showGlobal, hideGlobal } = useLoadingStore.getState()
      
      // Show loading first
      showGlobal('Processing...')
      
      let state = useLoadingStore.getState()
      expect(state.global.visible).toBe(true)
      expect(state.global.counter).toBe(1)
      
      // Hide loading
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.visible).toBe(false)
      expect(state.global.counter).toBe(0)
      expect(state.global.message).toBe('Loading') // Reset to default
    })

    it('should decrement counter but keep visible when counter > 0', () => {
      const { showGlobal, hideGlobal } = useLoadingStore.getState()
      
      // Show loading twice
      showGlobal('First operation')
      showGlobal('Second operation')
      
      let state = useLoadingStore.getState()
      expect(state.global.counter).toBe(2)
      expect(state.global.visible).toBe(true)
      
      // Hide once
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(1)
      expect(state.global.visible).toBe(true)
      expect(state.global.message).toBe('Second operation') // Should keep message
      
      // Hide again
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(0)
      expect(state.global.visible).toBe(false)
      expect(state.global.message).toBe('Loading') // Reset to default
    })

    it('should not go below 0 counter', () => {
      const { hideGlobal } = useLoadingStore.getState()
      
      // Try to hide when counter is already 0
      hideGlobal()
      
      let state = useLoadingStore.getState()
      expect(state.global.counter).toBe(0)
      expect(state.global.visible).toBe(false)
      
      // Try to hide again
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(0)
      expect(state.global.visible).toBe(false)
    })
  })

  describe('setGlobalMessage method', () => {
    it('should update message', () => {
      const { setGlobalMessage } = useLoadingStore.getState()
      
      setGlobalMessage('Uploading files...')
      
      const state = useLoadingStore.getState()
      expect(state.global.message).toBe('Uploading files...')
    })

    it('should default to "Loading" when empty string provided', () => {
      const { setGlobalMessage } = useLoadingStore.getState()
      
      setGlobalMessage('')
      
      const state = useLoadingStore.getState()
      expect(state.global.message).toBe('Loading')
    })

    it('should default to "Loading" when null/undefined provided', () => {
      const { setGlobalMessage } = useLoadingStore.getState()
      
      setGlobalMessage(null as any)
      
      let state = useLoadingStore.getState()
      expect(state.global.message).toBe('Loading')
      
      setGlobalMessage(undefined as any)
      
      state = useLoadingStore.getState()
      expect(state.global.message).toBe('Loading')
    })
  })

  describe('complex scenarios', () => {
    it('should handle mixed show/hide operations correctly', () => {
      const { showGlobal, hideGlobal } = useLoadingStore.getState()
      
      // Start multiple operations
      showGlobal('Operation 1')
      showGlobal('Operation 2')
      showGlobal('Operation 3')
      
      let state = useLoadingStore.getState()
      expect(state.global.counter).toBe(3)
      expect(state.global.visible).toBe(true)
      expect(state.global.message).toBe('Operation 3')
      
      // End one operation
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(2)
      expect(state.global.visible).toBe(true)
      
      // Add another operation while others are still running
      showGlobal('Operation 4')
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(3)
      expect(state.global.visible).toBe(true)
      expect(state.global.message).toBe('Operation 4')
      
      // End all operations
      hideGlobal()
      hideGlobal()
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.counter).toBe(0)
      expect(state.global.visible).toBe(false)
      expect(state.global.message).toBe('Loading')
    })

    it('should handle message updates during loading', () => {
      const { showGlobal, setGlobalMessage, hideGlobal } = useLoadingStore.getState()
      
      showGlobal('Initial operation')
      
      let state = useLoadingStore.getState()
      expect(state.global.message).toBe('Initial operation')
      
      // Update message while loading
      setGlobalMessage('Updated operation')
      
      state = useLoadingStore.getState()
      expect(state.global.message).toBe('Updated operation')
      expect(state.global.visible).toBe(true)
      expect(state.global.counter).toBe(1)
      
      // Hide should reset to default message
      hideGlobal()
      
      state = useLoadingStore.getState()
      expect(state.global.message).toBe('Loading')
      expect(state.global.visible).toBe(false)
    })
  })

  describe('state persistence', () => {
    it('should maintain state across multiple store accesses', () => {
      const { showGlobal, hideGlobal } = useLoadingStore.getState()
      
      // Update state
      showGlobal('Shared state')
      
      let state1 = useLoadingStore.getState()
      let state2 = useLoadingStore.getState()
      
      // Check state through both accesses
      expect(state2.global.visible).toBe(true)
      expect(state2.global.message).toBe('Shared state')
      expect(state2.global.counter).toBe(1)
      
      // Update through store
      hideGlobal()
      
      // Check state through both accesses
      state1 = useLoadingStore.getState()
      state2 = useLoadingStore.getState()
      expect(state1.global.visible).toBe(false)
      expect(state1.global.counter).toBe(0)
      expect(state2.global.visible).toBe(false)
      expect(state2.global.counter).toBe(0)
    })
  })
})