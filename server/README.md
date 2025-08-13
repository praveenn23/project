# Email Server for Smart Sarkari Sathi

This is the backend server that handles SMTP email sending for OTP functionality in the Smart Sarkari Sathi application.

## Features

- ✅ **SMTP Email Integration** - Uses Nodemailer for reliable email delivery
- ✅ **6-digit OTP Generation** - Secure random OTP generation
- ✅ **OTP Expiration** - 10-minute expiration for security
- ✅ **Attempt Limiting** - Maximum 3 attempts per OTP
- ✅ **Beautiful Email Templates** - Professional HTML email templates
- ✅ **CORS Support** - Cross-origin requests enabled
- ✅ **Error Handling** - Comprehensive error handling and logging

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Email Server Configuration
PORT=5000

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

### 3. Gmail Setup (Recommended)

For Gmail, you need to:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `.env` file

3. **Update .env file**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

### 4. Other Email Services

#### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-email-password
```

#### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-email-password
```

#### Custom SMTP
```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourprovider.com
   EMAIL_PASSWORD=your-email-password
```

### 5. Git Configuration

The project includes a comprehensive `.gitignore` file that excludes:

- ✅ **Environment files** (`.env`) - Keeps sensitive data secure
- ✅ **Dependencies** (`node_modules/`) - Can be reinstalled via npm
- ✅ **Log files** - Runtime logs and debug files
- ✅ **IDE files** - Editor-specific configuration files
- ✅ **OS files** - System-generated files
- ✅ **Build artifacts** - Temporary and build files

**Important:** Your `.env` file with sensitive data will be automatically ignored by Git.

### 6. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Send OTP
```http
POST /api/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

### 2. Verify OTP
```http
POST /api/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

### 3. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Email service is running"
}
```

## Email Template

The server sends beautifully formatted HTML emails with:

- ✅ **Branded Header** - Smart Sarkari Sathi branding
- ✅ **Large OTP Display** - Easy-to-read 6-digit OTP
- ✅ **Security Information** - Expiration time and security notes
- ✅ **Professional Design** - Clean, modern email design

## Security Features

- ✅ **OTP Expiration** - 10-minute automatic expiration
- ✅ **Attempt Limiting** - Maximum 3 attempts per OTP
- ✅ **Secure Storage** - OTPs stored in memory (not persistent)
- ✅ **Input Validation** - Comprehensive input validation
- ✅ **Error Handling** - Secure error messages

## Development

### Running in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Testing the API

You can test the API endpoints using tools like:

- **Postman**
- **cURL**
- **Thunder Client (VS Code extension)**

### Example cURL Commands

```bash
# Send OTP
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'

# Health check
curl http://localhost:5000/api/health
```

## Production Deployment

### Environment Variables for Production
```env
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your-production-email@gmail.com
EMAIL_APP_PASSWORD=your-production-app-password
NODE_ENV=production
```

### Deployment Options

1. **Heroku**
2. **Vercel**
3. **Railway**
4. **DigitalOcean**
5. **AWS EC2**

### Security Considerations

- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS in production
- ✅ Use app passwords instead of regular passwords
- ✅ Implement rate limiting for production
- ✅ Use Redis or database for OTP storage in production

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Check if 2-factor authentication is enabled
   - Verify app password is correct
   - Ensure email and password are correct

2. **"Connection timeout" error**
   - Check internet connection
   - Verify email service settings
   - Check firewall settings

3. **"OTP not received"**
   - Check spam folder
   - Verify email address is correct
   - Check email service configuration

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

This will log detailed information about email sending and OTP verification.

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your email service configuration
3. Test with a different email service
4. Check the troubleshooting section above

## License

MIT License - feel free to use this code for your projects! 