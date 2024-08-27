# Savings & Expenses Tracker

A simple, interactive web application to help users track their income and expenses.

## Core Features

1. **Balance Display**: Shows the current balance, calculated from all transactions.

2. **Transaction Management**:
   - Add new income or expense transactions
   - View a list of all transactions
   - Delete individual transactions

3. **User Interface**:
   - Responsive design with a card-based layout
   - Color-coded transactions (green for income, red for expenses)
   - Animated components for a dynamic user experience

4. **Data Persistence**: Transactions are stored and retrieved from a backend API.

5. **Authentication**: Includes a logout function, suggesting user authentication.

## Technologies Used

- React
- TypeScript
- Framer Motion (for animations)
- Supabase (for authentication)
- Custom UI components

## Getting Started

[Include instructions for setting up and running the project locally]

## API Endpoints

- GET `/api/transactions`: Fetch all transactions
- POST `/api/transactions`: Add a new transaction
- DELETE `/api/transactions/:id`: Delete a specific transaction

