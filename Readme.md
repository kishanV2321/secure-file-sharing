# Secure File Sharing System

This project implements a secure file-sharing system using Node.js with Express and MongoDB. It allows two types of users (Operation User and Client User) to upload, download, and manage files securely.

## Important links

- [Postman Api Documentation](https://documenter.getpostman.com/view/34034032/2sA3XWdK3D)

## Features

- **Operation User Actions:**
  - Login
  - Upload File (pptx, docx, xlsx)

- **Client User Actions:**
  - Sign Up (returns an encrypted URL)
  - Email Verification (verification email sent to registered email)
  - Login
  - Download File (secure download with encrypted URL)
  - List all uploaded files

## Technologies Used

- Node.js
- Express.js
- MongoDB (NoSQL Database)
- JWT (JSON Web Tokens) for authentication
- Bcrypt for password encryption
- Postman for API testing

## Setup

### Prerequisites

- Node.js installed on your local machine
- MongoDB installed and running locally or accessible remotely
- Postman (or any API testing tool) for testing APIs

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kishanV2321/secure-file-sharing.git
   ```

2. Navigate into the project directory:

   ```bash
   cd secure-file-sharing
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb_url
     JWT_SECRET=your_jwt_secret_here
     JWT_SECRET_EXPIRY=1d
     CORS_ORIGIN=*
    DOMAIN=http://localhost:3000
    ACCESS_TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=
    REFRESH_TOKEN_EXPIRY=10d

     ```

5. Start the server:

   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:3000`.

## Usage

### API Endpoints

#### Operation User

- **POST /api/users/login**
  - Authenticate and log in as an Operation User.

- **POST /api/files/upload**
  - Upload a file (pptx, docx, xlsx).

#### Client User

- **POST /api/users/signup**
  - Sign up as a Client User and receive an encrypted URL.

- **GET /api/users/verify-email?token=verification_token**
  - Verify email with the received verification token.

- **POST /api/users/login**
  - Authenticate and log in as a Client User.

- **GET /api/files/download-file/:token**
  - Download a file using the secure download token.

- **GET /api/files/list**
  - List all uploaded files.

### Example Usage in Postman

1. **Sign Up as Client User:**
   - Send a `POST` request to `/api/users/signup` to receive an encrypted URL.

2. **Verify Email:**
   - Use the received verification URL to verify the email.

3. **Log In as Client User:**
   - Authenticate as a Client User using `POST` request to `/api/users/login`.

4. **Upload File as Operation User:**
   - Log in as an Operation User, then use `POST` request to `/api/files/upload`.

5. **Download File as Client User:**
   - Obtain a secure download token and use `GET` request to `/api/files/download-file/:token` to download the file.

## Contributors

- Kishan Verma (@your-github-username)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
