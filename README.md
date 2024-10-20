# Team Car Shop API Documentation

This API allows users to interact with car, brand, user, and review data. It also provides authentication and Swagger documentation for easy API exploration.

## Base URL:

[Site on Render](https://cse341-teamproject-carshop.onrender.com/)

## Swagger Documentation: 
Use the `/api-docs` route for an interactive view of all API endpoints and their expected parameters. Or try this link:
[Render site opened to Swagger Documentation ](https://cse341-teamproject-carshop.onrender.com/api-docs)

## Endpoints

### 1. **Authentication**

- **URL**: `/auth`
    
- **Method**: Various (depending on the authentication flow)
    
- **Description**: Manages user authentication and authorization.
    
- **Available Operations**:
    
    - `/login`
    - `/logout`

### 2. **Swagger API Documentation**

- **URL**: `/api-docs`
    
- **Method**: `GET`
    
- **Description**: Serves the Swagger UI to explore and test API endpoints interactively.
    
- **Usage**: Navigate to `/api-docs` in your browser to view and use the Swagger UI.
    

### 3. **Cars**

- **URL**: `/cars`
    
- **Method**: Various (`GET`, `POST`, `PUT`, `DELETE`)
    
- **Description**: Provides CRUD operations for car data.
    
- **Available Operations**:
    
    - `GET /cars`: Retrieves all cars.
    - `GET /cars/:id`: Retrieves a specific car by its ID.
    - `POST /cars`: Adds a new car.
    - `PUT /cars/:id`: Updates an existing car by its ID.
    - `DELETE /cars/:id`: Deletes a car by its ID.

### 4. **Brands**

- **URL**: `/brands`
    
- **Method**: Various (`GET`, `POST`, `PUT`, `DELETE`)
    
- **Description**: Provides CRUD operations for car brand data.
    
- **Available Operations**:
    
    - `GET /brands`: Retrieves all car brands.
    - `GET /brands/:id`: Retrieves a specific brand by its ID.
    - `POST /brands`: Adds a new brand.
    - `PUT /brands/:id`: Updates an existing brand by its ID.
    - `DELETE /brands/:id`: Deletes a brand by its ID.

### 5. **Users**

- **URL**: `/users`
    
- **Method**: Various (`GET`, `POST`, `PUT`, `DELETE`)
    
- **Description**: Manages user data and profiles.
    
- **Available Operations**:
    
    - `GET /users`: Retrieves all users.
    - `GET /users/:id`: Retrieves a specific user by their ID.
    - `PUT /users/:id`: Updates an existing user by their ID.
    - `DELETE /users/:id`: Deletes a user by their ID.

### 6. **Reviews**

- **URL**: `/reviews`
    
- **Method**: Various (`GET`, `POST`, `PUT`, `DELETE`)
    
- **Description**: Provides CRUD operations for user reviews of cars and brands.
    
- **Available Operations**:
    
    - `GET /reviews`: Retrieves all reviews.
    - `GET /reviews/:id`: Retrieves a specific review by its ID.
    - `POST /reviews`: Adds a new review.
    - `PUT /reviews/:id`: Updates an existing review by its ID.
    - `DELETE /reviews/:id`: Deletes a review by its ID.

### 7. **Home Route**

- **URL**: `/`
- **Method**: `GET`
- **Description**: Provides a simple welcome message.
- **Response**:
    - If the user is logged in: Returns a welcome message with the user's display name.
    - If the user is logged out: Returns a "Logged Out" message.

**Example Response**:
```
JohnDoe: Welcome to Team Car Shop
```

---

### Notes:

- **Authentication**: You need to be logged in to access certain routes (e.g., `POST`, `PUT`, and `DELETE` requests).

## Common Error Responses

- **400 Bad Request**: Invalid input.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Unexpected error.

### Created By

Tiffany Voorhees & Luke Briggs & Jonathan Aloya
