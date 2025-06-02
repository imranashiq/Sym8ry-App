const Workout = require('../models/workout');
const WorkoutPlan = require('../models/workoutPlan');
const { validateRequiredFields } = require("../utills/validateRequiredFields");


exports.createWorkout = async (req, res) => {
  try {
    const {title,description,muscle,sets,reps,weight,workoutPlanId,rest}=req.body
    const video = req.file?.filename || null;
     const requiredFields = ["title", "description", "muscle", "sets","reps","weight","workoutPlanId","rest"];
    const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }
    const workout = await Workout.create({ ...req.body, video });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllWorkouts = async (req, res) => {
  try {
    const { workoutPlanId } = req.query;
    const whereCondition = { permanentDeleted: false };
    if (workoutPlanId) whereCondition.workoutPlanId = workoutPlanId;

    const workouts = await Workout.findAll({
      where: whereCondition,
      include: [
        {
          model: WorkoutPlan,
          as: 'workout_plan',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await Workout.findOne({
      where: { id, permanentDeleted: false },
      include: [{ model: WorkoutPlan, as: 'workout_plan' }]
    });

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const video = req.file?.filename;

    const workout = await Workout.findByPk(id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    await workout.update({ ...req.body, ...(video && { video }) });

    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await Workout.findByPk(id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    await workout.update({ permanentDeleted: true });

    res.status(200).json({ success: true, message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
