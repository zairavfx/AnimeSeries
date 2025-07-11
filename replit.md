# OnAnimeSeries Tech Platform

## Overview

OnAnimeSeries is a premium technology platform that provides hosting, development, and digital solutions with a cyberpunk anime-tech aesthetic. The application features a dark-themed design with glassmorphism effects, animated elements, and a comprehensive admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for development and production
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom cyberpunk theme variables
- **UI Components**: Radix UI primitives with custom cyberpunk-styled components
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Authentication**: Replit OAuth integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with error handling middleware

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: WebSocket-enabled connection pooling

## Key Components

### Database Schema
- **User Management**: Users table with role-based access (super_admin, editor, viewer)
- **Content Management**: Pages, services, service plans, and navigation items
- **Media Handling**: Media files with metadata and organization
- **Site Configuration**: Dynamic settings and contact submissions
- **Activity Tracking**: Comprehensive audit logging system

### Authentication & Authorization
- **Provider**: Replit OAuth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with automatic cleanup
- **Role-Based Access**: Three-tier permission system for content management
- **Security**: CSRF protection and secure cookie configuration

### Content Management System
- **Dynamic Pages**: Full CRUD operations for website pages
- **Service Management**: Configurable service offerings with pricing plans
- **Media Library**: File upload and organization system
- **Navigation Control**: Dynamic menu structure management
- **Site Settings**: Global configuration management

### UI Component System
- **Design System**: Cyberpunk anime-tech theme with consistent color palette
- **Custom Components**: Glassmorphism cards, holographic borders, cyber buttons
- **Animation Effects**: Particle systems, gradient animations, hover effects
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: Replit OAuth → Session Creation → Role Assignment
2. **Content Fetching**: React Query → REST API → Database Query → Response
3. **Admin Operations**: Form Submission → Validation → Database Update → Cache Invalidation
4. **File Uploads**: Client Upload → Server Processing → Storage → Database Reference

### State Management
- **Server State**: TanStack Query with automatic caching and invalidation
- **Form State**: React Hook Form with real-time validation
- **UI State**: Local React state for component interactions
- **Session State**: Server-side session management with database persistence

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **passport & openid-client**: Authentication flow management

### Development Tools
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling framework
- **TypeScript**: Type safety across the application
- **Zod**: Runtime type validation and schema definition

### Third-Party Integrations
- **Replit Authentication**: OAuth provider for user management
- **Shadcn/ui**: Pre-built component library with customization
- **Lucide React**: Icon library for consistent visual elements

## Deployment Strategy

### Build Process
- **Development**: Vite dev server with hot module replacement
- **Production**: Vite build + esbuild for server bundling
- **Asset Optimization**: Automatic code splitting and compression

### Environment Configuration
- **Database**: Neon PostgreSQL with connection string configuration
- **Sessions**: Secure session management with configurable TTL
- **Authentication**: Replit OAuth with environment-based configuration

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Image optimization and lazy loading
- **Caching Strategy**: Aggressive caching with smart invalidation
- **Database Optimization**: Connection pooling and query optimization

The application is designed to be highly maintainable and scalable, with a clear separation of concerns between the frontend UI layer, backend API layer, and database storage layer. The admin panel provides comprehensive content management capabilities, while the public-facing site delivers a premium user experience with cyberpunk aesthetics.