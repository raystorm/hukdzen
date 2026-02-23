# React Coding Standards

## Component Structure
- Use functional components with hooks
- Export component as default, types as named exports
- Define props interface above component
- Use `useCallback` for event handlers to prevent re-renders
- Use `useMemo` for expensive calculations

## Hooks Usage
- Follow hooks rules (only at top level)
- Use custom hooks for reusable logic
- Prefer `useAppSelector` and `useDispatch` from Redux Toolkit
- Use `useEffect` cleanup functions when needed

## JSX Patterns
- Use fragments (`<>`) instead of unnecessary divs
- Prefer conditional rendering with `&&` for simple cases
- Use ternary for if/else rendering
- Keep JSX readable - extract complex logic to variables
- Use semantic HTML elements when possible

## State Management
- Use Redux Toolkit for global state
- Use local state for component-specific data
- Follow existing slice patterns in the project