const userModel = require('../model/userModel');

const getUserdata = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use the ID from the auth middleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: { ...user._doc },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { getUserdata };
