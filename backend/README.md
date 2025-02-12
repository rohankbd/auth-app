# Backend Service for Authentication

## Description

This backend service is designed to handle authentication and database operations. It provides APIs for user registration, login, password reset, and email verification.

## Features

- User registration
- User login
- Password reset
- Email verification
- Rate limiting
- JWT token generation and verification
- Bcrypt password hashing

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/rohankbd/auth-app.git
cd backend
```

Install the necessary dependencies:

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory and set the following environment variables:

```bash
PORT=5000
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

### Running the Application

Start the server:

```bash
npm start
```

The server will be available at `http://localhost:5000`

## API Documentation

You can import the Postman collection attached in the repo for a quick start to the backend.

The following endpoints are available:

- `POST /signup`: Registers a new user.
- `POST /login`: Authenticates a user.
- `POST /reset-password`: Initiates a password reset.
- `POST /verify-email`: Sends an email verification link.
- `POST /token`: Refreshes an access token.
- `POST /verify-username`: Verifies a username.

### API Endpoints

#### User Registration

```bash
POST /signup
{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
}
```

#### User Login

```bash
POST /login
{
    "username": "testuser",
    "password": "password123"
}
```

#### Verify Username

```bash
POST /verify-username
{
    "username": "testuser"
}
```

#### Reset Password

```bash
POST /reset-password
{
    "username": "testuser",
    "newPassword": "newpassword123"
}
```

#### Verify Email

```bash
POST /verify-email
{
    "username": "testuser",
    "email": "testuser@example.com"
}
```

#### Token Refresh

```bash
POST /token
{
    "token": "your_refresh_token"
}
```

### Database Setup

The application uses SQLite for the database. The database schema is defined in the `models` directory.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.
