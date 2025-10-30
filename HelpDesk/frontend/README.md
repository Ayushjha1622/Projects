# Helpdesk Frontend

A modern, responsive helpdesk application built with React, Vite, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure login and registration with JWT tokens
- 🎫 **Ticket Management**: Create, view, and manage support tickets
- 💬 **Comments**: Add comments to tickets with internal/external visibility
- 📊 **Dashboard**: Filter and search tickets by status, priority, and more
- 👥 **Role-Based Access**: Different permissions for users, agents, and admins
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Professional design with Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:3000/api
```

## Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Spinner.jsx
│   │   ├── Textarea.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TicketDetail.jsx
│   │   └── NewTicket.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env                  # Environment variables
└── package.json
```

## Features Overview

### Authentication
- Login and registration with email/password
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### Ticket Management
- Create new tickets with title, description, and priority
- View all tickets with filtering and search
- Update ticket status and priority (agents/admins only)
- Add comments to tickets
- Internal comments for agents/admins
- Timeline tracking of all ticket activities

### User Roles
- **User**: Can create tickets and view their own tickets
- **Agent**: Can view all tickets, update status/priority, and add internal comments
- **Admin**: Full access to all features

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Adaptive layouts

## API Integration

The frontend integrates with the backend API using Axios. All API calls are centralized in `src/services/api.js`:

- **Auth API**: Login, register, get current user
- **Tickets API**: CRUD operations for tickets
- **Comments API**: Add comments to tickets

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
