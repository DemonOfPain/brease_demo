# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Start development server
npm run dev

# Build the application  
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Commit with Commitizen (conventional commits)
npm run commit
```

### Git Hooks
Pre-commit hooks automatically run:
- Lint-staged (ESLint, Prettier)
- Full build verification

Use conventional commits via `npm run commit` or ensure commit messages follow the convention.

## Architecture Overview

This is a Next.js 14 CMS application with a sophisticated multi-tenant architecture supporting teams, sites, and environments.

### Core Domain Model
- **Teams** → own multiple **Sites**
- **Sites** → have multiple **Environments** (dev, staging, prod)
- **Environments** → contain **Pages**, **Collections**, **Media**, **Navigations**
- **Pages** → composed of **Sections** with drag-and-drop editing
- **Collections** → manage **Entries** (content items)

### Key Technical Patterns

#### State Management
Uses Zustand stores with interconnected state:
- `useUserStore` - Authentication, profile, 2FA
- `useSiteStore` - Sites, environments, pages, navigations
- `useEditorStore` - Page editor state and drafts
- `useBuilderStore` - Section builder state
- `useManagerStore` - Collection manager state
- `useAssistantStore` - AI assistant state
- `useMediaStore` - Media library management

#### API Structure
RESTful routes under `/api/teams/[team]/sites/[site]/environments/[environment]/`:
- Collections, entries, pages, sections, media, navigations, redirects
- All API calls use `fetchBreaseAPI` helper with automatic token handling

#### Authentication
NextAuth with custom credentials provider:
- Token stored in session
- 2FA support
- Email verification flow
- Role-based access control

#### Draft System
Three draft contexts for unsaved changes:
- `EditorDraftContext` - Page-level edits
- `BuilderDraftContext` - Section content edits  
- `ManagerDraftContext` - Collection entry edits

Drafts auto-sync and persist across navigation.

#### Component Architecture
- `/components/shadcn/ui/` - Radix UI primitives
- `/components/generic/` - Reusable form components
- `/components/dashboard/` - Dashboard-specific components
- `/components/editor/` - Page editor components
- `/components/editor/builder/` - Section builder components
- `/components/editor/manager/` - Collection manager components

### Important Implementation Details

#### Drag & Drop
Uses `@hello-pangea/dnd` for:
- Page sections reordering
- Navigation items organization
- Collection entries ordering
- Media library organization

#### Form Handling
React Hook Form + Zod validation throughout:
```typescript
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})
```

#### File Uploads
Media library supports image/video/audio with:
- Drag & drop upload
- Image cropping
- Automatic optimization via Sharp

#### Rich Text Editing
CKEditor 5 for content editing with custom configuration.

#### Code Editor
Monaco Editor for custom HTML/CSS/JS sections.

## Environment Variables

Required in `.env.local`:
- `API_URL` - Backend API endpoint
- `NEXTAUTH_URL` - App URL for authentication
- `NEXTAUTH_SECRET` - Session encryption key

## TypeScript Types

Main type definitions in `/types/interface/`:
- `user.ts` - User, authentication types
- `team.ts` - Team, subscription types  
- `site.ts` - Site, environment, page types
- `editor.ts` - Editor section types
- `builder.ts` - Builder content types
- `manager.ts` - Collection, entry types
- `media.ts` - Media library types
- `assistant.ts` - AI assistant types

## Testing Approach

Currently no test files present. When adding tests:
- Place unit tests alongside components
- Use React Testing Library for component tests
- Mock API calls with MSW or similar

## Common Tasks

### Adding a New Page
1. Create route in `/src/app/`
2. Add navigation item if needed
3. Implement page component with proper loading states

### Creating API Endpoints
1. Add route handler in `/src/app/api/`
2. Use `fetchBreaseAPI` for external API calls
3. Return NextResponse with proper status codes

### Adding Form Components
1. Define Zod schema for validation
2. Create form with `useForm` and `zodResolver`
3. Use generic form components from `/components/generic/form/`

### Implementing Drag & Drop
1. Import `useXDragAndDrop` hook (X = feature name)
2. Wrap items in DragDropContext
3. Handle onDragEnd for reordering