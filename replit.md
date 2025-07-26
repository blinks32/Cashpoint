# CashPoint Banking Application

## Overview

CashPoint is a full-stack digital banking application built with modern web technologies. It provides users with essential banking features including account management, transactions, KYC (Know Your Customer) verification, and a comprehensive dashboard for financial operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI components with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Replit-managed Neon serverless database)
- **Authentication**: Custom implementation with bcrypt for password hashing
- **Session Management**: Express sessions with MemoryStore (production-ready configuration)
- **Email Service**: Resend API integration for transactional emails

### Development Setup
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **Hot Reload**: Vite development server with HMR
- **TypeScript**: Strict configuration with path aliases for clean imports

## Key Components

### Authentication System
- Custom JWT-less authentication using session-based approach
- Password hashing with bcrypt (12 rounds)
- Protected routes with React context for user state management
- Local storage for session persistence

### Database Schema
- **Users**: Core user information with KYC status tracking
- **Accounts**: Multiple account types (checking, savings, investment) per user
- **Transactions**: Complete transaction history with reference numbers
- **Enums**: PostgreSQL enums for status fields ensuring data consistency

### UI/UX Design
- **Design System**: Shadcn/ui components with "new-york" style
- **Theme**: Dark theme with yellow accents for brand identity
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessibility**: Radix UI ensures WCAG compliance

## Data Flow

### User Registration Flow
1. User fills registration form on `/signup`
2. Backend validates and hashes password with bcrypt
3. User record created with default KYC status
4. Default checking account automatically created with unique account number
5. User redirected to KYC page for verification
6. Welcome email sent via Resend API integration

### Transaction Flow
1. User initiates transaction from dashboard
2. Frontend validates form data with React Hook Form
3. API endpoint processes transaction with reference number
4. Database updated with optimistic UI updates
5. React Query invalidates and refetches affected data

### KYC Process
1. Multi-step form collecting personal information
2. Document upload functionality (planned)
3. Data stored as JSON in user record
4. Status tracking (pending/approved/rejected)

## External Dependencies

### Database Integration
- **Replit PostgreSQL**: Built-in Replit-managed PostgreSQL database
- **Connection Pooling**: @neondatabase/serverless driver for compatibility
- **Migrations**: Drizzle Kit for schema management with `npm run db:push`

### Email Services
- **Resend**: Direct API integration for transactional emails
- **Welcome Emails**: Automated user and admin notifications on registration
- **Email Templates**: HTML email templates with CashPoint branding

### UI Libraries
- **Radix UI**: Comprehensive component library
- **Lucide React**: Icon library
- **React Hot Toast**: Notification system
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Build Process
1. **Client Build**: Vite bundles React app to `dist/public`
2. **Server Build**: esbuild compiles TypeScript server to `dist/index.js`
3. **Static Assets**: Client build served by Express in production

### Environment Configuration
- **Development**: Vite dev server with Express API proxy
- **Production**: Single Express server serving both API and static files
- **Database**: Environment variable for DATABASE_URL connection string

### Production Considerations
- **Session Storage**: Currently in-memory, should migrate to PostgreSQL sessions
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Security**: CORS headers, input validation, and secure password handling
- **Performance**: Query optimization with React Query caching and Drizzle prepared statements

### Scaling Approach
- **Database**: Neon serverless handles connection scaling automatically
- **Frontend**: Static assets can be served from CDN
- **API**: Express server can be horizontally scaled with session persistence
- **Monitoring**: Built-in request logging with response time tracking

The application follows modern full-stack development practices with type safety throughout the stack, proper separation of concerns, and a foundation ready for production deployment.