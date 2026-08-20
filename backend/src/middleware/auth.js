import {sendServerError} from "../utils/response.js"
import UserModel from "../models/user.models.js"
import jwt from "jsonwebtoken";
const protectWithCookie = (cookieName, allowedRoles = null) => async (req, res, next) => {
    try {
        let token = null;
        if(req.cookies && req.cookies[cookieName]) {
            token = req.cookies[cookieName];
        }

        if(!token && req.headers.authorization ) {
            token = req.headers.authorization;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.API_SECRET);
        const user=await UserModel.findById(decoded.id).select("-password -otp -otpExpire -isVerified -createdAt -updatedAt -__v");
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (user.status === false) {
            return res.status(403).json({ success: false, message: "Account is inactive" });
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        
        req.user = user;
        next();
       
    } catch (error) {
        
        sendServerError(res, "Internal Server Error")
    }
};

export const protect = protectWithCookie("jwt", ["user"]);
export const protectAdmin = protectWithCookie("admin_jwt", ["admin", "superAdmin"]);



export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        next();
    }}