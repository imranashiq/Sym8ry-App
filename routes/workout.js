const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout');
const upload = require('../utills/upload');

router.post('/createWorkout', upload.single('video'), workoutController.createWorkout);

router.get('/getAllWorkouts', workoutController.getAllWorkouts);

router.get('/getWorkoutById/:id', workoutController.getWorkoutById);

router.put('/updateWorkout/:id', upload.single('video'), workoutController.updateWorkout);

router.delete('/deleteWorkout/:id', workoutController.deleteWorkout);

module.exports = router;
