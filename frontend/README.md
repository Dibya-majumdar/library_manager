# Library Management System - Frontend

React.js frontend application for the Library Management System.

## Features

- User authentication with role-based access control (Admin/User)
- Maintenance module (Admin only):
  - Add/Update Books
  - Add/Update Memberships
  - User Management
- Transactions module:
  - Book Available (Search)
  - Book Issue
  - Return Book
  - Fine Pay
- Reports module (Admin only):
  - Issued Books
  - Returned Books
  - Fines

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:3000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

**Note:** To run on port 3001 (to match backend CORS configuration), set the PORT environment variable:
- Windows PowerShell: `$env:PORT=3001; npm start`
- Windows CMD: `set PORT=3001 && npm start`
- Linux/Mac: `PORT=3001 npm start`

Or create a `.env` file in the frontend directory with:
```
PORT=3001
```

The application will run on http://localhost:3001 (configured to match backend CORS settings).

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/          # Login component
│   │   ├── Layout/        # Navbar, Sidebar
│   │   ├── Maintenance/   # Admin maintenance features
│   │   ├── Transactions/  # Transaction management
│   │   └── Reports/       # Admin reports
│   ├── context/           # AuthContext for state management
│   ├── services/          # API service layer
│   ├── utils/             # Helper functions
│   ├── App.js             # Main app component with routing
│   └── index.js           # Entry point
└── package.json
```

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:3000`. This is set in `src/services/api.js`.

## Authentication

- Login credentials are stored in cookies (handled by backend)
- Token-based authentication with role-based access control
- Admin users have access to all modules
- Regular users can access Transactions and Reports only (no Maintenance)

## Form Validations

All forms include client-side validation:
- Required fields are marked with *
- Error messages are displayed on the same page
- Date validations for issue/return dates
- Fine payment validation

## Notes

- Chart link is present on all pages but non-functional (as per requirements)
- Password fields are hidden (type="password")
- Radio buttons allow single selection
- Checkboxes: checked = yes, unchecked = no

