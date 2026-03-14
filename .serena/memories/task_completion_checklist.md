# What To Do When a Task Is Completed

After finishing an implementation task, run these checks:

1. **TypeScript check**: `npm run build` (catches type errors during static export build)
2. **Lint**: `npm run lint` (ESLint via next lint)
3. **Tests**: `npm test` (Vitest test suite)

## Additional considerations
- Ensure new components follow barrel export pattern (add to `index.ts`)
- Verify new UI primitives are added to `src/components/ui/index.ts`
- If rgba CSS values were added, they must be in `:root` not `@theme`
- If adding interactive elements, ensure keyboard navigation and focus-visible styles
- Never use raw `<button>` — use the `Button` component
