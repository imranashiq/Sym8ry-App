const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header
  // console.log("bearer ", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(400)
      .json({ status: false, message: "Authentication Invalid" });
  }
  const token = authHeader.split(" ")[1];

  // console.log(authHeader);
  if (!token) {
    return res.status(400).json({ success: false, message: "Token not found" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await User.findById(payload.userId).select("-password");
    // req.userRole = user.userRole;
    // // req.user = user

    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, message: "Authentication Invalid" });
  }
};

module.exports = auth;
