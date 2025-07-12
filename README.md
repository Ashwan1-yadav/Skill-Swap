# Skill Swap - Complete Platform

A full-stack web application for users to exchange skills and services. Built with Node.js, Express, MongoDB, and modern JavaScript.

## 🚀 Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- User profile management
- Public/private profile settings

### 🔄 Skill Swapping System
- Send and receive swap requests
- Accept/reject swap requests
- Track request status (pending, accepted, rejected)
- View swap history

### 💬 Feedback System
- Send feedback to other users
- View received feedback
- Edit and delete feedback
- Public feedback display

### 🎨 Frontend Interface
- Responsive HTML/CSS pages
- Modern user interface
- Interactive JavaScript API integration
- Real-time updates

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Skill-Swap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skill-swap
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=24h
   SESSION_SECRET=your-session-secret-key-change-this-in-production
   ```

4. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Run the application:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 Application URLs

- **Home Page:** http://localhost:3000/home
- **Login Page:** http://localhost:3000/login
- **User Profile:** http://localhost:3000/profile
- **Request List:** http://localhost:3000/requests
- **Send Request:** http://localhost:3000/send-request

## 🔗 API Endpoints

### Authentication
- `POST /userModel/signup` - User registration
- `POST /userModel/login` - User login
- `GET /userModel/profile` - Get user profile (authenticated)
- `PUT /userModel/profile` - Update user profile (authenticated)
- `DELETE /userModel/profile` - Delete user account (authenticated)

### User Management
- `GET /userModel` - Get all public users
- `GET /userModel/:id` - Get specific user profile

### Swap Requests
- `POST /swapReq` - Create new swap request
- `GET /swapReq` - Get user's swap requests
- `GET /swapReq/:id` - Get specific swap request
- `PUT /swapReq/:id` - Update swap request status
- `DELETE /swapReq/:id` - Delete swap request

### Feedback
- `POST /feedback` - Send feedback
- `GET /feedback` - Get user's feedback
- `GET /feedback/:id` - Get specific feedback
- `PUT /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback
- `GET /feedback/user/:userId` - Get feedback for specific user

## 📁 Project Structure

```
Skill-Swap/
├── config/
│   └── database.js          # Database configuration
├── Models/
│   ├── User.js              # User model
│   ├── swapReq.js           # Swap request model
│   └── FeedBack.js          # Feedback model
├── routes/
│   ├── index.js             # Home route
│   ├── users.js             # Basic user routes
│   ├── userModel.js         # User authentication & management
│   ├── swapReq.js           # Swap request routes
│   └── feedback.js          # Feedback routes
├── views/                   # Frontend HTML pages
│   ├── home page/
│   ├── login page/
│   ├── user profile page/
│   ├── request list page odd/
│   └── request sending page/
├── public/
│   ├── js/
│   │   └── api.js           # Frontend API integration
│   └── stylesheets/
├── app.js                   # Main application file
├── start.js                 # Application startup script
├── package.json             # Project dependencies
└── README.md               # Project documentation
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT token expiration time
- `SESSION_SECRET` - Session secret

### Database Setup
The application uses MongoDB with Mongoose ODM. Models include:
- **User:** name, email, password, location, skills, availability
- **SwapRequest:** fromUser, toUser, message, status, timestamps
- **Feedback:** fromUser, toUser, message, timestamps

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT and session secrets
4. Run: `npm start`

### Docker Deployment
```bash
# Build image
docker build -t skill-swap .

# Run container
docker run -p 3000:3000 skill-swap
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# API testing with tools like Postman or curl
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Happy Skill Swapping! 🎉** 