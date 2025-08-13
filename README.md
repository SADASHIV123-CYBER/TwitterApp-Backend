# TwitterApp Backend API

A Node.js + Express + MongoDB backend for a Twitter-like social media application.  
Supports user authentication, tweet creation, likes, comments, and more.

---

## 🚀 Features

- **User Management**
  - Register new users
  - Login with authentication token (HTTP-only cookie)

- **Tweet Management**
  - Create a tweet
  - Get all tweets
  - Get a tweet by ID
  - Update a tweet
  - Delete a tweet

- **Likes**
  - Like a tweet
  - Unlike a tweet

- **Comments**
  - Add a comment to a tweet
  - Delete a comment from a tweet

- **Validation & Error Handling**
  - Manual and schema-based validation
  - Centralized error responses
  - Mongoose ObjectId validation

---

## 📦 Tech Stack

- **Backend Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** HTTP-only cookies, custom middleware
- **Validation:** Custom validators & Zod
- **Logging:** Custom logger helper
- **File Uploads:** Multer + Cloudinary uploader
- **HTTP Status Codes:** [http-status-codes](https://www.npmjs.com/package/http-status-codes)

---

## 📂 API Endpoints

### **Auth**
| Method | Endpoint      | Description       |
|--------|--------------|-------------------|
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login` | Login and get auth token |

### **Tweets**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/v1/tweets` | Get all tweets |
| GET    | `/api/v1/tweets/:id` | Get a tweet by ID |
| POST   | `/api/v1/tweets` | Create a tweet |
| PUT    | `/api/v1/tweets/:id` | Update a tweet |
| DELETE | `/api/v1/tweets/:id` | Delete a tweet |

### **Likes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/tweets/:id/like` | Like a tweet |
| POST   | `/api/v1/tweets/:id/unlike` | Unlike a tweet |

### **Comments**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/v1/tweets/:id/comment` | Add a comment to a tweet |
| DELETE | `/api/v1/tweets/:tweetId/comment/:commentId` | Delete a comment from a tweet |

---

## 🛠 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/twitterapp-backend.git
cd twitterapp-backend
