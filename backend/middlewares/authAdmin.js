import jwt from "jsonwebtoken"

// admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    // Support token via header OR query param for embedded assets (e.g., PDF <object>)
    const atoken = req.headers.atoken || req.query.atoken;
    if (!atoken) {
      return res.json({ success: false, message: "No token provided" });
    }

    // jwt.verify returns the decoded payload (e.g. { email })
  const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    // Ensure the token payload contains the admin email
    if (!token_decode || token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin