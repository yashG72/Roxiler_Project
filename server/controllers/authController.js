
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  
  const { name, email, password, address } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  
  try {
    
    const userQuery = 'SELECT email FROM users WHERE email = ?';
    const [existingUsers] = await db.query(userQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    
    const insertQuery = 'INSERT INTO users (name, email, password_hash, address) VALUES (?, ?, ?, ?)';
    await db.query(insertQuery, [name, email, password_hash, address]);

    
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.query(userQuery, [email]);

    if (users.length === 0) {
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );
    
    
    res.status(200).json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};