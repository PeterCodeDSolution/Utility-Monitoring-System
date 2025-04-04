# Smart Utility Monitoring System

A full-stack demo project for monitoring water and chemical usage in industrial parks. This application is designed to help facility managers track utility consumption, view historical data, and manage client sites.

## 🌟 Features

- **Authentication System**
  - Role-based access (Admin, Operator)
  - JWT token-based authentication
  - Mock LINE login integration

- **Interactive Dashboard**
  - Summary cards with key metrics
  - Water usage charts
  - Chemical usage (PAC, Polymer, Chlorine) visualization
  - Alerts and notifications

- **Data Input Form**
  - Easy form for field staff to input utility readings
  - Validation for numeric values
  - Notes section for additional observations

- **Interactive Site Map**
  - View all sites with status indicators
  - Click on sites to view mini-charts and details
  - Color-coded markers for site status
  - Legend and site statistics

- **Client Details**
  - Comprehensive client information
  - Historical usage data in charts and tables
  - Document management section
  - Notes and alerts specific to clients

- **Responsive Design**
  - Mobile-friendly interface
  - Optimized for field staff usage
  - Adaptive layout for different screen sizes

## 🛠️ Technology Stack

### Frontend
- React.js with hooks
- React Router for navigation
- Chart.js for data visualization
- Leaflet.js for interactive maps
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Go with Fiber framework
- JWT for authentication
- GORM for database ORM
- SQLite for development (PostgreSQL ready for production)

### Deployment
- Docker and Docker Compose
- Environment-based configuration

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/utility-demo.git
   cd utility-demo
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Credentials

The application comes with pre-seeded demo accounts:

- Admin User:
  - Username: `admin`
  - Password: `admin`

- Operator User:
  - Username: `operator`
  - Password: `operator`

- LINE Login (simulated):
  - Click the "Continue with LINE" button on the login page

## 📊 API Endpoints

The backend provides the following API endpoints:

- **Authentication**
  - POST `/api/login` - Authenticate user and get JWT token

- **Dashboard Data**
  - GET `/api/dashboard` - Get summarized utility data for dashboard

- **Utility Data**
  - POST `/api/submit-data` - Submit new utility reading data

- **Map Data**
  - GET `/api/map-data` - Get data for interactive site map

- **Client Data**
  - GET `/api/clients/:id` - Get detailed information for a specific client

## 🔧 Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
go mod download
go run main.go
```

## 📝 Project Structure

```
📦 utility-demo/
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (auth, etc.)
│   │   ├── layouts/     # Page layouts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
│
├── backend/             # Go backend
│   ├── database/        # Database connection and models
│   ├── handlers/        # API endpoint handlers
│   ├── middlewares/     # Authentication middlewares
│   ├── models/          # Data models
│   ├── go.mod           # Go dependencies
│   └── main.go          # Entry point
│
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # Project documentation
```

## 📱 Mobile Compatibility

The application is designed to be mobile-friendly, making it suitable for field staff who need to input data while on-site. The responsive design ensures a good user experience on devices of all sizes.

## 🔒 Security

For demonstration purposes, this application uses simplified security measures. In a production environment, you should:

- Use proper password hashing
- Implement HTTPS
- Set more restrictive CORS policies
- Use environment variables for sensitive configuration
- Implement rate limiting
- Add more comprehensive validation

## 📄 License

This project is available as open source under the terms of the MIT License.

## 🙏 Acknowledgments

- Icons from React Icons
- Maps powered by Leaflet
- Charts powered by Chart.js 