# Product Management System - Multi-User Edition

A comprehensive product management application designed for multiple users in different locations, perfect for small businesses dealing with imported products, especially electronics like laptops (ordinateur-portable).

## 🌟 New Multi-User Features

- **👥 Multiple Users**: Support for unlimited users, each with their own data
- **🌍 Location-Based**: Users can be in different cities/areas
- **🏢 Business Profiles**: Each user can have their own business name and settings
- **💱 Custom Exchange Rates**: Individual USD to DZD rates per user
- **🔐 Data Separation**: Complete data isolation between users
- **🔄 Easy Switching**: Simple user switching and management

## Features

### Product Management
- **Multi-currency Support**: Track costs in both USD and DZD (Algerian Dinar) with automatic conversion
- **Complete Cost Tracking**: Monitor cost price, transport costs, and sale prices
- **Image Support**: Store product images and package photos
- **Package Details**: Track package sizes with text descriptions and images
- **Date Tracking**: Record arrival dates and sale dates
- **Status Management**: Track product status (In Stock, Sold, Reserved, Damaged)
- **Profit Analysis**: Automatic calculation of profit margins and total profit

### Credit Management
- **Credit Sales**: Create partial payment sales with customer tracking
- **Payment Tracking**: Monitor amount paid vs. remaining balance
- **Customer Management**: Track customer names and payment history
- **Credit Summary**: View total credits, payments, and outstanding amounts
- **Automatic Status Updates**: Products automatically marked as sold when fully paid

### User Interface
- **Tabbed Interface**: Separate tabs for product and credit management
- **Product List**: Sortable table view of all products
- **Detailed View**: Comprehensive product details with images
- **Form Validation**: Input validation and error handling
- **Search and Filter**: Easy product selection and management

## Installation

1. **Install Python 3.7+**
2. **Install Required Packages**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### 🚀 Quick Start (Multi-User)

1. **First Time Setup**:
   ```bash
   python run.py
   ```
   - Creates user selection screen
   - Add your first user with location and business info

2. **Create Sample Data** (Optional):
   ```bash
   python sample_data_multiuser.py
   ```
   - Creates 3 sample users in different locations
   - Adds sample products for each user

3. **Daily Use**:
   - Run `python run.py`
   - Select your user from the list
   - Access your personal product inventory
   - Switch users anytime via the User menu

### 📋 User Management

1. **Create New User**:
   - Click "New User" in user selection
   - Enter username, full name, location
   - Set business name and USD/DZD rate
   - Each user gets separate data

2. **Add Products**:
   - Fill in the product form on the left
   - Cost in USD automatically converts using your rate
   - Add product and package images
   - Set arrival and sale dates

3. **Manage Credits**:
   - Switch to "Credit Management" tab
   - Select a product and customer
   - Enter total amount and initial payment
   - System calculates remaining balance

### 👥 Multi-Location Scenarios

Perfect for:
- **Business Partners**: Each in different cities
- **Family Members**: Running separate stores
- **Franchise Operations**: Independent inventory tracking
- **Import Partners**: Different exchange rates per location

## Database Structure

### Multi-User Database Design
- **`users.db`**: Central user management database
- **`products_[username].db`**: Individual product databases per user
- **Complete Data Separation**: Each user has their own SQLite database

### Database Tables
Each user database contains:
- **products**: Store all product information
- **credit_transactions**: Track credit sales and payments

### Data Export/Import
- Export individual user data
- Backup specific user databases
- Data portability between systems

## Categories

Pre-configured categories include:
- `ordinateur-portable` (Laptops)
- `smartphone`
- `tablet`
- `accessoires`
- `other`

## Currency

- **USD to DZD Rate**: Currently set to 134.5 (can be updated in code)
- **Automatic Conversion**: USD amounts automatically converted to DZD
- **Profit Calculations**: Include transport costs for accurate profit margins

## File Structure

```
jalil/
├── run.py                          # Multi-user launcher (START HERE)
├── user_manager.py                 # User selection and management
├── product_manager_multiuser.py    # Main product management (multi-user)
├── product_manager.py              # Original single-user version
├── sample_data_multiuser.py        # Sample data for multiple users
├── sample_data.py                  # Sample data for single user
├── requirements.txt                # Python dependencies
├── users.db                        # Central user database
├── products_[username].db          # Individual user databases
└── README.md                       # This documentation
```

### Key Files
- **`run.py`**: Start here for multi-user system
- **`user_manager.py`**: User creation and selection
- **`product_manager_multiuser.py`**: Main application for each user
- **`sample_data_multiuser.py`**: Creates demo users and data

## Sample Workflow

1. **Import Product**: Add a new laptop with cost, transport, and expected sale price
2. **Add Images**: Upload product photo and package size image
3. **Set Dates**: Record arrival date and expected sale date
4. **Create Credit Sale**: Sell to customer with partial payment
5. **Track Payments**: Monitor remaining balance and add payments
6. **Analyze Profit**: View profit margins and total earnings

## Support

This application is designed for small business owners managing imported electronics and other products with credit sales capabilities.