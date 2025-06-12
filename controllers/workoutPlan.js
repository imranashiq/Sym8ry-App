const WorkoutPlan = require('../models/workoutPlan');
const Coaching = require('../models/coaching');
const User = require('../models/users');


exports.createWorkoutPlan = async (req, res) => {
  try {
    const coachId = req.user.userId
    console.log(coachId)
    const { title, description } = req.body;
    console.log(req.body)
    if (!title || !description || !coachId) {
      return res.status(400).json({ success: false, message: "Title,coachId and description are required" });
    }

    const newPlan = await WorkoutPlan.create({ title, description, coachId });
    console.log(newPlan)
    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllWorkoutPlans = async (req, res) => {
  try {
    const { coachId } = req.query;

    const whereCondition = { permanentDeleted: false };
    if (coachId) {
      whereCondition.coachId = coachId;
    }

    const plans = await WorkoutPlan.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'coach_details',
          attributes: { exclude: ['password'] }
        },
        // { model: Coaching, as: 'coaching_details', }
      ]
    });

    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by ID
exports.getWorkoutPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await WorkoutPlan.findOne({
  where: {
    id,
    permanentDeleted: false
  },
  include: [
    {
      model: User,
      as: 'coach_details',
      attributes: { exclude: ['password'] }
    },
    // {
    //   model: Coaching,
    //   as: 'coaching_details',
    // }
  ]
});

    if (!plan) {
      return res.status(404).json({ success: false, message: "Workout Plan not found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
exports.updateWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const plan = await WorkoutPlan.findOne({ where: { id, permanentDeleted: false } });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Workout Plan not found" });
    }

    await plan.update({ title, description });

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete (soft delete)
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await WorkoutPlan.findOne({ where: { id, permanentDeleted: false } });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Workout Plan not found" });
    }

    await plan.update({ permanentDeleted: true });

    res.status(200).json({ success: true, message: "Workout Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
