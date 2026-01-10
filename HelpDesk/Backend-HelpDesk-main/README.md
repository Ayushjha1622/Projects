# Helpdesk Ticketing System

A comprehensive helpdesk ticketing system with SLA tracking, role-based access control, and real-time timeline logging.

## Features

- ✅ **Role-Based Access Control (RBAC)**: Three user roles - `user`, `agent`, and `admin`
- ✅ **SLA Tracking**: Automatic SLA deadline calculation and breach detection
- ✅ **Optimistic Locking**: Prevents concurrent update conflicts
- ✅ **Idempotency**: All POST requests support idempotency keys
- ✅ **Rate Limiting**: 60 requests per minute per user
- ✅ **Search**: Full-text search across tickets (title, description, comments)
- ✅ **Timeline Logging**: Complete audit trail of all ticket actions
- ✅ **Pagination**: Efficient pagination for all list endpoints
- ✅ **Threaded Comments**: Support for internal and public comments

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Package Manager**: pnpm

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- pnpm >= 8.x

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd helpdesk-backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your-secret-key-change-this-in-production

# SLA Configuration (in minutes)
SLA_LOW_PRIORITY=2880      # 48 hours
SLA_MEDIUM_PRIORITY=1440   # 24 hours
SLA_HIGH_PRIORITY=480      # 8 hours
SLA_CRITICAL_PRIORITY=240  # 4 hours

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
```

5. Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
mongod
```

6. Start the server:
```bash
# Development mode with auto-reload
pnpm dev

# Production mode
pnpm start
```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Error Response Format

All errors follow this standardized format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "field": "fieldName",
    "message": "Human-readable error message"
  }
}
```

Common error codes:
- `FIELD_REQUIRED` - Required field is missing
- `UNAUTHORIZED` - Authentication required or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT` - Too many requests
- `STALE_UPDATE` - Optimistic locking conflict
- `DUPLICATE_ENTRY` - Unique constraint violation
- `VALIDATION_ERROR` - Input validation failed

---

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Tickets

#### Create Ticket
```http
POST /api/tickets
Authorization: Bearer <token>
Idempotency-Key: unique-key-123
Content-Type: application/json

{
  "title": "Cannot login to account",
  "description": "I am unable to login. Getting 'Invalid credentials' error.",
  "priority": "high"
}
```

**Priority Options:** `low`, `medium`, `high`, `critical`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Cannot login to account",
  "description": "I am unable to login. Getting 'Invalid credentials' error.",
  "status": "open",
  "priority": "high",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "assignedTo": null,
  "slaDeadline": "2024-01-15T18:30:00.000Z",
  "slaBreached": false,
  "version": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Tickets (with Pagination & Filters)
```http
GET /api/tickets?limit=20&offset=0&status=open&priority=high&search=login&slaBreached=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20) - Number of items per page
- `offset` (optional, default: 0) - Number of items to skip
- `status` (optional) - Filter by status: `open`, `in_progress`, `resolved`, `closed`
- `priority` (optional) - Filter by priority: `low`, `medium`, `high`, `critical`
- `assignedTo` (optional) - Filter by assigned agent ID (use `null` for unassigned)
- `createdBy` (optional) - Filter by creator user ID
- `search` (optional) - Search in title, description, and comments
- `slaBreached` (optional) - Filter by SLA breach status: `true` or `false`

**Role-Based Filtering:**
- **Users**: Can only see their own tickets
- **Agents**: Can see tickets assigned to them or unassigned tickets
- **Admins**: Can see all tickets

**Response (200 OK):**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Cannot login to account",
      "description": "I am unable to login. Getting 'Invalid credentials' error.",
      "status": "open",
      "priority": "high",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "user@example.com",
        "role": "user"
      },
      "assignedTo": null,
      "slaDeadline": "2024-01-15T18:30:00.000Z",
      "slaBreached": false,
      "version": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0,
  "next_offset": null
}
```

#### Get Ticket by ID
```http
GET /api/tickets/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "ticket": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Cannot login to account",
    "description": "I am unable to login. Getting 'Invalid credentials' error.",
    "status": "open",
    "priority": "high",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "assignedTo": null,
    "slaDeadline": "2024-01-15T18:30:00.000Z",
    "slaBreached": false,
    "version": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "ticketId": "507f1f77bcf86cd799439012",
      "content": "We are looking into this issue.",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Agent Smith",
        "email": "agent@helpdesk.com",
        "role": "agent"
      },
      "isInternal": false,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "timeline": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "ticketId": "507f1f77bcf86cd799439012",
      "action": "created",
      "performedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "user@example.com",
        "role": "user"
      },
      "details": {
        "title": "Cannot login to account",
        "priority": "high"
      },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Update Ticket (Agents & Admins Only)
```http
PATCH /api/tickets/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "critical",
  "assignedTo": "507f1f77bcf86cd799439014",
  "version": 0
}
```

**Required Field:**
- `version` - Current version number for optimistic locking

**Optional Fields:**
- `status` - New status: `open`, `in_progress`, `resolved`, `closed`
- `priority` - New priority: `low`, `medium`, `high`, `critical`
- `assignedTo` - Agent user ID (use `null` to unassign)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Cannot login to account",
  "description": "I am unable to login. Getting 'Invalid credentials' error.",
  "status": "in_progress",
  "priority": "critical",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "assignedTo": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Agent Smith",
    "email": "agent@helpdesk.com",
    "role": "agent"
  },
  "slaDeadline": "2024-01-15T14:30:00.000Z",
  "slaBreached": false,
  "version": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Optimistic Locking Error (409 Conflict):**
```json
{
  "error": {
    "code": "STALE_UPDATE",
    "message": "Ticket has been modified by another user. Please refresh and try again.",
    "currentVersion": 2
  }
}
```

---

### Comments

#### Add Comment to Ticket
```http
POST /api/tickets/507f1f77bcf86cd799439012/comments
Authorization: Bearer <token>
Idempotency-Key: unique-key-456
Content-Type: application/json

{
  "content": "We are looking into this issue.",
  "isInternal": false
}
```

**Fields:**
- `content` (required) - Comment text
- `isInternal` (optional, default: false) - Only agents/admins can create internal comments

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "ticketId": "507f1f77bcf86cd799439012",
  "content": "We are looking into this issue.",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Agent Smith",
    "email": "agent@helpdesk.com",
    "role": "agent"
  },
  "isInternal": false,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

#### Get Comments for Ticket
```http
GET /api/tickets/507f1f77bcf86cd799439012/comments?limit=50&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 50) - Number of items per page
- `offset` (optional, default: 0) - Number of items to skip

**Note:** Users cannot see internal comments; only agents and admins can.

**Response (200 OK):**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "ticketId": "507f1f77bcf86cd799439012",
      "content": "We are looking into this issue.",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Agent Smith",
        "email": "agent@helpdesk.com",
        "role": "agent"
      },
      "isInternal": false,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0,
  "next_offset": null
}
```

---

## SLA Configuration

SLA deadlines are automatically calculated based on ticket priority:

| Priority | Default SLA | Environment Variable |
|----------|-------------|---------------------|
| Low | 48 hours (2880 min) | `SLA_LOW_PRIORITY` |
| Medium | 24 hours (1440 min) | `SLA_MEDIUM_PRIORITY` |
| High | 8 hours (480 min) | `SLA_HIGH_PRIORITY` |
| Critical | 4 hours (240 min) | `SLA_CRITICAL_PRIORITY` |

SLA breach detection:
- Automatically checked when fetching tickets
- `slaBreached` flag is set to `true` when current time exceeds `slaDeadline`
- Timeline event `sla_breached` is logged when breach is detected
- Resolved and closed tickets are not marked as breached

---

## Timeline Events

The system logs the following timeline events:

| Action | Description |
|--------|-------------|
| `created` | Ticket was created |
| `status_changed` | Ticket status was updated |
| `priority_changed` | Ticket priority was updated |
| `assigned` | Ticket was assigned to an agent |
| `unassigned` | Ticket was unassigned |
| `comment_added` | Comment was added to ticket |
| `resolved` | Ticket was marked as resolved |
| `closed` | Ticket was closed |
| `reopened` | Ticket was reopened |
| `sla_breached` | SLA deadline was breached |

---

## Test User Credentials

You can create test users with different roles:

### Admin
```json
{
  "email": "admin@helpdesk.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

### Agent
```json
{
  "email": "agent@helpdesk.com",
  "password": "agent123",
  "name": "Agent Smith",
  "role": "agent"
}
```

### User
```json
{
  "email": "user@example.com",
  "password": "user123",
  "name": "John Doe",
  "role": "user"
}
```

---

## Development

### Available Scripts

```bash
# Start development server with auto-reload
pnpm dev

# Start production server
pnpm start

# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test
```

### Project Structure

```
helpdesk-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── ticketController.js  # Ticket CRUD operations
│   │   └── commentController.js # Comment operations
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── idempotency.js       # Idempotency handling
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Ticket.js            # Ticket schema
│   │   ├── Comment.js           # Comment schema
│   │   └── Timeline.js          # Timeline schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── tickets.js           # Ticket & comment routes
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## Rate Limiting

- **Limit**: 60 requests per minute per user
- **Window**: 1 minute (60,000 ms)
- **Key**: User ID (authenticated) or IP address (unauthenticated)
- **Response**: 429 Too Many Requests

```json
{
  "error": {
    "code": "RATE_LIMIT",
    "message": "Too many requests, please try again later"
  }
}
```

---

## Idempotency

All POST requests require an `Idempotency-Key` header to prevent duplicate operations:

```http
POST /api/tickets
Idempotency-Key: unique-key-123
```

- Keys are stored for 24 hours
- Duplicate requests with the same key return the cached response
- Only successful responses (2xx) are cached

---

## CORS

CORS is enabled for all origins during development. Configure appropriately for production.

---

## License

MIT

---

## Support

For issues and questions, please create a ticket in the system or contact the development team.