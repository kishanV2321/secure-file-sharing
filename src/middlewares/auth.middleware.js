import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler( async (req, _, next) => {
    try {
        const accessToken = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ", "");
        //Authorization: Bearer <token>

        
        if(!accessToken){
            throw new ApiError(401, "Unauthorization request");
        }
        
        //encrypt into json or readable
        const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select(" -password -refresToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid Access Token")
    }
})

export {verifyJwt};