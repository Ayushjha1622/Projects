# User Registration Endpoint Documentation

## POST `/users/register`

Registers a new user in the system.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address, minimum 5 characters.
- `password` (string, required): Minimum 6 characters.

### Response

#### Success

  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // other user fields
    }
  }
  ```
  
**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY4YzJlMmIyZTRhMmExYzhkN2U5ZjEiLCJpYXQiOjE2OTQ0ODQwMDB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "user": {
    "_id": "64f8c2e2b2e4a2a1c8d7e9f1",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // other user fields
  }
}
```

#### Validation Error

  ```json
  {
    "errors": [
      {
        "msg": "first name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint creates a new user account. On success, it returns a JWT token and the user data. All required fields must
---

# User Login Endpoint Documentation

## POST `/users/login`

Authenticates a user and returns a JWT token if credentials are valid.

### Request Body

Send a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Response

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // other user fields
    }
  }
  ```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY4YzJlMmIyZTRhMmExYzhkN2U5ZjEiLCJpYXQiOjE2OTQ0ODQwMDB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "user": {
    "_id": "64f8c2e2b2e4a2a1c8d7e9f1",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // other user fields
  }
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "password must be 5 characters long",
        "param": "password",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint authenticates a user. On success, it returns a JWT token and the user data. If credentials are invalid, a 401 error is returned.
---

# User Profile Endpoint Documentation

## GET `/users/profile`

Returns the authenticated user's profile information. Requires a valid JWT token in the request header or cookie.

### Request

- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>` (or cookie named `token`)

### Response

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // other user fields
    }
  }
  ```

**Example Response:**
```json
{
  "user": {
    "_id": "64f8c2e2b2e4a2a1c8d7e9f1",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // other user fields
  }
}
```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint returns the profile of the authenticated user. A valid JWT token is required.

---

# User Logout Endpoint Documentation

## GET `/users/logout`

Logs out the authenticated user by blacklisting the JWT token and clearing the cookie.

### Request

- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>` (or cookie named `token`)

### Response

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

**Example Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint logs out the user by blacklisting the JWT token and clearing the authentication cookie. A valid JWT token is required.
---

# Captain Registration Endpoint Documentation

## POST `/captain/register`

Registers a new captain (driver) in the system.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Field Requirements

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.
- `vehicle.color` (string, required): Minimum 3 characters.
- `vehicle.plate` (string, required): Minimum 3 characters.
- `vehicle.capacity` (integer, required): Minimum 1.
- `vehicle.vehicleType` (string, required): One of `car`, `bike`, `auto`.

### Response

#### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "JWT_TOKEN",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Alice",
        "lastname": "Smith"
      },
      "email": "alice.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
      // other captain fields
    }
  }
  ```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY4YzJlMmIyZTRhMmExYzhkN2U5ZjIiLCJpYXQiOjE2OTQ0ODQwMDB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "captain": {
    "_id": "64f8c2e2b2e4a2a1c8d7e9f2",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // other captain fields
  }
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "first name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Vehicle color must be at least 3 characters long",
        "param": "vehicle.color",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

#### Conflict Error

- **Status Code:** `409 Conflict`
- **Body:**
  ```json
  {
    "message": "Captain with this email already exists"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint creates a new captain account. On success, it returns a JWT token and the captain data. All required fields must be provided and valid.
---

# Captain Login Endpoint Documentation

## POST `/captain/login`

Authenticates a captain and returns a JWT token if credentials are valid.

### Request Body

Send a JSON object with the following structure:

```json
{
  "email": "alice.smith@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Response

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "JWT_TOKEN",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Alice",
        "lastname": "Smith"
      },
      "email": "alice.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
      // other captain fields
    }
  }
  ```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY4YzJlMmIyZTRhMmExYzhkN2U5ZjIiLCJpYXQiOjE2OTQ0ODQwMDB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "captain": {
    "_id": "64f8c2e2b2e4a2a1c8d7e9f2",
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // other captain fields
  }
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "password must be 5 characters long",
        "param": "password",
        "location": "body"
      }
      // other errors
    ]
  }
  ```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint authenticates a captain. On success, it returns a JWT token and the captain data. If credentials are invalid, a 401 error is returned.

---

# Captain Logout Endpoint Documentation

## GET `/captain/logout`

Logs out the authenticated captain by blacklisting the JWT token and clearing the cookie.

### Request

- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>` (or cookie named `token`)

### Response

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

**Example Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### Other Errors

- **Status Code:** `500 Internal Server Error`
- **Body:**  
  Error message describing the issue.

### Description

This endpoint logs out the captain by blacklisting the JWT token and clearing the authentication cookie. A valid JWT token is required.