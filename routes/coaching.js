const express = require('express');
const router = express.Router();
const coachingController = require('../controllers/coaching');

router.post('/createCoaching', coachingController.createCoaching);
router.get('/getAllCoachings', coachingController.getAllCoachings);
router.get('/getCoachingById/:id', coachingController.getCoachingById);
router.put('/updateCoaching/:id', coachingController.updateCoaching);
router.delete('/deleteCoaching/:id', coachingController.deleteCoaching);
router.post('/addSubscriber', coachingController.addSubscriberToCoaching);

module.exports = router;
