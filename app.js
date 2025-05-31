require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const coachingRoutes = require('./routes/coaching');
const sequelize = require('./db/db');

app.use(express.json());

// Routes
// app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', coachingRoutes);

// Test DB Connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected...');
    return sequelize.sync(); // Sync models
  })
  .then(() => {
    console.log('✅ Models synchronized...');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
