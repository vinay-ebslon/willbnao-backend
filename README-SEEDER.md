# Admin Seeder Setup Guide

This guide will help you set up secure admin authentication with a seeder.

## 📦 Installation

First, install the required dependencies:

```bash
cd willbnao-backend
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the `willbnao-backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/willbanao

# JWT Configuration (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Seeder Configuration (optional - defaults provided)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@willbanao.com
ADMIN_PASSWORD=Admin@123

# Server Port
PORT=5000
```

**⚠️ SECURITY WARNING:**

- Change `JWT_SECRET` to a strong random string in production
- Use a strong password for `ADMIN_PASSWORD` in production
- Never commit `.env` file to version control

## 🌱 Running the Seeder

To create the admin user, run:

```bash
npm run seed
```

This will:

1. Connect to your MongoDB database
2. Create an admin user with the credentials from `.env`
3. Hash the password securely using bcrypt
4. Display the created admin details

**Default Credentials (if not set in .env):**

- Email: `admin@willbanao.com`
- Password: `Admin@123`

**⚠️ Change the default password after first login!**

## 🚀 Usage

### 1. Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Login Endpoint

**POST** `/v1/auth/login`

Request Body:

```json
{
  "email": "admin@willbanao.com",
  "password": "Admin@123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "Admin User",
      "email": "admin@willbanao.com",
      "role": "admin"
    }
  }
}
```

### 3. Protected Routes

All protected routes require the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### 4. Get Current User

**GET** `/v1/auth/me` (Protected)

Returns the current authenticated admin user.

## 🔒 Security Features

- ✅ Passwords are hashed using bcrypt (salt rounds: 10)
- ✅ JWT tokens for secure authentication
- ✅ Password not returned in API responses
- ✅ Token expiration (default: 7 days)
- ✅ Protected routes with middleware

## 📝 Creating Additional Admins

To create additional admin users, you can:

1. **Modify the seeder** to accept different credentials
2. **Use the API** to create admins (requires authentication)
3. **Manually insert** into MongoDB (password must be hashed)

## 🛠️ Troubleshooting

### "Admin user already exists"

- The seeder won't create duplicate admins
- Delete the existing admin from MongoDB or use a different email

### "Cannot connect to MongoDB"

- Ensure MongoDB is running
- Check your `MONGO_URI` in `.env`

### "JWT_SECRET not defined"

- Add `JWT_SECRET` to your `.env` file
- Use a strong random string

## 📚 API Endpoints

- `POST /v1/auth/login` - Login
- `GET /v1/auth/me` - Get current user (Protected)

## 🔄 Next Steps

1. Run the seeder: `npm run seed`
2. Start the server: `npm run dev`
3. Test login from the admin frontend
4. Change default password after first login
