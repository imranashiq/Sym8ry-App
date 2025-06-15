const User = require('../models/users');

// CREATE
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      firstName,
      lastName,
      country,
      gender,
      phone,
      dob,
      whatsappNumber,
      address,
    } = req.body;

    if (req.file) {
      const profilePicture = "/" + req.file.path;
      await User.findOneAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          // country,
          gender,
          phone,
          dob,
          whatsappNumber,
          address,
          profilePicture,
        }
      );
      const user = await User.findOne({
        _id: userId,
        permanentDeleted: false,
      }).select(
        "-password -setNewPwd -forgotPasswordOtp -forgotPasswordOtpExpire"
      );
      return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        data: user,
      });
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          // country,
          gender,
          phone,
          dob,
          whatsappNumber,
          address,
        }
      );
      const user = await User.findOne({
        _id: userId,
        permanentDeleted: false,
      }).select(
        "-password -setNewPwd -forgotPasswordOtp -forgotPasswordOtpExpire"
      );
      return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        data: user,
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
// UPDATE
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fullName } = req.body
    if (req.file) {
      const image = "/" + req.file.path;

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      await user.update({ fullName, image });
      res.json(user)
    }
    else {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      await user.update({ fullName });
      res.json(user)
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
