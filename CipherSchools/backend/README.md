# CipherStudio Backend

Backend API for CipherStudio - An online React IDE where users can create, edit, and preview React projects directly in the browser.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Package Manager**: pnpm

## 📋 Features

- ✅ User authentication (register, login)
- ✅ Project management (CRUD operations)
- ✅ File/folder management with nested structure
- ✅ Real-time file editing and autosave
- ✅ User profile and theme preferences
- ✅ Secure JWT-based authentication
- ✅ RESTful API design

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cipherstudio
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Run the development server:
```bash
pnpm dev
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register new user | Public |
| POST | `/users/login` | Login user | Public |
| GET | `/users/me` | Get current user | Private |
| PUT | `/users/profile` | Update user profile | Private |
| PUT | `/users/password` | Update password | Private |

#### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/projects` | Create new project | Private |
| GET | `/projects` | Get all user projects | Private |
| GET | `/projects/:id` | Get project with file tree | Private |
| PUT | `/projects/:id` | Update project | Private |
| DELETE | `/projects/:id` | Delete project | Private |
| POST | `/projects/:id/autosave` | Autosave project | Private |

#### Files

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/files` | Create file/folder | Private |
| GET | `/files/:id` | Get file/folder details | Private |
| PUT | `/files/:id` | Update file/folder | Private |
| DELETE | `/files/:id` | Delete file/folder | Private |
| GET | `/files/project/:projectId` | Get all project files | Private |
| PUT | `/files/:id/move` | Move file/folder | Private |

### Request/Response Examples

#### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "theme": "dark"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "theme": "dark"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Create Project
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My React App",
  "description": "A new React project"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "My React App",
    "description": "A new React project",
    "createdBy": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

#### Create File
```bash
POST /api/files
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "parentId": "...",
  "name": "Button.jsx",
  "type": "file",
  "content": "export default function Button() { return <button>Click me</button>; }"
}
```

#### Get Project with File Tree
```bash
GET /api/projects/:id
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "project": {
      "_id": "...",
      "title": "My React App",
      "description": "A new React project"
    },
    "files": [
      {
        "_id": "...",
        "name": "My React App",
        "type": "folder",
        "children": [
          {
            "_id": "...",
            "name": "src",
            "type": "folder",
            "children": [...]
          },
          {
            "_id": "...",
            "name": "public",
            "type": "folder",
            "children": [...]
          }
        ]
      }
    ]
  }
}
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── env.js           # Environment configuration
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── fileController.js
│   ├── middlewares/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── File.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── fileRoutes.js
│   ├── utils/
│   │   └── jwt.js           # JWT utilities
│   └── server.js            # Express app setup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  theme: String (enum: ['light', 'dark']),
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### File
```javascript
{
  projectId: ObjectId (ref: Project),
  parentId: ObjectId (ref: File) | null,
  name: String,
  type: String (enum: ['file', 'folder']),
  content: String,
  s3Key: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation
- CORS configuration
- Error handling

## 🧪 Testing

To test the API, you can use:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Any HTTP client

Example with cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📝 Scripts

```bash
# Development
pnpm dev

# Production
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

CipherStudio Team

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All contributors