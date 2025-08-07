# Subscription Tracker API

A comprehensive REST API for managing and tracking subscriptions with automated reminders and workflow management capabilities.

## 🚀 Features

-   **User Authentication & Authorization** - Secure JWT-based authentication system
-   **Subscription Management** - CRUD operations for managing subscriptions
-   **Automated Reminders** - Email notifications for upcoming renewals
-   **Workflow Automation** - Automated workflows using Upstash
-   **Security** - Rate limiting and security middleware with Arcjet
-   **Email Integration** - Nodemailer for sending transactional emails
-   **MongoDB Integration** - NoSQL database for flexible data storage

## 📋 Table of Contents

-   [Installation](#installation)
-   [Environment Variables](#environment-variables)
-   [API Endpoints](#api-endpoints)
-   [Database Schema](#database-schema)
-   [Project Structure](#project-structure)
-   [Usage](#usage)
-   [Contributing](#contributing)

## 🛠 Installation

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (v4.4 or higher)
-   npm or yarn

### Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd subscription-tracker
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/subscription-tracker
    JWT_SECRET=your-super-secret-jwt-key
    NODE_ENV=development

    # Email configuration
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password

    # Arcjet configuration
    ARCJET_KEY=your-arcjet-key

    # Upstash configuration
    QSTASH_URL=https://qstash.upstash.io
    QSTASH_TOKEN=your-qstash-token
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Start the production server**
    ```bash
    npm start
    ```
                                           |

## 🎯 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/register` | Register a new user      |
| POST   | `/login`    | Login user               |
| POST   | `/logout`   | Logout user              |
| GET    | `/me`       | Get current user profile |

### User Routes (`/api/v1/users`)

| Method | Endpoint | Description                |
| ------ | -------- | -------------------------- |
| GET    | `/`      | Get all users (admin only) |
| GET    | `/:id`   | Get user by ID             |
| PUT    | `/:id`   | Update user                |
| DELETE | `/:id`   | Delete user                |

### Subscription Routes (`/api/v1/subcriptions`)

| Method | Endpoint        | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/`             | Get all subscriptions for authenticated user |
| POST   | `/`             | Create new subscription                      |
| GET    | `/:id`          | Get subscription by ID                       |
| PUT    | `/:id`          | Update subscription                          |
| DELETE | `/:id`          | Delete subscription                          |
| GET    | `/user/:userId` | Get subscriptions by user ID                 |

### Workflow Routes (`/api/v1/workflows`)

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| POST   | `/reminder` | Schedule reminder email   |
| POST   | `/cancel`   | Cancel scheduled workflow |

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  avatar: String,
  isVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  description: String,
  price: Number (required),
  currency: String (default: 'USD'),
  billingCycle: String (enum: ['monthly', 'quarterly', 'yearly']),
  startDate: Date (required),
  nextBillingDate: Date (required),
  status: String (enum: ['active', 'cancelled', 'expired']),
  category: String,
  website: String,
  logo: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create a new subscription

```bash
curl -X POST http://localhost:3000/api/v1/subcriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Netflix",
    "description": "Netflix Premium Plan",
    "price": 15.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "startDate": "2024-01-01",
    "nextBillingDate": "2024-02-01",
    "category": "Entertainment"
  }'
```

### Get all subscriptions

```bash
curl -X GET http://localhost:3000/api/v1/subcriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing

Currently, the project doesn't have automated tests. To test the API:

1. Use tools like Postman or Insomnia
2. Use curl commands as shown in the usage examples
3. Test all CRUD operations for subscriptions
4. Test authentication flow (register, login, logout)
5. Verify email notifications are sent correctly

