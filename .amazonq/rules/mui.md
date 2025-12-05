# Material-UI Standards

## Component Usage
- Use MUI components consistently
- Follow existing DataGrid patterns from `UserListPage`
- Use `tss-react` for custom styling (existing pattern)
- Prefer MUI theme values over hardcoded styles
- Use semantic HTML header tags (`<h1>`, `<h2>`, `<h3>`, etc.) instead of Typography components for headers
- Use Typography component only for body text, captions, and non-header content

## Styling Patterns
- Use `sx` prop for simple styles
- Use `tss-react` for complex component styles
- Follow existing responsive patterns
- Use MUI breakpoints for responsive design

## Data Grid
- Follow existing column definition patterns
- Use `GridToolbar` for consistent functionality
- Implement proper row selection handlers
- Use `columnVisibilityModel` for hidden columns