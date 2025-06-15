const UserWorkout = require('../models/userWorkout');
const User = require('../models/users');
const { validateRequiredFields } = require("../utills/validateRequiredFields");

exports.createUserWorkout = async (req, res) => {
  try {
        const userId = req.user.userId; // Get the authenticated user's ID

    const { workoutId, trainerId, date, weightPerSet } = req.body;

    // Validate required fields
    const requiredFields = ["workoutId", "trainerId", "date", "weightPerSet"];
    const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }

    // Validate weightPerSet is an array
    if (!Array.isArray(weightPerSet)) {
      return res.status(400).json({
        success: false,
        message: "weightPerSet must be an array of set objects",
      });
    }
    // Create the user workout
    const userWorkout = await UserWorkout.create({
      workoutId,
      trainerId,
      userId,
      date,
      weightPerSet,
    });

    res.status(201).json({ success: true, data: userWorkout });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUserWorkouts = async (req, res) => {
  try {
    const { userId, trainerId, workoutId } = req.query;
    const whereCondition = { permanentDeleted: false };
    
    if (userId) whereCondition.userId = userId;
    if (trainerId) whereCondition.trainerId = trainerId;
    if (workoutId) whereCondition.workoutId = workoutId;

    const userWorkouts = await UserWorkout.findAll({
      where: whereCondition,
      include: [
        {
          model: Workout,
          as: 'workout',
          attributes: ['id', 'title', 'description', 'muscle']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({ success: true, data: userWorkouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const userWorkout = await UserWorkout.findOne({
      where: { id, permanentDeleted: false },
      include: [
        {
          model: Workout,
          as: 'workout',
          attributes: ['id', 'title', 'description', 'muscle']
        },
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!userWorkout) {
      return res.status(404).json({ success: false, message: 'User workout not found' });
    }

    res.status(200).json({ success: true, data: userWorkout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { weightPerSet, date } = req.body;

    const userWorkout = await UserWorkout.findByPk(id);
    if (!userWorkout) {
      return res.status(404).json({ success: false, message: 'User workout not found' });
    }

    // Validate weightPerSet if provided
    if (weightPerSet && !Array.isArray(weightPerSet)) {
      return res.status(400).json({
        success: false,
        message: "weightPerSet must be an array of set objects",
      });
    }

    const updateData = {};
    if (weightPerSet) updateData.weightPerSet = weightPerSet;
    if (date) updateData.date = date;

    await userWorkout.update(updateData);

    res.status(200).json({ success: true, data: userWorkout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUserWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userWorkout = await UserWorkout.findByPk(id);
    if (!userWorkout) {
      return res.status(404).json({ success: false, message: 'User workout not found' });
    }

    await userWorkout.update({ permanentDeleted: true });

    res.status(200).json({ success: true, message: 'User workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};