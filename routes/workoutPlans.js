const express = require('express');
const router = express.Router();
const workoutPlan = require('../controllers/workoutPlan');
const userAuth = require("../middlewares/userAuth");

router.post('/createWorkoutPlan',userAuth, workoutPlan.createWorkoutPlan);
router.get('/getAllWorkoutPlans', workoutPlan.getAllWorkoutPlans);
router.get('/getWorkoutPlanById/:id', workoutPlan.getWorkoutPlanById);
router.put('/updateWorkoutPlan/:id', workoutPlan.updateWorkoutPlan);
router.delete('/deleteWorkoutPlan/:id', workoutPlan.deleteWorkoutPlan);

module.exports = router;
