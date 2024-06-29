# Full Stack Hassan's-Blog Application

Welcome to Hassan's-Blog Application! 🌐 This is a powerful and fully responsive MERN stack web application with cutting-edge features.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Responsive Design](#responsive-design)
- [Advanced Search Functionality](#advanced-search-functionality)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Hello, and welcome to Hassan's-Blog Application! This project aims to create a feature-rich and fully responsive MERN stack web application. The application leverages the latest versions of React, MongoDB, Node.js, and Express to provide a seamless and interactive blogging experience.

Source code and final version: [GitHub Repository](https://github.com/HassanMunene/Hassan-Blog)

## Features

- **React.js and Tailwind CSS**: Set up and integrated Tailwind CSS for styling.
- **React Router Dom**: Dynamic page navigation.
- **Authentication**: Robust authentication using JSON Web Tokens and Google OAuth, powered by Redux Toolkit for state management.
- **Admin Dashboard**: Manage posts, comments, and users with full CRUD operations using MongoDB.
- **Responsive Design**: Fully responsive design for a seamless experience across devices.
- **Dark Mode**: Sleek dark mode for enhanced user experience.
- **Advanced Search**: Search by title, limit results, and sort through a modern sidebar using MongoDB.
- **Interactive Community**: Users can leave, edit, and delete comments on post pages.
- **Deployment**: Deploy the application for free using the Render platform.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, React Router Dom
- **Backend**: Node.js, Express.js, MongoDB
- **State Management**: Redux Toolkit
- **Authentication**: JSON Web Tokens, Google OAuth
- **Deployment**: Render

## Getting Started

### Prerequisites

- Basic understanding of JavaScript and React.
- Node.js and npm installed on your machine.

### Installation

1. **Clone the repository**:

    ```bash
    https://github.com/HassanMunene/Hassan-Blog.git
    cd Hassan-Blog
    ```

2. **Install dependencies for the backend**:

    ```bash
    npm install
    ```

3. **Navigate to frontend folder and Install dependencies for the frontend**:

    ```bash
    cd clientSide
    npm install
    ```

4. **Set up environment variables for the backend side**:

    Create a `.env` file in the backend directory and add the following:

    ```Hassan-Blog/.env
    MONGO_URI=your_mongo_db_connection_string
    JWT_SECRET_KEY=your_jwt_secret
    ```
5. **Set up environment variable for the frontend side**:
   
   you need to have a firebase account that we will be used for storage and authentication
   
   ```Hassan-Blog/clientSide/.env
   VITE_FIREBASE_API_KEY=you firebase api key.
   ```

5. **Run the application both the backend local server and react for frontend**:

    ```bash
    # In the backend directory
    npm run dev

    # In the frontend directory i.e Hassan-Blog/clientSide
    npm run dev
    ```

    The backend server will run on `http://localhost:3000` and the frontend on `http://localhost:5173`.

## Project Structure

