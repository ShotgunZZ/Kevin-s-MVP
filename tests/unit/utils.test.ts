// Unit tests for utility functions
// Run: npm run test

import { describe, it, expect } from '@jest/globals'
import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn() - className merger', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should handle undefined/null values', () => {
      const result = cn('valid-class', undefined, null, 'another-class')
      expect(result).toContain('valid-class')
      expect(result).toContain('another-class')
    })
  })
})

// TODO: Add more utility function tests as features are developed
