//function to find token and user id from the cookies
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "The user is not authorized. Please login again",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.id) {
      req.userId = decodedToken.id;
    } else {
      return res.status(500).json({
        success: false,
        message: "Account not authorized, login again",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth;
