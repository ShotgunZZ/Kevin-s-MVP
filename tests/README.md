# Tests Directory

This directory contains all test files for the Members Portal MVP.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual functions and components
└── integration/    # Integration tests for user flows and API routes
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Testing Framework

- **Framework:** Jest
- **React Testing:** React Testing Library
- **Type Support:** TypeScript

## Test Files to Create

### Unit Tests
- [ ] `lib/utils.test.ts` - Test utility functions
- [ ] `lib/errors.test.ts` - Test error classes
- [ ] Form validation schemas

### Integration Tests
- [ ] Auth flow (sign-up, sign-in, sign-out)
- [ ] Ticket CRUD operations
- [ ] Profile updates
- [ ] Activity logging

## Example Test

```typescript
// tests/unit/example.test.ts
import { describe, it, expect } from '@jest/globals'

describe('Example Test Suite', () => {
  it('should pass this simple test', () => {
    expect(1 + 1).toBe(2)
  })
})
```

## Notes

- Tests will be implemented during feature development
- Each feature should have corresponding tests
- Aim for >70% code coverage on critical paths
