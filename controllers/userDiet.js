const UserDiet = require('../models/userDiet');
const User = require('../models/users');
const DietPlan = require('../models/dietPlans');
const { validateRequiredFields } = require("../utills/validateRequiredFields");

exports.createUserDiet = async (req, res) => {
  try {
    const userId=req.user.userId
    const {  dietPlanId, date } = req.body;

    const requiredFields = ["date", "dietPlanId"];
    const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }

    // Create the user diet
    const userDiet = await UserDiet.create({
      userId,
      dietPlanId,
      date: date || new Date() // Use current date if not provided
    });

    res.status(201).json({ success: true, data: userDiet });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllUserDiets = async (req, res) => {
  try {
    const { userId, dietPlanId } = req.query;
    const whereCondition = { permanentDeleted: false };
    
    if (userId) whereCondition.userId = userId;
    if (dietPlanId) whereCondition.dietPlanId = dietPlanId;

    const userDiets = await UserDiet.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user_details',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: DietPlan,
          as: 'dietPlan_details',
          attributes: ['id', 'title']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({ success: true, data: userDiets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserDietById = async (req, res) => {
  try {
    const { id } = req.params;
    const userDiet = await UserDiet.findOne({
      where: { id, permanentDeleted: false },
      include: [
        {
          model: User,
          as: 'user_details',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: DietPlan,
          as: 'dietPlan_details',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!userDiet) {
      return res.status(404).json({ success: false, message: 'User diet not found' });
    }

    res.status(200).json({ success: true, data: userDiet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const { dietPlanId, date } = req.body;

    const userDiet = await UserDiet.findByPk(id);
    if (!userDiet) {
      return res.status(404).json({ success: false, message: 'User diet not found' });
    }

    const updateData = {};
    if (dietPlanId) updateData.dietPlanId = dietPlanId;
    if (date) updateData.date = date;

    await userDiet.update(updateData);

    res.status(200).json({ success: true, data: userDiet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUserDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const userDiet = await UserDiet.findByPk(id);
    if (!userDiet) {
      return res.status(404).json({ success: false, message: 'User diet not found' });
    }

    await userDiet.update({ permanentDeleted: true });

    res.status(200).json({ success: true, message: 'User diet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};