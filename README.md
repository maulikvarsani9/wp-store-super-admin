# WP Store Super Admin

Super Admin dashboard for Kharidi360 e-commerce platform with modern sidebar navigation.

## Features

- **Authentication**: Secure login for super admin users only (no registration)
- **Modern Sidebar Layout**: Collapsible sidebar with navigation (same as merchant admin)
- **Category Management**: Full CRUD operations for product categories
  - Create new categories
  - Edit existing categories
  - Delete categories
  - View all categories in a table format
  - Toggle active/inactive status
- **Settings Page**: Manage admin preferences and configurations
- **User Menu**: Profile, settings, and logout options

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: Formik
- **Validation**: Yup
- **Routing**: React Router DOM
- **Icons**: React Icons, Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (default: http://localhost:4000/api)

### Installation

1. Navigate to the super admin directory:
```bash
cd wp-store-super-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy .env.example to .env and update values if needed
VITE_API_URL=http://localhost:4000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
wp-store-super-admin/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── shared/      # Shared components (FormInput, Loader, etc.)
│   │   └── ui/          # UI components (Button, etc.)
│   ├── contexts/        # React contexts (Toast)
│   ├── hooks/           # Custom hooks (useCategories)
│   ├── layout/          # Layout components
│   ├── lib/             # Utility libraries (API client)
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Login page
│   │   └── Categories.tsx  # Categories CRUD page
│   ├── schemas/         # Validation schemas
│   ├── services/        # API services
│   ├── store/           # Zustand store
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
└── package.json
```

## Authentication

- Only users with the `superadmin` role can access the dashboard
- No registration page - super admin accounts must be created via backend
- JWT token-based authentication with automatic token refresh
- Protected routes redirect to login if not authenticated

## API Integration

The super admin connects to the backend API at `/api`. Key endpoints used:

- `POST /merchant/auth/login` - Super admin login
- `POST /merchant/auth/logout` - Logout
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## Usage

### Login
1. Navigate to `/login`
2. Enter super admin email and password
3. Click "Sign in"

### Category Management
1. After login, you'll be redirected to `/categories`
2. **Create**: Click "Add Category" button, fill the form, and submit
3. **Edit**: Click the edit icon on any category row
4. **Delete**: Click the delete icon and confirm deletion
5. **View**: All categories are displayed in a table with their details

## Development Notes

- The app uses localStorage to persist authentication state
- Toast notifications are shown for all CRUD operations
- Form validation is handled by Yup schemas
- API errors are automatically handled and displayed to users
- The UI is fully responsive for mobile and desktop

## Production Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

Private - Kharidi360 Internal Use Only
