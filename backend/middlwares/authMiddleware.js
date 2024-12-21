import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from "../user/userModel.js";


const authMiddleware = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    //Needed to check weather the authorization header is present or not!!!!!!!->priority task
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing", success: false });
    }

    // Split the header into Bearer and token
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Invalid authorization format", success: false });
    }

    // Verify the token
   
    const decoded = verify(token, "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda5d5e98f9b46ff16fcf9");

    // Find the user by id
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export default authMiddleware;
