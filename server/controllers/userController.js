

const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    
    const userId = req.user.id;
    
    const query = 'SELECT id, name, email, address, role FROM users WHERE id = ?';
    const [users] = await db.query(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};