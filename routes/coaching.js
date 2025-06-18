const express = require('express');
const router = express.Router();
const coachingController = require('../controllers/coaching');
const userAuth = require("../middlewares/userAuth");

router.post('/createCoaching', coachingController.createCoaching);
router.get('/getAllCoachings',userAuth, coachingController.getAllCoachings);
router.get('/getCoachingById/:id', coachingController.getCoachingById);
router.get('/getSubscribers/:id', coachingController.getSubscribers);
router.put('/updateCoaching/:id', coachingController.updateCoaching);
router.delete('/deleteCoaching/:id', coachingController.deleteCoaching);
router.post('/addSubscriber', coachingController.addSubscriberToCoaching);

module.exports = router;
