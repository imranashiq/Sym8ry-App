const Meal = require('../models/meal');
const DietPlan = require('../models/dietPlans');
const { validateRequiredFields } = require("../utills/validateRequiredFields");

exports.createMeal = async (req, res) => {
  try {
    let mealsData = Array.isArray(req.body) ? req.body : req.body.mealsData;

    if (!mealsData) {
      return res.status(400).json({
        success: false,
        message: "Please provide meals data either as an array or in a 'mealsData' property"
      });
    }

    if (!Array.isArray(mealsData)) {
      return res.status(400).json({
        success: false,
        message: "Meals data should be an array of meal objects"
      });
    }

    const requiredFields = ["name", "kcal", "dietPlanId", "items"];
    const validationErrors = [];

    mealsData.forEach((meal, index) => {
      const missingFieldMessage = validateRequiredFields(requiredFields, meal);
      if (missingFieldMessage) {
        validationErrors.push(`Meal at index ${index}: ${missingFieldMessage}`);
      }
      
      if (meal.items && !Array.isArray(meal.items)) {
        validationErrors.push(`Meal at index ${index}: items must be an array`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors
      });
    }

    // Prepare meals for bulk creation
    const mealsToCreate = mealsData.map(meal => ({
      name: meal.name,
      kcal: meal.kcal,
      items: meal.items || [],
      dietPlanId: meal.dietPlanId
    }));

    // Create all meals in a single transaction
    const createdMeals = await Meal.bulkCreate(mealsToCreate);

    res.status(201).json({ 
      success: true, 
      data: createdMeals,
      message: `${createdMeals.length} meals created successfully`
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

exports.getAllMeals = async (req, res) => {
  try {
    const { dietPlanId } = req.query;
    const whereCondition = { permanentDeleted: false };
    
    if (dietPlanId) whereCondition.dietPlanId = dietPlanId;

    const meals = await Meal.findAll({
      where: whereCondition,
      include: [
        {
          model: DietPlan,
          as: 'dietPlan_details',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: meals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findOne({
      where: { id, permanentDeleted: false },
      include: [
        {
          model: DietPlan,
          as: 'dietPlan_details',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, kcal, items } = req.body;

    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    // Validate items is an array if provided
    if (items && !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items must be an array",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (kcal) updateData.kcal = kcal;
    if (items) updateData.items = items;

    await meal.update(updateData);

    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }

    await meal.update({ permanentDeleted: true });

    res.status(200).json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};