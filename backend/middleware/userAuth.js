const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;  // Extract token from cookies

  console.log("Received token:", token);  // Log the received token

  if (!token) {
    console.log("❌ No token in cookies");
    return res.status(401).json({ success: false, message: 'Unauthorized. Login again.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    console.log("✅ Token decoded:", decodedToken);

    if (decodedToken.id) {
      req.user = { id: decodedToken.id };  // Store user info in req.user
      return next();  // Proceed to the next middleware or route handler
    } else {
      console.log("❌ No user ID in token");
      return res.status(401).json({ success: false, message: 'Unauthorized. Login again.' });
    }
  } catch (error) {
    console.log("❌ JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized. Login again.' });
  }
};

module.exports = { userAuth };
