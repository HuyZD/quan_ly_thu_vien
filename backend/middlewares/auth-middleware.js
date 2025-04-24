import { ErrorHandlerService,tokenService } from "../services/index.js";
const authMiddleware = async (req, res, next) => {  
  const { accessToken } = req.cookies;
  try {
    if (!accessToken) {
      throw new Error("Access token is missing.");
    }
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new Error("Invalid or expired access token.");
    }
    req.userData = userData;
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);  // Log error details
    next(ErrorHandlerService.unAuthorized());
  }
}


export default authMiddleware;