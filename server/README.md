# EduFlip Learning Management System API

Backend API for the EduFlip Learning Management System.

## Features

- Course Management
- User Management
- Enrollment Tracking
- Course Progress Tracking
- Category Management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS DynamoDB (local for development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the example:
   ```
   PORT=3000
   NODE_ENV=development
   CLERK_SECRET_KEY=your_clerk_secret_key
   S3_BUCKET_NAME=your_s3_bucket_name
   CLOUDFRONT_DOMAIN=your_cloudfront_domain
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

This project uses Swagger for API documentation. After starting the server, you can access the API documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides a visual interface to explore and test all available API endpoints.

## Environment Variables

- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment mode (development/production)
- `CLERK_SECRET_KEY`: Secret key for Clerk authentication
- `S3_BUCKET_NAME`: AWS S3 bucket name for file storage
- `CLOUDFRONT_DOMAIN`: CloudFront domain for serving files

## Auth

This API uses Clerk for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
