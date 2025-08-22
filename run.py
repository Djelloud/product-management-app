#!/usr/bin/env python3
"""
Product Manager Launcher - Multi-User Edition
Easy way to start the Product Management System with multi-user support
"""

import os
import sys

def main():
    print("=== Product Management System - Multi-User Edition ===")
    print("Starting user selection...")
    
    # Check if users database exists
    if not os.path.exists('users.db'):
        print("\nFirst time setup detected.")
        print("You'll be able to create users and add sample data from the application.")
    
    # Start the user manager
    try:
        from user_manager import UserManager
        app = UserManager()
        app.run()
    except ImportError as e:
        print(f"Error importing user manager: {e}")
        print("Please ensure all dependencies are installed: pip install -r requirements.txt")
    except Exception as e:
        print(f"Error starting application: {e}")

if __name__ == "__main__":
    main()