#!/usr/bin/env python3
"""
Sample Data Generator for Multi-User Product Management System
Creates sample users and their product data
"""

import sqlite3
from datetime import datetime, timedelta

def create_sample_users():
    """Create sample users"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Create users table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            full_name TEXT,
            location TEXT,
            business_name TEXT,
            usd_to_dzd_rate REAL DEFAULT 134.5,
            created_date TEXT,
            last_login TEXT
        )
    ''')
    
    # Sample users
    sample_users = [
        {
            'username': 'amine_algiers',
            'full_name': 'Amine Djelloud',
            'location': 'Algiers',
            'business_name': 'Tech Import Algiers',
            'usd_to_dzd_rate': 134.5
        },
        {
            'username': 'mohamed_oran',
            'full_name': 'Mohamed Benali',
            'location': 'Oran',
            'business_name': 'Electronics Store Oran',
            'usd_to_dzd_rate': 135.0
        },
        {
            'username': 'fatima_constantine',
            'full_name': 'Fatima Khelifi',
            'location': 'Constantine',
            'business_name': 'Computer Shop Constantine',
            'usd_to_dzd_rate': 134.0
        }
    ]
    
    for user in sample_users:
        try:
            cursor.execute('''
                INSERT INTO users (username, full_name, location, business_name, usd_to_dzd_rate, created_date)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                user['username'],
                user['full_name'],
                user['location'],
                user['business_name'],
                user['usd_to_dzd_rate'],
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ))
        except sqlite3.IntegrityError:
            print(f"User {user['username']} already exists, skipping...")
    
    conn.commit()
    conn.close()
    
    return sample_users

def add_sample_products_for_user(username, usd_rate):
    """Add sample products for a specific user"""
    db_filename = f'products_{username}.db'
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()
    
    # Create tables if they don't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            cost_price_usd REAL,
            cost_price_dzd REAL,
            transport_price REAL,
            sale_price REAL,
            picture_path TEXT,
            package_size TEXT,
            package_image_path TEXT,
            arrival_date TEXT,
            sale_date TEXT,
            status TEXT DEFAULT 'In Stock',
            notes TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS credit_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            customer_name TEXT,
            amount_paid REAL,
            amount_remaining REAL,
            transaction_date TEXT,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Sample products tailored to each user's location
    if 'algiers' in username:
        sample_products = [
            {
                'name': 'MacBook Pro 14" M3',
                'category': 'ordinateur-portable',
                'cost_price_usd': 1200.00,
                'transport_price': 80.00,
                'sale_price': 1650.00,
                'package_size': '32cm x 22cm x 2.5cm',
                'status': 'In Stock'
            },
            {
                'name': 'Dell XPS 15',
                'category': 'ordinateur-portable',
                'cost_price_usd': 900.00,
                'transport_price': 70.00,
                'sale_price': 1300.00,
                'package_size': '35cm x 24cm x 2.8cm',
                'status': 'Sold',
                'sale_date': (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")
            },
            {
                'name': 'iPhone 15 Pro',
                'category': 'smartphone',
                'cost_price_usd': 700.00,
                'transport_price': 30.00,
                'sale_price': 980.00,
                'package_size': '16cm x 8cm x 2cm',
                'status': 'Reserved'
            }
        ]
    elif 'oran' in username:
        sample_products = [
            {
                'name': 'ASUS ROG Strix Gaming',
                'category': 'ordinateur-portable',
                'cost_price_usd': 800.00,
                'transport_price': 65.00,
                'sale_price': 1150.00,
                'package_size': '40cm x 28cm x 4cm',
                'status': 'In Stock'
            },
            {
                'name': 'Samsung Galaxy S24',
                'category': 'smartphone',
                'cost_price_usd': 550.00,
                'transport_price': 25.00,
                'sale_price': 780.00,
                'package_size': '15cm x 7.5cm x 1.5cm',
                'status': 'In Stock'
            },
            {
                'name': 'iPad Air 5th Gen',
                'category': 'tablet',
                'cost_price_usd': 450.00,
                'transport_price': 35.00,
                'sale_price': 650.00,
                'package_size': '25cm x 18cm x 1.2cm',
                'status': 'Sold',
                'sale_date': (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            }
        ]
    else:  # constantine
        sample_products = [
            {
                'name': 'Lenovo Legion 5 Pro',
                'category': 'ordinateur-portable',
                'cost_price_usd': 750.00,
                'transport_price': 60.00,
                'sale_price': 1080.00,
                'package_size': '38cm x 26cm x 3.5cm',
                'status': 'In Stock'
            },
            {
                'name': 'Surface Pro 9',
                'category': 'tablet',
                'cost_price_usd': 600.00,
                'transport_price': 40.00,
                'sale_price': 890.00,
                'package_size': '29cm x 21cm x 1cm',
                'status': 'Reserved'
            },
            {
                'name': 'AirPods Pro 2nd Gen',
                'category': 'accessoires',
                'cost_price_usd': 180.00,
                'transport_price': 15.00,
                'sale_price': 280.00,
                'package_size': '12cm x 10cm x 5cm',
                'status': 'In Stock'
            }
        ]
    
    for product in sample_products:
        cost_dzd = product['cost_price_usd'] * usd_rate
        arrival_date = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
        
        cursor.execute('''
            INSERT INTO products (name, category, cost_price_usd, cost_price_dzd, 
                                transport_price, sale_price, package_size,
                                arrival_date, sale_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['name'],
            product['category'],
            product['cost_price_usd'],
            cost_dzd,
            product['transport_price'],
            product['sale_price'],
            product['package_size'],
            arrival_date,
            product.get('sale_date', ''),
            product['status']
        ))
    
    # Add a sample credit transaction for each user
    if username == 'amine_algiers':
        cursor.execute('''
            INSERT INTO credit_transactions (product_id, customer_name, amount_paid, amount_remaining, transaction_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            3,  # iPhone 15 Pro
            'Karim Belkacem',
            400.00,
            580.00,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
    elif username == 'mohamed_oran':
        cursor.execute('''
            INSERT INTO credit_transactions (product_id, customer_name, amount_paid, amount_remaining, transaction_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            1,  # ASUS ROG
            'Amina Zeraoulia',
            500.00,
            650.00,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
    elif username == 'fatima_constantine':
        cursor.execute('''
            INSERT INTO credit_transactions (product_id, customer_name, amount_paid, amount_remaining, transaction_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            2,  # Surface Pro 9
            'Youcef Brahimi',
            300.00,
            590.00,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
    
    conn.commit()
    conn.close()
    
    return sample_products

def main():
    """Create sample data for multi-user system"""
    print("Creating sample users and data...")
    
    # Create sample users
    users = create_sample_users()
    
    # Add sample products for each user
    for user in users:
        print(f"Adding sample products for {user['username']}...")
        products = add_sample_products_for_user(user['username'], user['usd_to_dzd_rate'])
        
        print(f"  - {len(products)} products added")
        for product in products:
            print(f"    • {product['name']} ({product['category']}) - ${product['sale_price']}")
    
    print("\n✅ Sample data created successfully!")
    print("\nSample users:")
    for user in users:
        print(f"  - {user['username']} ({user['full_name']}) - {user['location']}")
    
    print("\n🚀 Run 'python run.py' to start the application!")

if __name__ == "__main__":
    main()