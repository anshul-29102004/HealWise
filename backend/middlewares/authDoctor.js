import jwt from "jsonwebtoken"

// doctor authentication middleware

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({ success: false, message: "No token provided" });
    }

  // jwt.verify returns the decoded payload
  const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
  // Attach doctor id to req
  req.docId = token_decode.id;
  next();

    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor