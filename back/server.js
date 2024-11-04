const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS setup: Allow requests from any localhost port
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin like mobile apps or curl requests
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// Database connection
const db = new sqlite3.Database('ecommerce.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Ensure tables are created
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table ensured successfully.");
        }
    });

    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        category TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating products table:", err.message);
        } else {
            console.log("Products table ensured successfully.");
        }
    });

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        orderDetails TEXT,
        totalPrice REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error("Error creating orders table:", err.message);
        } else {
            console.log("Orders table ensured successfully.");
        }
    });

    // Admins Table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating admins table:", err.message);
        } else {
            console.log("Admins table ensured successfully.");
        }
    });
});

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    }
});

const upload = multer({ storage });

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.sendStatus(403); // Forbidden
    }
    jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecretKey', (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Attach user info
        next();
    });
};

// Admin Authentication Middleware
const authenticateAdminJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.sendStatus(403); // Forbidden
    }
    jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultSecretKey', (err, admin) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.admin = admin; // Attach admin info
        next();
    });
};

// CRUD Operations for Products

// Get all products or products by category
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    const sqlQuery = category ? 
        'SELECT * FROM products WHERE category = ?' : 
        'SELECT * FROM products';

    db.all(sqlQuery, [category], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.path : null;

    db.run(`INSERT INTO products (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)`, 
        [name, price, description, image, category], 
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, price, description, image, category });
        });
});

// Delete Product by ID
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    
    db.get('SELECT image FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Delete associated image file if it exists
        if (row && row.image) {
            fs.unlink(row.image, (err) => {
                if (err) {
                    console.error(`Failed to delete the file: ${err}`);
                }
            });
        }

        db.run('DELETE FROM products WHERE id = ?', productId, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Product deleted." });
        });
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    });
});

// User Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
            [username, email, hashedPassword], 
            function (err) {
                if (err) return res.status(500).json({ message: 'Error creating user.' });
                res.status(201).json({ message: 'User created successfully!', userId: this.lastID });
            });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// User Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
            if (err) reject(err);
            resolve(user);
        });
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'yourDefaultSecretKey', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username } });
});

// Place an Order endpoint
// Place an Order endpoint
app.post('/api/orders', authenticateJWT, (req, res) => {
    const { orderDetails, totalPrice } = req.body;

    if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
        return res.status(400).json({ message: 'Invalid order details.' });
    }

    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
        return res.status(400).json({ message: 'Invalid total price.' });
    }

    // Ensure the orderDetails includes image property
    const orderDetailsString = JSON.stringify(orderDetails.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image // Include image in order details string
    })));

    db.run(`INSERT INTO orders (userId, orderDetails, totalPrice) VALUES (?, ?, ?)`, 
        [req.user.id, orderDetailsString, totalPrice], 
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to place order." });
            }
            return res.json({ success: true, message: "Order placed successfully!", orderId: this.lastID });
        });
});
// Get Orders for a User
// Get Orders for a User
app.get('/api/orders', authenticateJWT, (req, res) => {
    db.all('SELECT * FROM orders WHERE userId = ?', [req.user.id], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders.' });
        }
        
        // Parse orderDetails from JSON string to object
        const enrichedOrders = orders.map(order => ({
            ...order,
            // Parse the JSON string back to an object
            orderDetails: JSON.parse(order.orderDetails)
        }));
        
        return res.json({ success: true, orders: enrichedOrders });
    });
});
// Admin Signup endpoint
app.post('/api/admin/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingAdmin = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM admins WHERE username = ?`, [username], (err, admin) => {
                if (err) reject(err);
                resolve(admin);
            });
        });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, 
            [username, hashedPassword], 
            function (err) {
                if (err) return res.status(500).json({ message: 'Error creating admin.' });
                res.status(201).json({ message: 'Admin created successfully!', adminId: this.lastID });
            });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// Admin Login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    const admin = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM admins WHERE username = ?`, [username], (err, admin) => {
            if (err) reject(err);
            resolve(admin);
        });
    });

    if (!admin) return res.status(401).json({ message: 'Admin not found' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'yourDefaultSecretKey', { expiresIn: '1h' });

    res.json({ token, admin: { id: admin.id, username: admin.username } });
});

// Example protected route for Admin
app.get('/api/admin/protected', authenticateAdminJWT, (req, res) => {
    res.json({ message: 'Welcome to the admin protected route!', admin: req.admin });
});

// Get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users.' });
        }
        return res.json(users);
    });
});
app.get('/api/order', (req, res) => {
    const query = 'SELECT * FROM orders'; // assuming 'orders' is your table name
    db.all(query, [], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        return res.json(orders);
    });
});

// Make sure there's no middleware that protects this route
// Server setup
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});