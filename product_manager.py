#!/usr/bin/env python3
"""
Product Management System
A small program to manage products with cost prices, transport costs, sales tracking, and credit functionality
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk
import sqlite3
import json
from datetime import datetime
import os

class ProductManager:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Product Management System")
        self.root.geometry("1200x800")
        self.root.configure(bg="#f0f0f0")
        
        # Exchange rate USD to DZD (you can update this)
        self.usd_to_dzd_rate = 134.5
        
        # Initialize database
        self.init_database()
        
        # Create GUI
        self.create_widgets()
        
        # Load products
        self.load_products()
    
    def init_database(self):
        """Initialize SQLite database for storing products"""
        self.conn = sqlite3.connect('products.db')
        self.cursor = self.conn.cursor()
        
        # Create products table
        self.cursor.execute('''
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
        
        # Create credit transactions table
        self.cursor.execute('''
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
        
        self.conn.commit()
    
    def create_widgets(self):
        """Create the main GUI widgets"""
        # Main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Title
        title_label = tk.Label(main_frame, text="Product Management System", 
                              font=("Arial", 20, "bold"), bg="#f0f0f0", fg="#333")
        title_label.pack(pady=(0, 20))
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Product Management Tab
        self.product_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.product_frame, text="Product Management")
        
        # Credit Management Tab
        self.credit_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.credit_frame, text="Credit Management")
        
        self.create_product_tab()
        self.create_credit_tab()
    
    def create_product_tab(self):
        """Create the product management tab"""
        # Left panel for form
        left_panel = ttk.Frame(self.product_frame)
        left_panel.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        
        # Right panel for product list
        right_panel = ttk.Frame(self.product_frame)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        # Product form
        form_frame = ttk.LabelFrame(left_panel, text="Add/Edit Product", padding=10)
        form_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Product name
        ttk.Label(form_frame, text="Product Name:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.name_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.name_var, width=25).grid(row=0, column=1, pady=2)
        
        # Category
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.category_var = tk.StringVar()
        category_combo = ttk.Combobox(form_frame, textvariable=self.category_var, width=22)
        category_combo['values'] = ('ordinateur-portable', 'smartphone', 'tablet', 'accessoires', 'other')
        category_combo.grid(row=1, column=1, pady=2)
        
        # Cost price USD
        ttk.Label(form_frame, text="Cost Price (USD):").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.cost_usd_var = tk.StringVar()
        cost_usd_entry = ttk.Entry(form_frame, textvariable=self.cost_usd_var, width=25)
        cost_usd_entry.grid(row=2, column=1, pady=2)
        cost_usd_entry.bind('<KeyRelease>', self.calculate_dzd)
        
        # Cost price DZD (auto-calculated)
        ttk.Label(form_frame, text="Cost Price (DZD):").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.cost_dzd_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.cost_dzd_var, width=25, state='readonly').grid(row=3, column=1, pady=2)
        
        # Transport price
        ttk.Label(form_frame, text="Transport Price:").grid(row=4, column=0, sticky=tk.W, pady=2)
        self.transport_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.transport_var, width=25).grid(row=4, column=1, pady=2)
        
        # Sale price
        ttk.Label(form_frame, text="Sale Price:").grid(row=5, column=0, sticky=tk.W, pady=2)
        self.sale_price_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.sale_price_var, width=25).grid(row=5, column=1, pady=2)
        
        # Picture
        ttk.Label(form_frame, text="Product Picture:").grid(row=6, column=0, sticky=tk.W, pady=2)
        picture_frame = ttk.Frame(form_frame)
        picture_frame.grid(row=6, column=1, pady=2)
        self.picture_path_var = tk.StringVar()
        ttk.Button(picture_frame, text="Browse", command=self.browse_picture).pack(side=tk.LEFT)
        self.picture_label = ttk.Label(picture_frame, text="No image selected")
        self.picture_label.pack(side=tk.LEFT, padx=(5, 0))
        
        # Package size
        ttk.Label(form_frame, text="Package Size:").grid(row=7, column=0, sticky=tk.W, pady=2)
        self.package_size_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.package_size_var, width=25).grid(row=7, column=1, pady=2)
        
        # Package image
        ttk.Label(form_frame, text="Package Image:").grid(row=8, column=0, sticky=tk.W, pady=2)
        package_img_frame = ttk.Frame(form_frame)
        package_img_frame.grid(row=8, column=1, pady=2)
        self.package_image_path_var = tk.StringVar()
        ttk.Button(package_img_frame, text="Browse", command=self.browse_package_image).pack(side=tk.LEFT)
        self.package_img_label = ttk.Label(package_img_frame, text="No image selected")
        self.package_img_label.pack(side=tk.LEFT, padx=(5, 0))
        
        # Arrival date
        ttk.Label(form_frame, text="Arrival Date:").grid(row=9, column=0, sticky=tk.W, pady=2)
        self.arrival_date_var = tk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        ttk.Entry(form_frame, textvariable=self.arrival_date_var, width=25).grid(row=9, column=1, pady=2)
        
        # Sale date
        ttk.Label(form_frame, text="Sale Date:").grid(row=10, column=0, sticky=tk.W, pady=2)
        self.sale_date_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.sale_date_var, width=25).grid(row=10, column=1, pady=2)
        
        # Status
        ttk.Label(form_frame, text="Status:").grid(row=11, column=0, sticky=tk.W, pady=2)
        self.status_var = tk.StringVar(value="In Stock")
        status_combo = ttk.Combobox(form_frame, textvariable=self.status_var, width=22)
        status_combo['values'] = ('In Stock', 'Sold', 'Reserved', 'Damaged')
        status_combo.grid(row=11, column=1, pady=2)
        
        # Buttons
        button_frame = ttk.Frame(form_frame)
        button_frame.grid(row=12, column=0, columnspan=2, pady=10)
        
        ttk.Button(button_frame, text="Add Product", command=self.add_product).pack(side=tk.LEFT, padx=2)
        ttk.Button(button_frame, text="Update Product", command=self.update_product).pack(side=tk.LEFT, padx=2)
        ttk.Button(button_frame, text="Clear Form", command=self.clear_form).pack(side=tk.LEFT, padx=2)
        
        # Product list
        list_frame = ttk.LabelFrame(right_panel, text="Products", padding=10)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        # Treeview for products
        columns = ('ID', 'Name', 'Category', 'Cost USD', 'Cost DZD', 'Sale Price', 'Status')
        self.product_tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=15)
        
        for col in columns:
            self.product_tree.heading(col, text=col)
            self.product_tree.column(col, width=100)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.product_tree.yview)
        self.product_tree.configure(yscrollcommand=scrollbar.set)
        
        self.product_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Bind selection event
        self.product_tree.bind('<<TreeviewSelect>>', self.on_product_select)
        
        # Product buttons
        product_button_frame = ttk.Frame(right_panel)
        product_button_frame.pack(fill=tk.X, pady=(10, 0))
        
        ttk.Button(product_button_frame, text="Delete Product", command=self.delete_product).pack(side=tk.LEFT, padx=2)
        ttk.Button(product_button_frame, text="View Details", command=self.view_product_details).pack(side=tk.LEFT, padx=2)
    
    def create_credit_tab(self):
        """Create the credit management tab"""
        # Left panel for credit form
        left_credit_panel = ttk.Frame(self.credit_frame)
        left_credit_panel.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        
        # Right panel for credit transactions
        right_credit_panel = ttk.Frame(self.credit_frame)
        right_credit_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        # Credit form
        credit_form_frame = ttk.LabelFrame(left_credit_panel, text="Credit Transaction", padding=10)
        credit_form_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Product selection for credit
        ttk.Label(credit_form_frame, text="Select Product:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.credit_product_var = tk.StringVar()
        self.credit_product_combo = ttk.Combobox(credit_form_frame, textvariable=self.credit_product_var, width=25, state="readonly")
        self.credit_product_combo.grid(row=0, column=1, pady=5)
        self.update_credit_products()
        
        # Customer name
        ttk.Label(credit_form_frame, text="Customer Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.customer_name_var = tk.StringVar()
        ttk.Entry(credit_form_frame, textvariable=self.customer_name_var, width=25).grid(row=1, column=1, pady=5)
        
        # Total amount
        ttk.Label(credit_form_frame, text="Total Amount:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.total_amount_var = tk.StringVar()
        total_amount_entry = ttk.Entry(credit_form_frame, textvariable=self.total_amount_var, width=25)
        total_amount_entry.grid(row=2, column=1, pady=5)
        total_amount_entry.bind('<KeyRelease>', self.calculate_remaining)
        
        # Amount paid
        ttk.Label(credit_form_frame, text="Amount Paid:").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.amount_paid_var = tk.StringVar()
        amount_paid_entry = ttk.Entry(credit_form_frame, textvariable=self.amount_paid_var, width=25)
        amount_paid_entry.grid(row=3, column=1, pady=5)
        amount_paid_entry.bind('<KeyRelease>', self.calculate_remaining)
        
        # Amount remaining (calculated)
        ttk.Label(credit_form_frame, text="Amount Remaining:").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.amount_remaining_var = tk.StringVar()
        ttk.Entry(credit_form_frame, textvariable=self.amount_remaining_var, width=25, state='readonly').grid(row=4, column=1, pady=5)
        
        # Credit buttons
        credit_button_frame = ttk.Frame(credit_form_frame)
        credit_button_frame.grid(row=5, column=0, columnspan=2, pady=10)
        
        ttk.Button(credit_button_frame, text="Create Credit Sale", command=self.create_credit_sale).pack(side=tk.LEFT, padx=2)
        ttk.Button(credit_button_frame, text="Add Payment", command=self.add_payment).pack(side=tk.LEFT, padx=2)
        ttk.Button(credit_button_frame, text="Clear", command=self.clear_credit_form).pack(side=tk.LEFT, padx=2)
        
        # Credit transactions list
        credit_list_frame = ttk.LabelFrame(right_credit_panel, text="Credit Transactions", padding=10)
        credit_list_frame.pack(fill=tk.BOTH, expand=True)
        
        # Treeview for credit transactions
        credit_columns = ('ID', 'Product', 'Customer', 'Total', 'Paid', 'Remaining', 'Date')
        self.credit_tree = ttk.Treeview(credit_list_frame, columns=credit_columns, show='headings', height=15)
        
        for col in credit_columns:
            self.credit_tree.heading(col, text=col)
            self.credit_tree.column(col, width=100)
        
        # Credit scrollbar
        credit_scrollbar = ttk.Scrollbar(credit_list_frame, orient=tk.VERTICAL, command=self.credit_tree.yview)
        self.credit_tree.configure(yscrollcommand=credit_scrollbar.set)
        
        self.credit_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        credit_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Load credit transactions
        self.load_credit_transactions()
        
        # Summary frame
        summary_frame = ttk.LabelFrame(left_credit_panel, text="Credit Summary", padding=10)
        summary_frame.pack(fill=tk.X, pady=(10, 0))
        
        self.total_credits_var = tk.StringVar()
        self.total_paid_var = tk.StringVar()
        self.total_outstanding_var = tk.StringVar()
        
        ttk.Label(summary_frame, text="Total Credits:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Label(summary_frame, textvariable=self.total_credits_var).grid(row=0, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(summary_frame, text="Total Paid:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Label(summary_frame, textvariable=self.total_paid_var).grid(row=1, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(summary_frame, text="Outstanding:").grid(row=2, column=0, sticky=tk.W, pady=2)
        ttk.Label(summary_frame, textvariable=self.total_outstanding_var, font=("Arial", 10, "bold")).grid(row=2, column=1, sticky=tk.W, pady=2)
        
        self.update_credit_summary()
    
    def calculate_dzd(self, event=None):
        """Calculate DZD price from USD"""
        try:
            usd_value = float(self.cost_usd_var.get())
            dzd_value = usd_value * self.usd_to_dzd_rate
            self.cost_dzd_var.set(f"{dzd_value:.2f}")
        except ValueError:
            self.cost_dzd_var.set("")
    
    def browse_picture(self):
        """Browse for product picture"""
        file_path = filedialog.askopenfilename(
            title="Select Product Picture",
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.gif *.bmp")]
        )
        if file_path:
            self.picture_path_var.set(file_path)
            self.picture_label.config(text=os.path.basename(file_path))
    
    def browse_package_image(self):
        """Browse for package image"""
        file_path = filedialog.askopenfilename(
            title="Select Package Image",
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.gif *.bmp")]
        )
        if file_path:
            self.package_image_path_var.set(file_path)
            self.package_img_label.config(text=os.path.basename(file_path))
    
    def add_product(self):
        """Add a new product to the database"""
        if not self.name_var.get():
            messagebox.showerror("Error", "Product name is required!")
            return
        
        try:
            self.cursor.execute('''
                INSERT INTO products (name, category, cost_price_usd, cost_price_dzd, 
                                    transport_price, sale_price, picture_path, package_size,
                                    package_image_path, arrival_date, sale_date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                self.name_var.get(),
                self.category_var.get(),
                float(self.cost_usd_var.get()) if self.cost_usd_var.get() else 0,
                float(self.cost_dzd_var.get()) if self.cost_dzd_var.get() else 0,
                float(self.transport_var.get()) if self.transport_var.get() else 0,
                float(self.sale_price_var.get()) if self.sale_price_var.get() else 0,
                self.picture_path_var.get(),
                self.package_size_var.get(),
                self.package_image_path_var.get(),
                self.arrival_date_var.get(),
                self.sale_date_var.get(),
                self.status_var.get()
            ))
            
            self.conn.commit()
            messagebox.showinfo("Success", "Product added successfully!")
            self.clear_form()
            self.load_products()
            
        except ValueError as e:
            messagebox.showerror("Error", "Please enter valid numeric values for prices!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add product: {str(e)}")
    
    def update_product(self):
        """Update selected product"""
        selection = self.product_tree.selection()
        if not selection:
            messagebox.showerror("Error", "Please select a product to update!")
            return
        
        if not self.name_var.get():
            messagebox.showerror("Error", "Product name is required!")
            return
        
        try:
            item = self.product_tree.item(selection[0])
            product_id = item['values'][0]
            
            self.cursor.execute('''
                UPDATE products SET name=?, category=?, cost_price_usd=?, cost_price_dzd=?, 
                                  transport_price=?, sale_price=?, picture_path=?, package_size=?,
                                  package_image_path=?, arrival_date=?, sale_date=?, status=?
                WHERE id=?
            ''', (
                self.name_var.get(),
                self.category_var.get(),
                float(self.cost_usd_var.get()) if self.cost_usd_var.get() else 0,
                float(self.cost_dzd_var.get()) if self.cost_dzd_var.get() else 0,
                float(self.transport_var.get()) if self.transport_var.get() else 0,
                float(self.sale_price_var.get()) if self.sale_price_var.get() else 0,
                self.picture_path_var.get(),
                self.package_size_var.get(),
                self.package_image_path_var.get(),
                self.arrival_date_var.get(),
                self.sale_date_var.get(),
                self.status_var.get(),
                product_id
            ))
            
            self.conn.commit()
            messagebox.showinfo("Success", "Product updated successfully!")
            self.clear_form()
            self.load_products()
            
        except ValueError as e:
            messagebox.showerror("Error", "Please enter valid numeric values for prices!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to update product: {str(e)}")
    
    def delete_product(self):
        """Delete selected product"""
        selection = self.product_tree.selection()
        if not selection:
            messagebox.showerror("Error", "Please select a product to delete!")
            return
        
        if messagebox.askyesno("Confirm", "Are you sure you want to delete this product?"):
            try:
                item = self.product_tree.item(selection[0])
                product_id = item['values'][0]
                
                self.cursor.execute('DELETE FROM products WHERE id=?', (product_id,))
                self.conn.commit()
                
                messagebox.showinfo("Success", "Product deleted successfully!")
                self.clear_form()
                self.load_products()
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to delete product: {str(e)}")
    
    def clear_form(self):
        """Clear all form fields"""
        for var in [self.name_var, self.category_var, self.cost_usd_var, self.cost_dzd_var,
                   self.transport_var, self.sale_price_var, self.package_size_var,
                   self.arrival_date_var, self.sale_date_var]:
            var.set("")
        self.picture_path_var.set("")
        self.package_image_path_var.set("")
        self.picture_label.config(text="No image selected")
        self.package_img_label.config(text="No image selected")
        self.status_var.set("In Stock")
        self.arrival_date_var.set(datetime.now().strftime("%Y-%m-%d"))
    
    def load_products(self):
        """Load products from database into the treeview"""
        # Clear existing items
        for item in self.product_tree.get_children():
            self.product_tree.delete(item)
        
        # Load products
        self.cursor.execute('SELECT id, name, category, cost_price_usd, cost_price_dzd, sale_price, status FROM products')
        for row in self.cursor.fetchall():
            self.product_tree.insert('', 'end', values=row)
    
    def on_product_select(self, event):
        """Handle product selection in treeview"""
        selection = self.product_tree.selection()
        if selection:
            item = self.product_tree.item(selection[0])
            product_id = item['values'][0]
            
            # Load product details from database
            self.cursor.execute('SELECT * FROM products WHERE id=?', (product_id,))
            product = self.cursor.fetchone()
            
            if product:
                # Fill form with product data
                self.name_var.set(product[1] or "")  # name
                self.category_var.set(product[2] or "")  # category
                self.cost_usd_var.set(str(product[3]) if product[3] else "")  # cost_price_usd
                self.cost_dzd_var.set(str(product[4]) if product[4] else "")  # cost_price_dzd
                self.transport_var.set(str(product[5]) if product[5] else "")  # transport_price
                self.sale_price_var.set(str(product[6]) if product[6] else "")  # sale_price
                self.picture_path_var.set(product[7] or "")  # picture_path
                self.package_size_var.set(product[8] or "")  # package_size
                self.package_image_path_var.set(product[9] or "")  # package_image_path
                self.arrival_date_var.set(product[10] or "")  # arrival_date
                self.sale_date_var.set(product[11] or "")  # sale_date
                self.status_var.set(product[12] or "In Stock")  # status
                
                # Update picture labels
                if product[7]:
                    self.picture_label.config(text=os.path.basename(product[7]))
                else:
                    self.picture_label.config(text="No image selected")
                
                if product[9]:
                    self.package_img_label.config(text=os.path.basename(product[9]))
                else:
                    self.package_img_label.config(text="No image selected")
    
    def view_product_details(self):
        """View detailed information about selected product"""
        selection = self.product_tree.selection()
        if not selection:
            messagebox.showerror("Error", "Please select a product to view details!")
            return
        
        item = self.product_tree.item(selection[0])
        product_id = item['values'][0]
        
        # Load product details from database
        self.cursor.execute('SELECT * FROM products WHERE id=?', (product_id,))
        product = self.cursor.fetchone()
        
        if product:
            # Create details window
            details_window = tk.Toplevel(self.root)
            details_window.title(f"Product Details - {product[1]}")
            details_window.geometry("600x700")
            details_window.configure(bg="#f0f0f0")
            
            # Create scrollable frame
            canvas = tk.Canvas(details_window, bg="#f0f0f0")
            scrollbar = ttk.Scrollbar(details_window, orient="vertical", command=canvas.yview)
            scrollable_frame = ttk.Frame(canvas)
            
            scrollable_frame.bind(
                "<Configure>",
                lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
            )
            
            canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
            canvas.configure(yscrollcommand=scrollbar.set)
            
            # Product information
            info_frame = ttk.LabelFrame(scrollable_frame, text="Product Information", padding=20)
            info_frame.pack(fill=tk.X, padx=20, pady=10)
            
            details = [
                ("Product Name:", product[1]),
                ("Category:", product[2]),
                ("Cost Price (USD):", f"${product[3]:.2f}" if product[3] else "N/A"),
                ("Cost Price (DZD):", f"{product[4]:.2f} DZD" if product[4] else "N/A"),
                ("Transport Price:", f"${product[5]:.2f}" if product[5] else "N/A"),
                ("Sale Price:", f"${product[6]:.2f}" if product[6] else "N/A"),
                ("Package Size:", product[8] or "N/A"),
                ("Arrival Date:", product[10] or "N/A"),
                ("Sale Date:", product[11] or "N/A"),
                ("Status:", product[12] or "N/A"),
            ]
            
            for i, (label, value) in enumerate(details):
                ttk.Label(info_frame, text=label, font=("Arial", 10, "bold")).grid(
                    row=i, column=0, sticky=tk.W, pady=5, padx=(0, 10)
                )
                ttk.Label(info_frame, text=str(value)).grid(
                    row=i, column=1, sticky=tk.W, pady=5
                )
            
            # Product image
            if product[7] and os.path.exists(product[7]):
                try:
                    image_frame = ttk.LabelFrame(scrollable_frame, text="Product Image", padding=20)
                    image_frame.pack(fill=tk.X, padx=20, pady=10)
                    
                    image = Image.open(product[7])
                    image.thumbnail((300, 300), Image.Resampling.LANCZOS)
                    photo = ImageTk.PhotoImage(image)
                    
                    image_label = tk.Label(image_frame, image=photo, bg="#f0f0f0")
                    image_label.image = photo  # Keep a reference
                    image_label.pack()
                except Exception as e:
                    print(f"Error loading image: {e}")
            
            # Package image
            if product[9] and os.path.exists(product[9]):
                try:
                    package_frame = ttk.LabelFrame(scrollable_frame, text="Package Image", padding=20)
                    package_frame.pack(fill=tk.X, padx=20, pady=10)
                    
                    package_image = Image.open(product[9])
                    package_image.thumbnail((300, 300), Image.Resampling.LANCZOS)
                    package_photo = ImageTk.PhotoImage(package_image)
                    
                    package_label = tk.Label(package_frame, image=package_photo, bg="#f0f0f0")
                    package_label.image = package_photo  # Keep a reference
                    package_label.pack()
                except Exception as e:
                    print(f"Error loading package image: {e}")
            
            # Profit calculation
            if product[3] and product[6]:  # cost_price_usd and sale_price
                profit_frame = ttk.LabelFrame(scrollable_frame, text="Profit Analysis", padding=20)
                profit_frame.pack(fill=tk.X, padx=20, pady=10)
                
                total_cost = product[3] + (product[5] or 0)  # cost + transport
                profit = product[6] - total_cost
                profit_margin = (profit / product[6]) * 100 if product[6] > 0 else 0
                
                ttk.Label(profit_frame, text=f"Total Cost: ${total_cost:.2f}", font=("Arial", 10)).pack(anchor=tk.W)
                ttk.Label(profit_frame, text=f"Sale Price: ${product[6]:.2f}", font=("Arial", 10)).pack(anchor=tk.W)
                ttk.Label(profit_frame, text=f"Profit: ${profit:.2f}", font=("Arial", 10, "bold")).pack(anchor=tk.W)
                ttk.Label(profit_frame, text=f"Profit Margin: {profit_margin:.1f}%", font=("Arial", 10)).pack(anchor=tk.W)
            
            canvas.pack(side="left", fill="both", expand=True)
            scrollbar.pack(side="right", fill="y")
    
    def calculate_remaining(self, event=None):
        """Calculate remaining amount for credit"""
        try:
            total = float(self.total_amount_var.get()) if self.total_amount_var.get() else 0
            paid = float(self.amount_paid_var.get()) if self.amount_paid_var.get() else 0
            remaining = total - paid
            self.amount_remaining_var.set(f"{remaining:.2f}")
        except ValueError:
            self.amount_remaining_var.set("")
    
    def update_credit_products(self):
        """Update the product dropdown for credit sales"""
        self.cursor.execute('SELECT id, name, sale_price FROM products WHERE status="In Stock"')
        products = self.cursor.fetchall()
        product_list = [f"{p[0]} - {p[1]} (${p[2]:.2f})" for p in products]
        self.credit_product_combo['values'] = product_list
    
    def create_credit_sale(self):
        """Create a new credit sale"""
        if not self.credit_product_var.get() or not self.customer_name_var.get():
            messagebox.showerror("Error", "Please select a product and enter customer name!")
            return
        
        try:
            # Extract product ID from selection
            product_id = int(self.credit_product_var.get().split(' - ')[0])
            
            total_amount = float(self.total_amount_var.get()) if self.total_amount_var.get() else 0
            amount_paid = float(self.amount_paid_var.get()) if self.amount_paid_var.get() else 0
            amount_remaining = total_amount - amount_paid
            
            # Insert credit transaction
            self.cursor.execute('''
                INSERT INTO credit_transactions (product_id, customer_name, amount_paid, amount_remaining, transaction_date)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                product_id,
                self.customer_name_var.get(),
                amount_paid,
                amount_remaining,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ))
            
            # Update product status if fully paid
            if amount_remaining <= 0:
                self.cursor.execute('UPDATE products SET status="Sold", sale_date=? WHERE id=?', 
                                  (datetime.now().strftime("%Y-%m-%d"), product_id))
            else:
                self.cursor.execute('UPDATE products SET status="Reserved" WHERE id=?', (product_id,))
            
            self.conn.commit()
            messagebox.showinfo("Success", "Credit sale created successfully!")
            
            self.clear_credit_form()
            self.load_credit_transactions()
            self.update_credit_summary()
            self.load_products()  # Refresh product list
            
        except ValueError:
            messagebox.showerror("Error", "Please enter valid numeric values!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create credit sale: {str(e)}")
    
    def add_payment(self):
        """Add a payment to existing credit"""
        # This would require selecting an existing credit transaction
        messagebox.showinfo("Info", "Payment addition functionality - select a credit transaction first")
    
    def clear_credit_form(self):
        """Clear credit form fields"""
        self.credit_product_var.set("")
        self.customer_name_var.set("")
        self.total_amount_var.set("")
        self.amount_paid_var.set("")
        self.amount_remaining_var.set("")
    
    def load_credit_transactions(self):
        """Load credit transactions into the treeview"""
        # Clear existing items
        for item in self.credit_tree.get_children():
            self.credit_tree.delete(item)
        
        # Load transactions with product details
        self.cursor.execute('''
            SELECT ct.id, p.name, ct.customer_name, 
                   (ct.amount_paid + ct.amount_remaining) as total,
                   ct.amount_paid, ct.amount_remaining, ct.transaction_date
            FROM credit_transactions ct
            JOIN products p ON ct.product_id = p.id
            ORDER BY ct.transaction_date DESC
        ''')
        
        for row in self.cursor.fetchall():
            self.credit_tree.insert('', 'end', values=row)
    
    def update_credit_summary(self):
        """Update credit summary statistics"""
        # Calculate totals
        self.cursor.execute('''
            SELECT 
                SUM(amount_paid + amount_remaining) as total_credits,
                SUM(amount_paid) as total_paid,
                SUM(amount_remaining) as total_outstanding
            FROM credit_transactions
        ''')
        
        result = self.cursor.fetchone()
        if result:
            total_credits = result[0] or 0
            total_paid = result[1] or 0
            total_outstanding = result[2] or 0
            
            self.total_credits_var.set(f"${total_credits:.2f}")
            self.total_paid_var.set(f"${total_paid:.2f}")
            self.total_outstanding_var.set(f"${total_outstanding:.2f}")
    
    def run(self):
        """Start the application"""
        self.root.mainloop()
        self.conn.close()

if __name__ == "__main__":
    app = ProductManager()
    app.run()