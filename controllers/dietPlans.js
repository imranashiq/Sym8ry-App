const DietPlans = require('../models/dietPlans');
const User = require('../models/users');
const Coaching = require('../models/coaching');
const UserDiet = require('../models/userDiet');

const { validateRequiredFields } = require("../utills/validateRequiredFields");
const { Op } = require("sequelize"); 

exports.createDietPlan = async (req, res) => {
    try {
        const trainerId = req.user.userId; // Get the authenticated user's ID

        const { title, coachingId } = req.body;

        const requiredFields = ["title", "coachingId"];
        const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
        if (missingFieldMessage) {
            return res.status(400).json({
                success: false,
                message: missingFieldMessage,
            });
        }

        // Create the diet plan
        const dietPlan = await DietPlans.create({
            title,
            trainerId,
            coachingId
        });

        res.status(201).json({ success: true, data: dietPlan });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// exports.getAllDietPlans = async (req, res) => {
//     try {
//         const { trainerId, coachingId } = req.query;
//         const whereCondition = { permanentDeleted: false };

//         if (trainerId) whereCondition.trainerId = trainerId;
//         if (coachingId) whereCondition.coachingId = coachingId;

//         const dietPlans = await DietPlans.findAll({
//             where: whereCondition,
//             include: [
//                 {
//                     model: User,
//                     as: 'trainer_details',
//                     attributes: ['id', 'fullName', 'email']
//                 },
//                 {
//                     model: Coaching,
//                     as: 'coaching_details',
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });

//         res.status(200).json({ success: true, data: dietPlans });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


exports.getAllDietPlans = async (req, res) => {
    try {
        const { trainerId, coachingId } = req.query;
        const userId = req.user.userId; // Assuming user ID is available in req.user
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate date comparison

        const whereCondition = { permanentDeleted: false };

        if (trainerId) whereCondition.trainerId = trainerId;
        if (coachingId) whereCondition.coachingId = coachingId;

        const dietPlans = await DietPlans.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: 'trainer_details',
                    attributes: ['id', 'fullName', 'email']
                },
                {
                    model: Coaching,
                    as: 'coaching_details',
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Check completion status for each diet plan
        const dietPlansWithCompletion = await Promise.all(dietPlans.map(async (plan) => {
            const userDietRecord = await UserDiet.findOne({
                where: {
                    userId: userId,
                    dietPlanId: plan.id,
                    date: {
                        [Op.gte]: today, // Records from today onwards
                        [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Until end of today
                    },
                    permanentDeleted: false
                }
            });
            
            return {
                ...plan.toJSON(),
                completed: !!userDietRecord // true if record exists, false otherwise
            };
        }));

        res.status(200).json({ success: true, data: dietPlansWithCompletion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDietPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const dietPlan = await DietPlans.findOne({
            where: { id, permanentDeleted: false },
            include: [
                {
                    model: User,
                    as: 'trainer_details',
                    attributes: ['id', 'fullName', 'email']
                },
                {
                    model: Coaching,
                    as: 'coaching_details',
                }
            ]
        });

        if (!dietPlan) {
            return res.status(404).json({ success: false, message: 'Diet plan not found' });
        }

        res.status(200).json({ success: true, data: dietPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateDietPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, coachingId } = req.body;

        const dietPlan = await DietPlans.findByPk(id);
        if (!dietPlan) {
            return res.status(404).json({ success: false, message: 'Diet plan not found' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (coachingId) updateData.coachingId = coachingId;

        await dietPlan.update(updateData);

        res.status(200).json({ success: true, data: dietPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteDietPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const dietPlan = await DietPlans.findByPk(id);
        if (!dietPlan) {
            return res.status(404).json({ success: false, message: 'Diet plan not found' });
        }

        await dietPlan.update({ permanentDeleted: true });

        res.status(200).json({ success: true, message: 'Diet plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};