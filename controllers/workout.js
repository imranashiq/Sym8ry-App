const Workout = require('../models/workout');
const WorkoutPlan = require('../models/workoutPlan');
const UserWorkout = require('../models/userWorkout');
const { Op } = require("sequelize"); 

const { validateRequiredFields } = require("../utills/validateRequiredFields");

// const parseWorkoutsFromBody = (body) => {
//   const workouts = [];
//   let i = 0;

//   while (true) {
//     const key = `workouts[${i}].title`;
//     if (!(key in body)) break;

//     const workout = {
//       title: body[`workouts[${i}].title`],
//       description: body[`workouts[${i}].description`],
//       muscle: body[`workouts[${i}].muscle`],
//       sets: body[`workouts[${i}].sets`],
//       reps: body[`workouts[${i}].reps`],
//       weight: body[`workouts[${i}].weight`],
//       rest: body[`workouts[${i}].rest`],
//       workoutPlanId: body[`workouts[${i}].workoutPlanId`],
//     };

//     workouts.push(workout);
//     i++;
//   }

//   return workouts;
// };

exports.createWorkout = async (req, res) => {
  try {
    const workouts = req.body.workouts; // Expecting { workouts: [ {...}, {...} ] }
    // const workouts = parseWorkoutsFromBody(req.body);

    const files = req.files || []; // Expecting multiple files if uploaded
console.log(req.body)
    if (!Array.isArray(workouts) || workouts.length === 0) {
      return res.status(400).json({ success: false, message: "No workouts provided." });
    }

    const requiredFields = ["title", "description", "muscle", "sets", "reps", "weight", "workoutPlanId", "rest"];
    const createdWorkouts = [];

    for (let i = 0; i < workouts.length; i++) {
      const workoutData = workouts[i];

      // Validate required fields
      const missingFieldMessage = validateRequiredFields(requiredFields, workoutData);
      if (missingFieldMessage) {
        return res.status(400).json({
          success: false,
          message: `Workout ${i + 1}: ${missingFieldMessage}`,
        });
      }

      // Attach file if exists (if using Multer's `.fields()` or `.array()`)
      const video = files[i]?.filename || null;

      const created = await Workout.create({ ...workoutData, video });
      createdWorkouts.push(created);
    }

    res.status(201).json({ success: true, data: createdWorkouts });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// exports.getAllWorkouts = async (req, res) => {
//   try {
//         const userId = req.user.userId; // Get the authenticated user's ID

//     const { workoutPlanId, muscle } = req.query;
//     const whereCondition = { permanentDeleted: false };
    
//     if (workoutPlanId) whereCondition.workoutPlanId = workoutPlanId;
//     if (muscle) whereCondition.muscle = muscle;

//     const workouts = await Workout.findAll({
//       where: whereCondition,
//       include: [
//         {
//           model: WorkoutPlan,
//           as: 'workout_plan',
//           attributes: ['id', 'title']
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.status(200).json({ success: true, data: workouts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getAllWorkouts = async (req, res) => {
  try {
    const userId = req.user.userId; // Get the authenticated user's ID
    const { workoutPlanId, muscle } = req.query;
    
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const whereCondition = { permanentDeleted: false };
    
    if (workoutPlanId) whereCondition.workoutPlanId = workoutPlanId;
    if (muscle) whereCondition.muscle = muscle;

    // Find all workouts matching the criteria
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

    // Find all workout completions for this user today
    const completedWorkouts = await UserWorkout.findAll({
      where: {
        userId: userId,
        date: {
          [Op.gte]: today, // Greater than or equal to today at midnight
          [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow
        }
      },
      attributes: ['workoutId']
    });

    // Create a Set of completed workout IDs for quick lookup
    const completedWorkoutIds = new Set(completedWorkouts.map(w => w.workoutId));

    // Add completed flag to each workout
    const workoutsWithCompletion = workouts.map(workout => ({
      ...workout.toJSON(),
      completed: completedWorkoutIds.has(workout.id)
    }));

    res.status(200).json({ success: true, data: workoutsWithCompletion });
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
