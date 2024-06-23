import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Somenting went wrong while generation refresh and access token"
        );
    }
}


const registerUser = asyncHandler(async (req, res) => {
    //get details from frontend
    const { email, password, isAdmin } = req.body;

    //validation
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    //check if user already exist
    const existedUser = await User.findOne({ email: email });

    if (existedUser) {
        throw new ApiError(409, "User with email Already Exist")
    }

    //create user object in db
    const user = await User.create({
        email,
        password,
        isAdmin,
    })

    console.log(user);

    //send email Verification
    await sendEmail({email, userId: user._id});

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(" -password -refreshToken -verifyToken -verifyTokenExpiry");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    //return the response
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered Succesfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    //get detils from frontend
    const { email, password } = req.body;

    //check field is not empty
    if (!email && !password) {
        throw new ApiError(400, "All field are required");
    }

    //find user in db
    const user = await User.findOne({ email: email });

    //if user not exist in db
    if (!user) {
        throw new ApiError(404, "User does not Exist")
    }

    //password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password")
    }


    //generate refres token and access token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    //send cookie
    const loggedInUser = await User.findById(user._id).select("-password -refeshToken");

    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while logged in the user");
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                loggedInUser,
                "User Logged In Successfully"
            )
        )

})

const logOutUser = asyncHandler( async (req, res) => {
        //find user by middleware
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $unset: {
                    refreshToken: 1
                }
    
            },
            {
                new: true,
            },
        );
    
        // remove cookies
        // remove refreshToken from Database
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };
    
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauhtorized request");
    }

    //token ko encrypted se raw form mai kiya hai
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    );

    //user ko find kr rhe hai
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    //jo token mile hai woh expire toh nhi hogya isliye db ke refreshToken se check kregye
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
    }

    //ab use accessToken dege sab check kr liya hmne
    const { accessToken, newRefreshToken } = generateAccessAndRefreshToken(
        user._id,
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                201,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed",
            ),
        );
});

const verifyEmail = asyncHandler( async (req, res) => {
    const { token } = req.query;
    // console.log(token);

    if(!token){
        throw new ApiError(400, "Empty token");
    }

    const user = await User.findOne(
        {
            verifyToken: token, 
            verifyTokenExpiry: {$gt: Date.now()}
        }
    );

    if(!user){
        throw new ApiError(401, "Inavlid Token");
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, {user}, "Email verified successfully")
    )
})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    verifyEmail
}