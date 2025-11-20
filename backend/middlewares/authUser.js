import jwt from "jsonwebtoken"

// user authentication middleware

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log('authUser received token:', token);
    console.log('authUser JWT_SECRET:', process.env.JWT_SECRET);
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    // jwt.verify returns the decoded payload
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Initialize req.user to store user information
    req.user = {
      userId: token_decode.id || token_decode._id || token_decode.userId
    };

    // Ensure req.body exists
    if (!req.body) req.body = {};
    req.body.userId = req.user.userId;

    next();

    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser