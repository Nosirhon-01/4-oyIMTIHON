# Movie Website Project

## Project Overview

This project is a movie streaming platform where users can watch movies, add them to favorites, and subscribe to plans. Admins and superadmins can manage movies and add new content.

## Database Structure

### Users Table

```txt
id: UUID PRIMARY KEY
username: VARCHAR(50) UNIQUE
email: VARCHAR(100) UNIQUE
password_hash: VARCHAR(255)
role: ENUM('user', 'admin', 'superadmin') DEFAULT 'user'
avatar_url: VARCHAR(255)
created_at: TIMESTAMP DEFAULT NOW()
```

### Profiles Table

```txt
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY REFERENCES users(id)
full_name: VARCHAR(100)
phone: VARCHAR(20)
country: VARCHAR(50)
created_at: TIMESTAMP DEFAULT NOW()
```

### Subscription_Plans Table

```txt
id: UUID PRIMARY KEY
name: VARCHAR(50)
price: DECIMAL(10, 2)
duration_days: INTEGER
features: JSON
is_active: BOOLEAN DEFAULT TRUE
```

### User_Subscriptions Table

```txt
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY REFERENCES users(id)
plan_id: UUID FOREIGN KEY REFERENCES subscription_plans(id)
start_date: TIMESTAMP DEFAULT NOW()
end_date: TIMESTAMP
status: ENUM('active', 'expired', 'canceled', 'pending_payment') DEFAULT 'pending_payment'
auto_renew: BOOLEAN DEFAULT FALSE
created_at: TIMESTAMP DEFAULT NOW()
```

### Payments Table

```txt
id: UUID PRIMARY KEY
user_subscription_id: UUID FOREIGN KEY REFERENCES user_subscriptions(id)
amount: DECIMAL(10, 2)
payment_method: ENUM('card', 'paypal', 'bank_transfer', 'crypto')
payment_details: JSON
status: ENUM('pending', 'completed', 'failed', 'refunded')
external_transaction_id: VARCHAR(100)
created_at: TIMESTAMP DEFAULT NOW()
```

### Categories Table

```txt
id: UUID PRIMARY KEY
name: VARCHAR(50)
slug: VARCHAR(50) UNIQUE
description: TEXT
```

### Movies Table

```txt
id: UUID PRIMARY KEY
title: VARCHAR(100)
slug: VARCHAR(100) UNIQUE
description: TEXT
release_year: INTEGER
duration_minutes: INTEGER
poster_url: VARCHAR(255)
rating: DECIMAL(3, 1)
subscription_type: ENUM('free', 'premium') DEFAULT 'free'
view_count: INTEGER DEFAULT 0
created_by: UUID FOREIGN KEY REFERENCES users(id)
created_at: TIMESTAMP DEFAULT NOW()
```

### Movie_Categories Table

```txt
id: UUID PRIMARY KEY
movie_id: UUID FOREIGN KEY REFERENCES movies(id)
category_id: UUID FOREIGN KEY REFERENCES categories(id)
```

### Movie_Files Table

```txt
id: UUID PRIMARY KEY
movie_id: UUID FOREIGN KEY REFERENCES movies(id)
file_url: VARCHAR(255)
quality: ENUM('240p', '360p', '480p', '720p', '1080p', '4K')
language: VARCHAR(20) DEFAULT 'uz'
```

### Favorites Table

```txt
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY REFERENCES users(id)
movie_id: UUID FOREIGN KEY REFERENCES movies(id)
created_at: TIMESTAMP DEFAULT NOW()
```

### Reviews Table

```txt
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY REFERENCES users(id)
movie_id: UUID FOREIGN KEY REFERENCES movies(id)
rating: INTEGER CHECK (rating >= 1 AND rating <= 5)
comment: TEXT
created_at: TIMESTAMP DEFAULT NOW()
```

### Watch_History Table

```txt
id: UUID PRIMARY KEY
user_id: UUID FOREIGN KEY REFERENCES users(id)
movie_id: UUID FOREIGN KEY REFERENCES movies(id)
watched_duration: INTEGER
watched_percentage: DECIMAL(5, 2)
last_watched: TIMESTAMP DEFAULT NOW()
```

## Roles and Permissions (RBAC)

### Superadmin Role

- Manage admins
- Manage subscription plans
- Modify system settings

### Admin Role

- Add, edit, and delete movies
- Manage categories
- Moderate user reviews

### User Role

- Edit profile information
- Watch movies according to subscription type
- Access free movies
- Add movies to favorites
- Leave reviews
- Purchase subscriptions

## API Endpoints

## Authentication

### POST `/api/auth/register`

Request:

```json
{
  "username": "alijon",
  "email": "alijon@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "alijon",
    "role": "user",
    "created_at": "2025-05-12T14:30:45Z"
  }
}
```

### POST `/api/auth/login`

Request:

```json
{
  "email": "alijon@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "alijon",
    "role": "user",
    "subscription": {
      "plan_name": "Free",
      "expires_at": null
    }
  }
}
```

Cookie: `auth_token` set

### POST `/api/auth/logout`

Response:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Cookie: `auth_token` cleared

## Profile

### GET `/api/profile`

Response:

```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Aliyev Vali",
    "phone": "+998901234567",
    "country": "Uzbekistan",
    "created_at": "2025-05-12T14:30:45Z",
    "avatar_url": "https://example.com/avatars/alijon.jpg"
  }
}
```

### PUT `/api/profile`

Request:

```json
{
  "full_name": "Aliyev Valijon",
  "phone": "+998901234567",
  "country": "Uzbekistan"
}
```

Response:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Aliyev Valijon",
    "phone": "+998901234567",
    "country": "Uzbekistan",
    "updated_at": "2025-05-12T15:45:30Z"
  }
}
```

## Subscriptions

### GET `/api/subscription/plans`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Free",
      "price": 0.0,
      "duration_days": 0,
      "features": ["SD quality movies", "With ads"]
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Premium",
      "price": 49.99,
      "duration_days": 30,
      "features": ["HD quality movies", "Ad-free", "New releases"]
    }
  ]
}
```

### POST `/api/subscription/purchase`

Request:

```json
{
  "plan_id": "550e8400-e29b-41d4-a716-446655440002",
  "payment_method": "card",
  "auto_renew": true,
  "payment_details": {
    "card_number": "4242XXXXXXXX4242",
    "expiry": "04/26",
    "card_holder": "ALIJON VALIYEV"
  }
}
```

Response:

```json
{
  "success": true,
  "message": "Subscription purchased successfully",
  "data": {
    "subscription": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "plan": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Premium"
      },
      "start_date": "2025-05-12T16:10:22Z",
      "end_date": "2025-06-11T16:10:22Z",
      "status": "active",
      "auto_renew": true
    },
    "payment": {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "amount": 49.99,
      "status": "completed",
      "external_transaction_id": "txn_123456789",
      "payment_method": "card"
    }
  }
}
```

### GET `/api/subscription/me`

Response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "plan_name": "Premium",
    "start_date": "2025-05-12T16:10:22Z",
    "end_date": "2025-06-11T16:10:22Z",
    "status": "active",
    "auto_renew": true
  }
}
```

### POST `/api/subscription/cancel`

Response:

```json
{
  "success": true,
  "message": "Subscription canceled successfully"
}
```

## Movies

### GET `/api/movies`

Query params: `page=1&limit=20&category=action&search=avengers&subscription_type=free`

Response:

```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "title": "Avengers: Infinity War",
        "slug": "avengers-infinity-war",
        "poster_url": "https://example.com/posters/infinity-war.jpg",
        "release_year": 2018,
        "rating": 8.5,
        "subscription_type": "free",
        "categories": ["Action", "Adventure", "Sci-Fi"]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

### GET `/api/movies/{movie_id}`

Response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "title": "Avengers: Infinity War",
    "slug": "avengers-infinity-war",
    "description": "After the events of previous films, the Avengers face their greatest threat.",
    "release_year": 2018,
    "duration_minutes": 149,
    "poster_url": "https://example.com/posters/infinity-war.jpg",
    "rating": 8.5,
    "subscription_type": "free",
    "view_count": 15423,
    "is_favorite": true,
    "categories": ["Action", "Adventure", "Sci-Fi"],
    "files": [
      {
        "quality": "480p",
        "language": "uz",
        "file_url": "https://example.com/files/infinity-war-480p.mp4"
      },
      {
        "quality": "720p",
        "language": "uz",
        "file_url": "https://example.com/files/infinity-war-720p.mp4"
      }
    ],
    "reviews": {
      "average_rating": 4.7,
      "count": 352
    }
  }
}
```

### GET `/api/movies/{movie_id}/files`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440095",
      "quality": "720p",
      "language": "uz",
      "file_url": "https://example.com/movies/avengers-720p.mp4"
    }
  ]
}
```

## Favorites

### GET `/api/favorites`

Response:

```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "title": "Avengers: Infinity War",
        "slug": "avengers-infinity-war",
        "poster_url": "https://example.com/posters/infinity-war.jpg",
        "release_year": 2018,
        "rating": 8.5,
        "subscription_type": "free"
      }
    ],
    "total": 12
  }
}
```

### POST `/api/favorites`

Request:

```json
{
  "movie_id": "550e8400-e29b-41d4-a716-446655440021"
}
```

Response:

```json
{
  "success": true,
  "message": "Movie added to favorites",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440070",
    "movie_id": "550e8400-e29b-41d4-a716-446655440021",
    "created_at": "2025-05-12T19:20:15Z"
  }
}
```

### DELETE `/api/favorites/{movie_id}`

Response:

```json
{
  "success": true,
  "message": "Movie removed from favorites"
}
```

## Reviews

### GET `/api/movies/{movie_id}/reviews`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440080",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "alijon"
      },
      "rating": 5,
      "comment": "Amazing movie!",
      "created_at": "2025-05-12T20:15:30Z"
    }
  ]
}
```

### POST `/api/movies/{movie_id}/reviews`

Request:

```json
{
  "rating": 5,
  "comment": "Amazing movie! Highly recommended."
}
```

Response:

```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440080",
    "movie_id": "550e8400-e29b-41d4-a716-446655440021",
    "rating": 5,
    "comment": "Amazing movie! Highly recommended.",
    "created_at": "2025-05-12T20:15:30Z"
  }
}
```

### DELETE `/api/movies/{movie_id}/reviews/{review_id}`

Response:

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

## Admin Panel

## Admin Movies

### GET `/api/admin/movies`

Response:

```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "title": "Avengers: Infinity War",
        "slug": "avengers-infinity-war",
        "release_year": 2018,
        "subscription_type": "free",
        "view_count": 15423,
        "review_count": 352,
        "created_at": "2024-01-15T10:30:00Z",
        "created_by": "admin1"
      }
    ],
    "total": 256
  }
}
```

### POST `/api/admin/movies`

Request (`multipart/form-data`):

```txt
title: New Movie
description: Movie description
release_year: 2024
duration_minutes: 120
subscription_type: premium
category_ids: ["id1", "id2"]
poster: <binary data>
```

Response:

```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440090",
    "title": "New Movie",
    "slug": "new-movie",
    "created_at": "2025-05-12T22:10:45Z"
  }
}
```

### PUT `/api/admin/movies/{movie_id}`

Request:

```json
{
  "title": "Updated Movie Title",
  "description": "Updated description",
  "subscription_type": "premium",
  "category_ids": ["id1", "id2"]
}
```

Response:

```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440090",
    "title": "Updated Movie Title",
    "updated_at": "2025-05-12T23:05:30Z"
  }
}
```

### DELETE `/api/admin/movies/{movie_id}`

Response:

```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

### POST `/api/admin/movies/{movie_id}/files`

Request (`multipart/form-data`):

```txt
file: <binary data>
quality: 720p
language: uz
```

Response:

```json
{
  "success": true,
  "message": "Movie file uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440095",
    "movie_id": "550e8400-e29b-41d4-a716-446655440090",
    "quality": "720p",
    "language": "uz",
    "file_url": "https://example.com/movies/new-movie-720p.mp4"
  }
}
```

### DELETE `/api/admin/movies/{movie_id}/files/{file_id}`

Response:

```json
{
  "success": true,
  "message": "Movie file deleted successfully"
}
```

## Admin Categories

### POST `/api/admin/categories`

Request:

```json
{
  "name": "Action",
  "description": "Action movies"
}
```

Response:

```json
{
  "success": true,
  "message": "Category created successfully"
}
```

### PUT `/api/admin/categories/{id}`

Request:

```json
{
  "name": "Adventure"
}
```

Response:

```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

### DELETE `/api/admin/categories/{id}`

Response:

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Admin Reviews

### GET `/api/admin/reviews`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440080",
      "movie_id": "550e8400-e29b-41d4-a716-446655440021",
      "rating": 1,
      "comment": "Spam review",
      "created_at": "2025-05-12T20:15:30Z"
    }
  ]
}
```

### DELETE `/api/admin/reviews/{id}`

Response:

```json
{
  "success": true,
  "message": "Review removed by admin"
}
```

## Admin Users (Superadmin)

### GET `/api/admin/users`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "alijon",
      "email": "alijon@example.com",
      "role": "user"
    }
  ]
}
```

### GET `/api/admin/users/{id}`

Response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "alijon",
    "email": "alijon@example.com",
    "role": "user",
    "profile": {
      "full_name": "Aliyev Vali",
      "phone": "+998901234567",
      "country": "Uzbekistan"
    }
  }
}
```

### PATCH `/api/admin/users/{id}/role`

Request:

```json
{
  "role": "admin"
}
```

Response:

```json
{
  "success": true,
  "message": "User role updated successfully"
}
```

### DELETE `/api/admin/users/{id}`

Response:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Admin Subscription Management (Superadmin)

### GET `/api/admin/subscription-plans`

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Premium",
      "price": 49.99,
      "duration_days": 30,
      "is_active": true
    }
  ]
}
```

### POST `/api/admin/subscription-plans`

Request:

```json
{
  "name": "Premium Plus",
  "price": 79.99,
  "duration_days": 30,
  "features": ["4K", "No ads", "Early access"],
  "is_active": true
}
```

Response:

```json
{
  "success": true,
  "message": "Subscription plan created successfully"
}
```

### PUT `/api/admin/subscription-plans/{id}`

Request:

```json
{
  "price": 59.99,
  "is_active": true
}
```

Response:

```json
{
  "success": true,
  "message": "Subscription plan updated successfully"
}
```

### DELETE `/api/admin/subscription-plans/{id}`

Response:

```json
{
  "success": true,
  "message": "Subscription plan deleted successfully"
}
```
