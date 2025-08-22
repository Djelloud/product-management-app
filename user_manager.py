#!/usr/bin/env python3
"""
User Management System for Product Manager
Handles multiple users with separate data
"""

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import sqlite3
import json
import os
from datetime import datetime

class UserManager:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Product Manager - User Selection")
        self.root.geometry("500x400")
        self.root.configure(bg="#f0f0f0")
        
        # Center the window
        self.center_window()
        
        # Initialize users database
        self.init_users_db()
        
        # Create GUI
        self.create_widgets()
        
        # Load users
        self.load_users()
    
    def center_window(self):
        """Center the window on screen"""
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (500 // 2)
        y = (self.root.winfo_screenheight() // 2) - (400 // 2)
        self.root.geometry(f"500x400+{x}+{y}")
    
    def init_users_db(self):
        """Initialize users database"""
        self.conn = sqlite3.connect('users.db')
        self.cursor = self.conn.cursor()
        
        self.cursor.execute('''
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
        
        self.conn.commit()
    
    def create_widgets(self):
        """Create the user selection GUI"""
        # Title
        title_frame = tk.Frame(self.root, bg="#f0f0f0")
        title_frame.pack(pady=20)
        
        title_label = tk.Label(title_frame, text="Product Management System", 
                              font=("Arial", 18, "bold"), bg="#f0f0f0", fg="#333")
        title_label.pack()
        
        subtitle_label = tk.Label(title_frame, text="Multi-User Edition", 
                                 font=("Arial", 12), bg="#f0f0f0", fg="#666")
        subtitle_label.pack()
        
        # Main content frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=30, pady=20)
        
        # User selection frame
        selection_frame = ttk.LabelFrame(main_frame, text="Select User", padding=20)
        selection_frame.pack(fill=tk.BOTH, expand=True)
        
        # Users listbox
        self.users_listbox = tk.Listbox(selection_frame, height=8, font=("Arial", 11))
        self.users_listbox.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        self.users_listbox.bind('<Double-1>', self.login_user)
        
        # Buttons frame
        buttons_frame = ttk.Frame(selection_frame)
        buttons_frame.pack(fill=tk.X)
        
        ttk.Button(buttons_frame, text="Login", command=self.login_user).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(buttons_frame, text="New User", command=self.create_new_user).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="Edit User", command=self.edit_user).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="Delete User", command=self.delete_user).pack(side=tk.LEFT, padx=5)
        
        # Info frame
        info_frame = ttk.Frame(main_frame)
        info_frame.pack(fill=tk.X, pady=(10, 0))
        
        info_text = "Select a user to access their product inventory and credit management.\nEach user has separate data and settings."
        info_label = tk.Label(info_frame, text=info_text, bg="#f0f0f0", fg="#666", 
                             font=("Arial", 10), justify=tk.CENTER)
        info_label.pack()
    
    def load_users(self):
        """Load users into the listbox"""
        self.users_listbox.delete(0, tk.END)
        
        self.cursor.execute('SELECT username, full_name, location, business_name, last_login FROM users ORDER BY last_login DESC')
        users = self.cursor.fetchall()
        
        for user in users:
            username, full_name, location, business_name, last_login = user
            display_name = f"{username}"
            if full_name:
                display_name += f" ({full_name})"
            if location:
                display_name += f" - {location}"
            if business_name:
                display_name += f" | {business_name}"
            
            self.users_listbox.insert(tk.END, display_name)
    
    def create_new_user(self):
        """Create a new user"""
        dialog = UserDialog(self.root, "Create New User")
        if dialog.result:
            user_data = dialog.result
            try:
                self.cursor.execute('''
                    INSERT INTO users (username, full_name, location, business_name, usd_to_dzd_rate, created_date)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    user_data['username'],
                    user_data['full_name'],
                    user_data['location'],
                    user_data['business_name'],
                    user_data['usd_to_dzd_rate'],
                    datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ))
                
                self.conn.commit()
                messagebox.showinfo("Success", f"User '{user_data['username']}' created successfully!")
                self.load_users()
                
            except sqlite3.IntegrityError:
                messagebox.showerror("Error", "Username already exists!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to create user: {str(e)}")
    
    def edit_user(self):
        """Edit selected user"""
        selection = self.users_listbox.curselection()
        if not selection:
            messagebox.showerror("Error", "Please select a user to edit!")
            return
        
        # Get user data
        self.cursor.execute('SELECT * FROM users ORDER BY last_login DESC')
        users = self.cursor.fetchall()
        user = users[selection[0]]
        
        # Create edit dialog with existing data
        dialog = UserDialog(self.root, "Edit User", user)
        if dialog.result:
            user_data = dialog.result
            try:
                self.cursor.execute('''
                    UPDATE users SET full_name=?, location=?, business_name=?, usd_to_dzd_rate=?
                    WHERE id=?
                ''', (
                    user_data['full_name'],
                    user_data['location'],
                    user_data['business_name'],
                    user_data['usd_to_dzd_rate'],
                    user[0]  # user id
                ))
                
                self.conn.commit()
                messagebox.showinfo("Success", "User updated successfully!")
                self.load_users()
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to update user: {str(e)}")
    
    def delete_user(self):
        """Delete selected user"""
        selection = self.users_listbox.curselection()
        if not selection:
            messagebox.showerror("Error", "Please select a user to delete!")
            return
        
        self.cursor.execute('SELECT username FROM users ORDER BY last_login DESC')
        users = self.cursor.fetchall()
        username = users[selection[0]][0]
        
        if messagebox.askyesno("Confirm Delete", 
                              f"Are you sure you want to delete user '{username}'?\n\nThis will also delete all their product data!"):
            try:
                # Delete user data file
                db_file = f"products_{username}.db"
                if os.path.exists(db_file):
                    os.remove(db_file)
                
                # Delete user from users table
                self.cursor.execute('DELETE FROM users WHERE username=?', (username,))
                self.conn.commit()
                
                messagebox.showinfo("Success", f"User '{username}' deleted successfully!")
                self.load_users()
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to delete user: {str(e)}")
    
    def login_user(self, event=None):
        """Login selected user"""
        selection = self.users_listbox.curselection()
        if not selection:
            messagebox.showerror("Error", "Please select a user to login!")
            return
        
        self.cursor.execute('SELECT * FROM users ORDER BY last_login DESC')
        users = self.cursor.fetchall()
        user = users[selection[0]]
        
        # Update last login
        self.cursor.execute('UPDATE users SET last_login=? WHERE id=?', 
                           (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), user[0]))
        self.conn.commit()
        
        # Close user manager and start product manager for this user
        self.root.destroy()
        self.start_product_manager(user)
    
    def start_product_manager(self, user):
        """Start product manager for specific user"""
        # Import here to avoid circular imports
        from product_manager_multiuser import ProductManagerMultiUser
        
        app = ProductManagerMultiUser(user)
        app.run()
    
    def run(self):
        """Start the user manager"""
        self.root.mainloop()
        self.conn.close()

class UserDialog:
    def __init__(self, parent, title, user_data=None):
        self.result = None
        
        # Create dialog window
        self.dialog = tk.Toplevel(parent)
        self.dialog.title(title)
        self.dialog.geometry("400x350")
        self.dialog.configure(bg="#f0f0f0")
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        # Center dialog
        self.dialog.update_idletasks()
        x = parent.winfo_x() + (parent.winfo_width() // 2) - (400 // 2)
        y = parent.winfo_y() + (parent.winfo_height() // 2) - (350 // 2)
        self.dialog.geometry(f"400x350+{x}+{y}")
        
        # Create form
        self.create_form(user_data)
        
        # Wait for dialog to close
        self.dialog.wait_window()
    
    def create_form(self, user_data):
        """Create user form"""
        main_frame = ttk.Frame(self.dialog)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Form fields
        ttk.Label(main_frame, text="Username:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.username_var = tk.StringVar(value=user_data[1] if user_data else "")
        username_entry = ttk.Entry(main_frame, textvariable=self.username_var, width=30)
        username_entry.grid(row=0, column=1, pady=5, sticky=tk.W)
        if user_data:  # Disable username editing for existing users
            username_entry.config(state='readonly')
        
        ttk.Label(main_frame, text="Full Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.full_name_var = tk.StringVar(value=user_data[2] if user_data else "")
        ttk.Entry(main_frame, textvariable=self.full_name_var, width=30).grid(row=1, column=1, pady=5, sticky=tk.W)
        
        ttk.Label(main_frame, text="Location:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.location_var = tk.StringVar(value=user_data[3] if user_data else "")
        ttk.Entry(main_frame, textvariable=self.location_var, width=30).grid(row=2, column=1, pady=5, sticky=tk.W)
        
        ttk.Label(main_frame, text="Business Name:").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.business_name_var = tk.StringVar(value=user_data[4] if user_data else "")
        ttk.Entry(main_frame, textvariable=self.business_name_var, width=30).grid(row=3, column=1, pady=5, sticky=tk.W)
        
        ttk.Label(main_frame, text="USD to DZD Rate:").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.usd_rate_var = tk.StringVar(value=str(user_data[5]) if user_data else "134.5")
        ttk.Entry(main_frame, textvariable=self.usd_rate_var, width=30).grid(row=4, column=1, pady=5, sticky=tk.W)
        
        # Example text
        example_frame = ttk.LabelFrame(main_frame, text="Examples", padding=10)
        example_frame.grid(row=5, column=0, columnspan=2, pady=20, sticky=tk.EW)
        
        examples = [
            "Username: amine_algiers",
            "Full Name: Amine Djelloud", 
            "Location: Algiers",
            "Business: Tech Import Store",
            "USD Rate: 134.5"
        ]
        
        for example in examples:
            ttk.Label(example_frame, text=example, font=("Arial", 9), foreground="#666").pack(anchor=tk.W)
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=6, column=0, columnspan=2, pady=20)
        
        ttk.Button(button_frame, text="Save", command=self.save_user).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Cancel", command=self.dialog.destroy).pack(side=tk.LEFT, padx=5)
    
    def save_user(self):
        """Save user data"""
        if not self.username_var.get().strip():
            messagebox.showerror("Error", "Username is required!")
            return
        
        try:
            usd_rate = float(self.usd_rate_var.get())
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid USD to DZD rate!")
            return
        
        self.result = {
            'username': self.username_var.get().strip(),
            'full_name': self.full_name_var.get().strip(),
            'location': self.location_var.get().strip(),
            'business_name': self.business_name_var.get().strip(),
            'usd_to_dzd_rate': usd_rate
        }
        
        self.dialog.destroy()

if __name__ == "__main__":
    app = UserManager()
    app.run()