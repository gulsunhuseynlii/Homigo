# Homigo

Homigo is a home service booking platform developed with ASP.NET Core Web API and React. The application allows customers to find service providers, book appointments, make online payments and communicate with providers through real-time chat. Providers can manage their services, respond to booking requests and track their work from a dedicated dashboard.

## Features

### Customer

- User registration and login
- Browse services by category
- Search, filter and sort services
- Save favorite services
- Manage addresses
- Book appointments
- Online payment with Stripe
- View and cancel orders
- Leave reviews after completed services
- Real-time chat with providers
- Instant booking notifications

### Provider

- Create and manage services
- Accept or reject bookings
- Start and complete jobs
- View dashboard statistics
- Communicate with customers in real time
- Receive booking notifications

## Technologies

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- SignalR
- Hangfire
- AutoMapper
- FluentValidation
- Stripe API

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- SignalR Client

## Project Structure

```
Homigo
├── Homigo.API
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── DTOs
│   ├── Entities
│   ├── Hubs
│   └── ...
│
└── homigo-ui
    ├── components
    ├── pages
    ├── services
    ├── layouts
    └── ...
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/gulsunhuseynlii/Homigo.git
```

### Backend

```bash
cd Homigo.API
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd homigo-ui
npm install
npm run dev
```

## Screenshots

Screenshots of the application can be found below.

- Home
- Services
- Booking
- Customer Orders
- Provider Dashboard
- Chat
- Payment

## Author

Gülsün Hüseynli