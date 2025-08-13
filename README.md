# Sevika - Government Schemes & Scholarships Portal

A comprehensive platform for discovering government schemes and scholarships with AI-powered personalized recommendations.

## 🚀 Features

- **AI-Powered Recommendations**: Personalized schemes and scholarships based on user profile
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Multi-language Support**: English and Hindi
- **OTP Authentication**: Secure login system
- **Profile Management**: Complete user profile setup
- **Search & Filter**: Advanced search and filtering capabilities
- **News Hub**: Latest updates on schemes and scholarships

## 📁 Project Structure

```
sevika/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── context/           # React context providers
│   └── ...
├── backend/               # Express.js backend
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Frontend dependencies
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🔧 API Endpoints

### Authentication
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP and login
- `POST /logout` - Logout user

### User Profile
- `GET /profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Schemes & Scholarships
- `GET /api/schemes` - Get all schemes (for news page)
- `GET /api/scholarships` - Get all scholarships (for news page)
- `POST /api/schemes/personalized` - Get personalized schemes
- `POST /api/scholarships/personalized` - Get personalized scholarships

## 🎯 How It Works

### 1. Authentication Flow
1. User enters email on login page
2. OTP is sent to email (logged to console in development)
3. User enters OTP to verify and login
4. JWT token is generated and stored

### 2. Profile Setup
1. After login, user is redirected to profile setup
2. User fills in personal details (age, occupation, income, etc.)
3. Profile data is stored and used for recommendations

### 3. Personalized Recommendations
1. **News Page** (`/news`): Shows all available schemes and scholarships
2. **Schemes Page** (`/schemes`): Shows schemes matched to user profile
3. **Scholarships Page** (`/scholarships`): Shows scholarships matched to user profile

### 4. AI Integration (Future)
- Replace simple filtering logic in backend with LLM calls
- Add more sophisticated matching algorithms
- Implement confidence scores for recommendations

## 🔒 Security Features

- JWT token-based authentication
- CORS enabled for localhost
- Input validation on all endpoints
- Secure OTP generation and verification

## 🎨 UI Components

### Enhanced Design Features
- **Glassmorphism Effects**: Modern translucent cards
- **Gradient Backgrounds**: Beautiful color transitions
- **Hover Animations**: Smooth interactive effects
- **Responsive Layout**: Works on all screen sizes
- **Loading States**: Elegant loading animations

### Color Scheme
- **Primary**: Purple (#8B5CF6) to Pink (#EC4899)
- **Secondary**: Blue (#3B82F6) to Cyan (#06B6D4)
- **Success**: Green (#10B981) to Emerald (#059669)
- **Warning**: Orange (#F59E0B) to Red (#EF4444)

## 🚀 Development

### Frontend Development
```bash
# Start development server
npm start

# Build for production
npm run build
```

### Backend Development
```bash
# Start with nodemon (auto-restart on changes)
npm run dev

# Start production server
npm start
```

## 📝 Testing

### Test Login Flow
1. Start both frontend and backend servers
2. Go to `http://localhost:3000/login`
3. Enter any email (e.g., `test@example.com`)
4. Check console for OTP (e.g., `OTP for test@example.com: 123456`)
5. Enter the OTP to login

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Send OTP
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🔮 Future Enhancements

1. **Database Integration**: Replace in-memory storage with MongoDB/PostgreSQL
2. **LLM Integration**: Add AI-powered recommendation engine
3. **Email Service**: Implement actual email sending for OTP
4. **Admin Panel**: Add admin dashboard for managing schemes
5. **Real-time Updates**: Add WebSocket for live notifications
6. **Mobile App**: React Native version
7. **Analytics**: User behavior tracking and insights

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
- Create an issue on GitHub
- Check the console for error messages
- Verify both frontend and backend are running
- Ensure all dependencies are installed

---

**Note**: This is a development setup. For production, implement proper security measures, database storage, and email services.
