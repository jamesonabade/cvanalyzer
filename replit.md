# CVAnalyzer - AI-Powered CV Analysis Platform

## Overview

CVAnalyzer is a full-stack web application that leverages Google's Gemini AI to provide intelligent analysis of curriculum vitae (CVs). The platform offers detailed feedback, scoring across multiple criteria, and personalized suggestions to help users improve their resumes and maximize their career opportunities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom dark theme and space-themed design
- **UI Components**: Radix UI components with shadcn/ui library
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **File Processing**: Multer for file uploads with memory storage

### Data Storage
- **Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Session Storage**: PostgreSQL-backed session store
- **File Storage**: In-memory processing (files not permanently stored)

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Management**: Secure cookie-based sessions with PostgreSQL backing
- **User Storage**: Complete user profile management with automatic upserts
- **Authorization**: Route-level protection with middleware

### AI Analysis Engine
- **AI Provider**: Google Gemini Pro model
- **Text Extraction**: Multi-format support (PDF, DOC, DOCX)
- **Validation**: AI-powered CV validation before analysis
- **Scoring Algorithm**: Six-dimensional scoring system:
  - Overall Score
  - Experience Score
  - Education Score
  - Skills Score
  - Languages Score
  - Format Score

### File Processing Pipeline
- **Upload Limits**: 10MB maximum file size
- **Supported Formats**: PDF, DOC, DOCX
- **Processing**: In-memory text extraction
- **Validation**: File type and content validation

### Database Schema
- **Users Table**: Profile information and authentication data
- **Sessions Table**: Secure session management
- **CV Analyses Table**: Complete analysis results with scores and feedback
- **CV Files Table**: File metadata and extracted content

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating their profile
2. **File Upload**: CV files are uploaded and validated for format and content
3. **Text Extraction**: File content is extracted and prepared for AI analysis
4. **AI Analysis**: Gemini AI processes the content and generates comprehensive feedback
5. **Score Calculation**: Multi-dimensional scoring across six key areas
6. **Data Storage**: Results are stored in PostgreSQL with full type safety
7. **Result Presentation**: Detailed analysis is presented with interactive UI components

## External Dependencies

### Core Dependencies
- **@google/generative-ai**: Gemini AI integration
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **express**: Web server framework
- **multer**: File upload handling

### UI Dependencies
- **@radix-ui**: Comprehensive UI component library
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Dependencies
- **typescript**: Type safety and development experience
- **vite**: Fast development and build tooling
- **tsx**: TypeScript execution for server development

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 via Replit modules
- **Database**: PostgreSQL 16 via Replit modules
- **Development Server**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with file watching

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Database**: Drizzle migrations for schema management
- **Deployment**: Replit autoscale deployment target

### Environment Configuration
- **Required Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`: AI service authentication
  - `SESSION_SECRET`: Session encryption key
  - `REPLIT_DOMAINS`: Authentication domain configuration
  - `ISSUER_URL`: OpenID Connect issuer (defaults to Replit)

## Changelog
```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```