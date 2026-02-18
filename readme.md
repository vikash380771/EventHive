# EventHive - Event Management Platform

EventHive is a full-stack event management platform that allows users to discover, register for, and organize events. It features real-time updates using Socket.io and a modern, responsive UI built with React and Tailwind CSS.

 Features

- **User Authentication**: Secure Login and Signup system with Role-based access (User/Organizer).
- **Event Management**: Organizers can create, update, and manage events.
- **Event Discovery**: Users can browse and search for events by various categories.
- **Real-time Notifications**: Live updates for event registrations and changes using Socket.io.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
- **Interactive UI**: Smooth transitions and modern aesthetics using Tailwind CSS and Lucide React.

 Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Axios** (API Client)
- **Socket.io-client** (Real-time updates)
- **React Router Dom** (Navigation)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Database)
- **Socket.io** (WebSocket communication)
- **JWT** (JSON Web Tokens for Auth)
- **Bcryptjs** (Password hashing)

Project Structure


EventHive/
├── backend/            # Express server and database models
│   ├── config/         # Database configuration
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth and Shared state
    │   ├── pages/      # Page components
    │   └── App.jsx     # Main application routing
```

Getting Started

Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or local)

Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd EventHive
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb+srv://eventhive2026:eventhive2026@cluster0.ndzncj5.mongodb.net/?appName=Cluster0
   PORT=5000
   JWT_SECRET=eventhive_secret_key_2026
   ```

3. Frontend Setup:
   ```bash
   cd ../frontend
   npm install
   ```
   *Note: Frontend is configured to connect to `http://localhost:5000` by default.*

 Running the Application

1. Start the Backend
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:5000`.

2. Start the Frontend
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.


