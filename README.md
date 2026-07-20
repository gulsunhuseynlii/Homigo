# Homigo API

Homigo API is a backend application developed with ASP.NET Core Web API. It is designed for a home service platform where customers can book services, providers can manage their work, and administrators can manage the system.

The project focuses on clean architecture principles by separating responsibilities into controllers, services, repositories, entities and DTOs.

---

## Features

### Authentication

- User registration
- JWT authentication
- Email verification
- Password hashing with BCrypt
- Role-based authorization

### Customer

- Manage addresses
- Browse service categories
- Create service orders
- Add or remove favorite services
- Make payments
- Leave reviews after completed orders

### Provider

- Apply to become a provider
- Get approved by an administrator
- Accept customer orders
- Start and complete orders
- Manage assigned services

### Admin

- Create and manage categories
- Create and manage services
- Approve provider applications

---

## Technologies

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- AutoMapper
- FluentValidation
- JWT Authentication
- BCrypt.Net
- Swagger (OpenAPI)
- Repository Pattern

---

## Project Structure

```
Controllers
│
├── Services
│
├── Repositories
│
├── DTOs
│
├── Entities
│
├── Mappings
│
├── Middlewares
│
└── Validators
```

---

## User Roles

- Admin
- Customer
- Provider

---

## Order Workflow

```
Customer

↓

Create Order

↓

Provider Accepts

↓

In Progress

↓

Completed

↓

Payment

↓

Review
```

---

## API Modules

- Authentication
- Category Management
- Service Management
- Address Management
- Provider Management
- Order Management
- Payment Management
- Review Management
- Favorite Management

---

## Running the Project

Clone the repository

```bash
git clone <repository-url>
```

Go to the project folder

```bash
cd Homigo.API
```

Update the required values in **appsettings.json**

- SQL Server connection string
- JWT settings
- Email settings

Run migrations

```bash
Update-Database
```

Start the application

```bash
dotnet run
```

Swagger will be available at

```
https://localhost:7121/swagger
```

---

## Notes

- Email verification is required before login.
- Only approved providers can accept orders.
- A payment can only be created once for an order.
- Customers can leave only one review per completed order.
- Soft delete is used for some entities.

---

## Future Improvements

- Docker support
- Refresh Token authentication
- Unit testing
- Redis caching
- Payment gateway integration

---

## Author

**Gulsun Huseynli**

Backend Developer (ASP.NET Core)