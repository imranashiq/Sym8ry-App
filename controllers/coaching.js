const Coaching = require('../models/coaching')
const { validateRequiredFields } = require("../utills/validateRequiredFields");
const User = require('../models/users'); 

exports.createCoaching = async (req, res) => {
  try {
    const {
      title, description, workoutPlan, dietPlan,
      price, duration, coachId
    } = req.body;

     const requiredFields = ["title", "description", "workoutPlan", "dietPlan","price","duration","coachId"];
    const missingFieldMessage = validateRequiredFields(requiredFields, req.body);
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }

    const coaching = await Coaching.create({
      title,
      description,
      workoutPlan,
      dietPlan,
      price,
      duration,
      coachId,
    });

    res.status(201).json({ success: true, data: coaching });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCoachings = async (req, res) => {
  try {
    const userId = req.user.userId; // Get the authenticated user's ID
    const { coachId } = req.query;

    const whereCondition = { permanentDeleted: false };
    if (coachId) {
      whereCondition.coachId = coachId;
    }

    const coachings = await Coaching.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
    });

    const results = await Promise.all(coachings.map(async (coaching) => {
      const coachDetails = await User.findOne({ where: { id: coaching.coachId } });
      
      const subscribersDetails = coaching.subscriberIds && coaching.subscriberIds.length > 0
        ? await User.findAll({ where: { id: coaching.subscriberIds } })
        : [];

      // Check if the current user is subscribed to this coaching
      const subscribed = coaching.subscriberIds && coaching.subscriberIds.includes(userId);

      return {
        ...coaching.toJSON(),
        coachDetails,
        subscribersDetails,
        subscribed // Add the subscribed flag
      };
    }));

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCoachingById = async (req, res) => {
  try {
    const { id } = req.params;
    const coaching = await Coaching.findOne({ where: { id, permanentDeleted: false } });

    if (!coaching) {
      return res.status(404).json({ success: false, message: "Coaching not found" });
    }

    const coachDetails = await User.findOne({ where: { id: coaching.coachId } });

    const subscribersDetails = coaching.subscriberIds && coaching.subscriberIds.length > 0
      ? await User.findAll({ where: { id: coaching.subscriberIds } })
      : [];

    res.status(200).json({ success: true, data: { ...coaching.toJSON(), coachDetails, subscribersDetails } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateCoaching = async (req, res) => {
  try {
    const { id } = req.params;
    const coaching = await Coaching.findByPk(id);

    if (!coaching || coaching.permanentDeleted) {
      return res.status(404).json({ success: false, message: "Coaching not found" });
    }

    await coaching.update(req.body);
    res.status(200).json({ success: true, data: coaching });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCoaching = async (req, res) => {
  try {
    const { id } = req.params;
    const coaching = await Coaching.findByPk(id);

    if (!coaching || coaching.permanentDeleted) {
      return res.status(404).json({ success: false, message: "Coaching not found" });
    }

    await coaching.update({ permanentDeleted: true });
    res.status(200).json({ success: true, message: "Coaching deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSubscriberToCoaching = async (req, res) => {
  try {
    const { coachingId, subscriberId } = req.body;

    if (!coachingId || !subscriberId) {
      return res.status(400).json({ success: false, message: "coachingId and subscriberId are required" });
    }

    const coaching = await Coaching.findOne({
      where: { id: coachingId, permanentDeleted: false },
    });

    if (!coaching) {
      return res.status(404).json({ success: false, message: "Coaching not found" });
    }

    const subscriberIdNum = Number(subscriberId);
    const currentSubscribers = (coaching.subscriberIds || []).map(id => Number(id));

    if (currentSubscribers.includes(subscriberIdNum)) {
      return res.status(400).json({ success: false, message: "Subscriber already added" });
    }

    const updatedSubscribers = [...currentSubscribers, subscriberIdNum];

    await coaching.update({ subscriberIds: updatedSubscribers });
    await coaching.reload();

    return res.status(200).json({ success: true, message: "Subscriber added successfully", data: coaching.subscriberIds });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


