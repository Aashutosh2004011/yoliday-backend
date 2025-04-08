# Yoliday Backend

The server-side component of the Yoliday travel booking platform, providing robust API endpoints, database connections, and business logic.

## Overview

Yoliday Backend is built with Node.ts and Express, implementing a RESTful API structure to power the Yoliday travel booking platform. It handles user authentication, property listings, bookings, reviews, and payment processing with a focus on security, performance, and scalability.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Management**: Registration, authentication, profile management
- **Property Management**: CRUD operations for properties, filtering, and search
- **Booking System**: Create, update, and manage bookings
- **Review System**: Allow users to leave and view reviews
- **Payment Integration**: Secure payment processing
- **Image Upload**: Cloud-based image storage
- **Security**: JWT authentication, input validation, rate limiting
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: [Node.ts](https://nodejs.org/)
- **Framework**: [Express.ts](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JWT](https://jwt.io/) (JSON Web Tokens)
- **Validation**: [Express Validator](https://express-validator.github.io/)
- **File Upload**: [Multer](https://github.com/expressjs/multer) with [Cloudinary](https://cloudinary.com/)
- **Password Hashing**: [Bcrypt](https://github.com/kelektiv/node.bcrypt.ts)
- **API Testing**: [Postman](https://www.postman.com/)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Payment Processing**: [Stripe](https://stripe.com/)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)

## Getting Started

### Prerequisites

- Node.ts (v14.x or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aashu-king/yoliday-backend.git
   cd yoliday-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Connection
DB_HOST=localhost
DB_USER=root
DB_PASS=Aashutosh@123
DB_NAME=yoliday_projects
DIALECT=mysql
API_KEY=your_api_key
PORT=8080
ORIGIN=http://localhost:3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Running the Server

For development:

```bash
npm run migrate
npm run dev

The server will be running at `http://localhost:8080` (or the port you specified in your `.env` file).

## API Documentation

API endpoints are organized by resource type:

Cart Routes

POST /cart/ - Add an item to cart
GET /cart/ - Get all carts
GET /cart/:id - Get a specific cart by ID
PUT /cart/:id - Update a cart by ID
DELETE /cart/:id - Delete a cart by ID
GET /cart/user/:userId - Get cart belonging to a specific user
DELETE /cart/user/:userId/clear - Clear all items from a user's cart
GET /cart/user/:userId/project/:projectId - Get a specific project in a user's cart
DELETE /cart/user/:userId/project/:projectId - Remove a specific project from a user's cart

Category Routes

GET /category/ - Get all categories
GET /category/dropdown - Get categories for dropdown menu
GET /category/:id - Get a specific category by ID
GET /category/name/:name - Get a category by name
POST /category/ - Create a new category
PUT /category/:id - Update a category by ID
DELETE /category/:id - Delete a category by ID

Project Routes

GET /project/ - Get all projects
GET /project/:id - Get a specific project by ID
GET /project/category/:categoryId - Get projects by category
GET /project/author/:authorId - Get projects by author
POST /project/ - Create a new project
PUT /project/:id - Update a project by ID
DELETE /project/:id - Delete a project by ID

Role Routes

POST /role/ - Create a new role
GET /role/ - Get all roles
GET /role/:id - Get a specific role by ID
PUT /role/:id - Update a role by ID
DELETE /role/:id - Delete a role by ID
GET /role/name/:name - Get a role by name

User Routes

POST /user/ - Create a new user
GET /user/ - Get all users
GET /user/dropdown - Get users for dropdown menu
GET /user/:id - Get a specific user by ID
PUT /user/:id - Update a user by ID
DELETE /user/:id - Delete a user by ID
GET /user/email/:email - Get a user by email
GET /user/role/:roleId - Get users by role
POST /user/login - Authenticate a user

## Project Structure

```

yoliday-backend/src/
├── app/ # Route controllers
│ ├── cart
│ ├── ├──cart.controller.ts
│ ├── ├──cart.service.ts
│ ├── category
│ ├── ├──category.controller.ts
│ ├── ├──category.service.ts
│ ├── project
│ ├── ├──project.controller.ts
│ ├── ├──project.service.ts
│ ├── role
│ ├── ├──role.controller.ts
│ ├── ├──role.service.ts
│ ├── user
│ ├── ├──user.controller.ts
│ ├── ├──user.service.ts
├── database/ # Database models
│ ├── models
│ ├── ├──all the models files
│ ├── migrations
│ ├── ├──all the migrations files
│ ├── config
│ ├── ├──config.ts
│ ├── seeders
│ ├── ├──neccesary seeders are presnt
├── routes/ # API routes
│ ├── cart.route.ts
│ ├── category.route.ts
│ ├── project.route.ts
│ ├── role.route.ts
│ └── user.route.ts
├── routes/
│ ├── database.ts
├── index.ts # Express app setup
├── .env.example # Example environment variables
├── package.json # Project dependencies
└── README.md # Project documentation

```
## Authentication(Incomplete user table has been made but the completed it)

The application uses JWT-based authentication:
1. User registers or logs in and receives a JWT token
2. Token is stored as an HTTP-only cookie and/or in Authorization header
3. Protected routes verify the token before granting access
4. Role-based access control limits actions based on user roles

## Deployment

The backend is designed for deployment on various platforms:

### Heroku
1. Create a Heroku account and install Heroku CLI
2. Login to Heroku CLI: `heroku login`
3. Create a new Heroku app: `heroku create yoliday-backend`
4. Add Heroku remote: `heroku git:remote -a yoliday-backend`
5. Set environment variables in Heroku dashboard
6. Deploy: `git push heroku main`

### AWS/Digital Ocean
1. Provision a server with Node.ts installed
2. Set up a MongoDB instance or use MongoDB Atlas
3. Configure environment variables
4. Use PM2 for process management
5. Set up Nginx as a reverse proxy
6. Configure SSL with Let's Encrypt

## Contributing

We welcome contributions to improve Yoliday Backend! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Owner: [Aashu-king](https://github.com/Aashu-king)

Project Link: [https://github.com/Aashu-king/yoliday-backend](https://github.com/Aashu-king/yoliday-backend)


