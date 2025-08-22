#!/usr/bin/env python3
"""
Sample Data Generator for Product Management System
Run this to add some example products to get started
"""

import sqlite3
from datetime import datetime, timedelta

def add_sample_data():
    """Add sample products to the database"""
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    # Sample products
    sample_products = [
        {
            'name': 'Lenovo ThinkPad X1 Carbon',
            'category': 'ordinateur-portable',
            'cost_price_usd': 800.00,
            'cost_price_dzd': 107600.00,  # 800 * 134.5
            'transport_price': 50.00,
            'sale_price': 1100.00,
            'package_size': '35cm x 25cm x 3cm',
            'arrival_date': (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
            'status': 'In Stock'
        },
        {
            'name': 'MacBook Air M2',
            'category': 'ordinateur-portable',
            'cost_price_usd': 1000.00,
            'cost_price_dzd': 134500.00,
            'transport_price': 60.00,
            'sale_price': 1400.00,
            'package_size': '30cm x 22cm x 2cm',
            'arrival_date': (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
            'status': 'In Stock'
        },
        {
            'name': 'Dell XPS 13',
            'category': 'ordinateur-portable',
            'cost_price_usd': 750.00,
            'cost_price_dzd': 100875.00,
            'transport_price': 45.00,
            'sale_price': 1050.00,
            'package_size': '32cm x 23cm x 2.5cm',
            'arrival_date': (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
            'sale_date': (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
            'status': 'Sold'
        },
        {
            'name': 'iPhone 14 Pro',
            'category': 'smartphone',
            'cost_price_usd': 600.00,
            'cost_price_dzd': 80700.00,
            'transport_price': 25.00,
            'sale_price': 850.00,
            'package_size': '15cm x 8cm x 2cm',
            'arrival_date': (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
            'status': 'Reserved'
        },
        {
            'name': 'Samsung Galaxy Tab S8',
            'category': 'tablet',
            'cost_price_usd': 400.00,
            'cost_price_dzd': 53800.00,
            'transport_price': 30.00,
            'sale_price': 580.00,
            'package_size': '25cm x 18cm x 1.5cm',
            'arrival_date': datetime.now().strftime("%Y-%m-%d"),
            'status': 'In Stock'
        }
    ]
    
    for product in sample_products:
        cursor.execute('''
            INSERT INTO products (name, category, cost_price_usd, cost_price_dzd, 
                                transport_price, sale_price, package_size,
                                arrival_date, sale_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['name'],
            product['category'],
            product['cost_price_usd'],
            product['cost_price_dzd'],
            product['transport_price'],
            product['sale_price'],
            product['package_size'],
            product['arrival_date'],
            product.get('sale_date', ''),
            product['status']
        ))
    
    # Sample credit transaction
    cursor.execute('''
        INSERT INTO credit_transactions (product_id, customer_name, amount_paid, amount_remaining, transaction_date)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        4,  # iPhone 14 Pro
        'Ahmed Benali',
        300.00,
        550.00,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    
    conn.commit()
    conn.close()
    
    print("Sample data added successfully!")
    print("\nSample products added:")
    for product in sample_products:
        print(f"- {product['name']} ({product['category']}) - ${product['sale_price']}")
    
    print("\nSample credit transaction:")
    print("- iPhone 14 Pro for Ahmed Benali ($300 paid, $550 remaining)")

if __name__ == "__main__":
    add_sample_data()