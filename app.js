require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const coachingRoutes = require('./routes/coaching');
const workoutPlanRoutes = require('./routes/workoutPlans');
const workoutRoutes = require('./routes/workout')
const userWorkoutRoutes = require('./routes/userWorkout');
const dietPlanRoutes = require('./routes/dietPlans');
const mealRoutes = require('./routes/meals');
const userDietRoutes = require('./routes/userDiet');



const sequelize = require('./db/db');

app.use(express.json());

// Routes
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', authRoutes);
app.use('/api/v1', coachingRoutes);
app.use('/api/v1', workoutPlanRoutes);
app.use('/api/v1', workoutRoutes);
app.use('/api/v1', userWorkoutRoutes);
app.use('/api/v1', dietPlanRoutes);
app.use('/api/v1', mealRoutes);
app.use('/api/v1', userDietRoutes);
app.use('/api/v1', userRoutes);





//First run with sync({ force: true }) to completely recreate tables

// Then switch to sync({ alter: true }) for incremental changes
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
