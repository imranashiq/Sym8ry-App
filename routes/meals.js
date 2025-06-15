const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal');
const userAuth = require("../middlewares/userAuth");

router.post('/createMeal',mealController.createMeal);
router.get('/getAllMeals', mealController.getAllMeals);
router.get('/getMealById/:id', mealController.getMealById);
router.put('/updateMeal/:id', mealController.updateMeal);
router.delete('/deleteMeal/:id', mealController.deleteMeal);

module.exports = router;
