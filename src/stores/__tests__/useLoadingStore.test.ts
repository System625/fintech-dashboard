import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLoadingStore } from '../useLoadingStore'

describe('useLoadingStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLoadingStore.setState({
      visible: false,
      message: 'Loading',
      counter: 0
    })
  })

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      expect(result.current.visible).toBe(false)
      expect(result.current.message).toBe('Loading')
      expect(result.current.counter).toBe(0)
      expect(typeof result.current.show).toBe('function')
      expect(typeof result.current.hide).toBe('function')
      expect(typeof result.current.setMessage).toBe('function')
    })
  })

  describe('show method', () => {
    it('should make loading visible and increment counter', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.show()
      })
      
      expect(result.current.visible).toBe(true)
      expect(result.current.counter).toBe(1)
      expect(result.current.message).toBe('Loading')
    })

    it('should update message when provided', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.show('Processing payment...')
      })
      
      expect(result.current.visible).toBe(true)
      expect(result.current.counter).toBe(1)
      expect(result.current.message).toBe('Processing payment...')
    })

    it('should increment counter on multiple calls', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.show('First operation')
      })
      
      expect(result.current.counter).toBe(1)
      expect(result.current.visible).toBe(true)
      
      act(() => {
        result.current.show('Second operation')
      })
      
      expect(result.current.counter).toBe(2)
      expect(result.current.visible).toBe(true)
      expect(result.current.message).toBe('Second operation')
    })

    it('should keep existing message when no new message provided', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.show('Initial message')
      })
      
      expect(result.current.message).toBe('Initial message')
      
      act(() => {
        result.current.show() // No message provided
      })
      
      expect(result.current.message).toBe('Initial message')
      expect(result.current.counter).toBe(2)
    })
  })

  describe('hide method', () => {
    it('should decrement counter and hide when counter reaches 0', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      // Show loading first
      act(() => {
        result.current.show('Processing...')
      })
      
      expect(result.current.visible).toBe(true)
      expect(result.current.counter).toBe(1)
      
      // Hide loading
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.visible).toBe(false)
      expect(result.current.counter).toBe(0)
      expect(result.current.message).toBe('Loading') // Reset to default
    })

    it('should decrement counter but keep visible when counter > 0', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      // Show loading twice
      act(() => {
        result.current.show('First operation')
      })
      act(() => {
        result.current.show('Second operation')
      })
      
      expect(result.current.counter).toBe(2)
      expect(result.current.visible).toBe(true)
      
      // Hide once
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(1)
      expect(result.current.visible).toBe(true)
      expect(result.current.message).toBe('Second operation') // Should keep message
      
      // Hide again
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(0)
      expect(result.current.visible).toBe(false)
      expect(result.current.message).toBe('Loading') // Reset to default
    })

    it('should not go below 0 counter', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      // Try to hide when counter is already 0
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(0)
      expect(result.current.visible).toBe(false)
      
      // Try to hide again
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(0)
      expect(result.current.visible).toBe(false)
    })
  })

  describe('setMessage method', () => {
    it('should update message', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.setMessage('Uploading files...')
      })
      
      expect(result.current.message).toBe('Uploading files...')
    })

    it('should default to "Loading" when empty string provided', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.setMessage('')
      })
      
      expect(result.current.message).toBe('Loading')
    })

    it('should default to "Loading" when null/undefined provided', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.setMessage(null as any)
      })
      
      expect(result.current.message).toBe('Loading')
      
      act(() => {
        result.current.setMessage(undefined as any)
      })
      
      expect(result.current.message).toBe('Loading')
    })
  })

  describe('complex scenarios', () => {
    it('should handle mixed show/hide operations correctly', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      // Start multiple operations
      act(() => {
        result.current.show('Operation 1')
      })
      act(() => {
        result.current.show('Operation 2')
      })
      act(() => {
        result.current.show('Operation 3')
      })
      
      expect(result.current.counter).toBe(3)
      expect(result.current.visible).toBe(true)
      expect(result.current.message).toBe('Operation 3')
      
      // End one operation
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(2)
      expect(result.current.visible).toBe(true)
      
      // Add another operation while others are still running
      act(() => {
        result.current.show('Operation 4')
      })
      
      expect(result.current.counter).toBe(3)
      expect(result.current.visible).toBe(true)
      expect(result.current.message).toBe('Operation 4')
      
      // End all operations
      act(() => {
        result.current.hide()
      })
      act(() => {
        result.current.hide()
      })
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.counter).toBe(0)
      expect(result.current.visible).toBe(false)
      expect(result.current.message).toBe('Loading')
    })

    it('should handle message updates during loading', () => {
      const { result } = renderHook(() => useLoadingStore())
      
      act(() => {
        result.current.show('Initial operation')
      })
      
      expect(result.current.message).toBe('Initial operation')
      
      // Update message while loading
      act(() => {
        result.current.setMessage('Updated operation')
      })
      
      expect(result.current.message).toBe('Updated operation')
      expect(result.current.visible).toBe(true)
      expect(result.current.counter).toBe(1)
      
      // Hide should reset to default message
      act(() => {
        result.current.hide()
      })
      
      expect(result.current.message).toBe('Loading')
      expect(result.current.visible).toBe(false)
    })
  })

  describe('state persistence', () => {
    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useLoadingStore())
      const { result: result2 } = renderHook(() => useLoadingStore())
      
      // Update state through first hook
      act(() => {
        result1.current.show('Shared state')
      })
      
      // Check state through second hook
      expect(result2.current.visible).toBe(true)
      expect(result2.current.message).toBe('Shared state')
      expect(result2.current.counter).toBe(1)
      
      // Update through second hook
      act(() => {
        result2.current.hide()
      })
      
      // Check state through first hook
      expect(result1.current.visible).toBe(false)
      expect(result1.current.counter).toBe(0)
    })
  })
})