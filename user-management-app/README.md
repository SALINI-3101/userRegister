# User Management Application

A modern, responsive React application for managing users with full CRUD operations, built with React, Redux, and styled-components.

**Status**: ✅ Production Ready | **Version**: 1.0.0

## Features

- **Authentication**: Login with token-based authentication
- **User Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Dual View Modes**: Switch between Table and Card views
- **Search Functionality**: Real-time client-side search by name or email
- **Pagination**: Client-side pagination with page navigation
- **Form Validation**: Comprehensive validation on all forms
- **Responsive Design**: Mobile-friendly UI that works on all devices
- **Loading States**: Visual feedback during API operations
- **Protected Routes**: Secure routing with authentication guards

## Tech Stack

- **Frontend**: React 18 with Vite
- **State Management**: Redux with redux-thunk middleware
- **Routing**: React Router v6
- **Styling**: styled-components
- **HTTP Client**: Axios
- **API**: [ReqRes API](https://reqres.in/)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository or extract the project files

2. Navigate to the project directory:
```bash
cd user-management-app
```

3. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Default Login Credentials

Use these credentials to log in:

- **Email**: eve.holt@reqres.in
- **Password**: cityslicka

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be generated in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common components (Modal, Loader, ProtectedRoute)
│   └── users/          # User-specific components (UserForm)
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   └── Users.jsx       # Users list page
├── redux/              # Redux state management
│   ├── actions/        # Action creators
│   ├── reducers/       # Reducers
│   └── store.js        # Redux store configuration
├── services/           # API services
│   └── api.js          # Axios configuration and API endpoints
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Key Features Explained

### Authentication
- Token-based authentication using localStorage
- Automatic redirect to users page after login
- Protected routes that require authentication
- Logout functionality

### User Management
- View users in table or card format
- Create new users with validation
- Edit existing users
- Delete users with confirmation
- Real-time search filtering
- Paginated results

### Form Validation
- Email format validation
- Required field validation
- Minimum length validation
- URL format validation for profile images
- Real-time validation feedback

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and mobile devices
- Touch-friendly interface
- Optimized layouts for different screen sizes

## Code Quality Features

- **Modern ES6+ JavaScript**: Arrow functions, destructuring, async/await
- **Component Reusability**: DRY principles applied
- **Clean Code**: Organized file structure and naming conventions
- **State Management**: Centralized Redux store
- **Error Handling**: Proper error handling for API calls
- **Loading States**: User feedback during async operations

## API Integration

The application uses the [ReqRes API](https://reqres.in/) which provides:
- User authentication endpoints
- User CRUD endpoints
- Paginated user data
- Mock API responses

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!
