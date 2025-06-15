const express = require('express');
const router = express.Router();
const dietPlanController = require('../controllers/dietPlans');
const userAuth = require("../middlewares/userAuth");

router.post('/createDietPlan', userAuth,dietPlanController.createDietPlan);
router.get('/getAllDietPlans',userAuth, dietPlanController.getAllDietPlans);
router.get('/getDietPlanById/:id', dietPlanController.getDietPlanById);
router.put('/updateDietPlan/:id', dietPlanController.updateDietPlan);
router.delete('/deleteDietPlan/:id', dietPlanController.deleteDietPlan);

module.exports = router;
