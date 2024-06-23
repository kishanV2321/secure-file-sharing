import { File } from "../models/file.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const uploadFile = asyncHandler( async (req, res) => {
    const filePath = req.file?.filename
    const uploder = req.user?._id

    // console.log(filePath);

    if(!filePath){
        throw new ApiError(400, "file is required")
    }

    if(!uploder){
        throw new ApiError(500, "User is required")
    }

    const file = await File.create(
        {
            filename: filePath,
            uploader: uploder
        }
    )

    const uploadFile = await File.findById(file?._id);

    if(!uploadFile){
        throw new ApiError(500, "Somenthing went wrong while uploading file");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {uploadFile}, "File uploaded Successfully")
    )
})

const fileList = asyncHandler( async (req, res) => {
    const uploader = req.user?._id;

    if(!uploader){
        throw new ApiError(400, "Unauthorized User")
    }

    const files = await File.find({uploader});
    //  const files = await File.find().populate('uploader', 'email');

    if(!files){
        throw new ApiError(500, "Somenthing went wromg while fetching files")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, { files }, "List of Files fetched Successfully")
    )
})

const downloadFile = asyncHandler( async (req, res) => {
    const { fileId } = req.params;

    // console.log(req.params);
    
    if(!fileId){
        throw new ApiError(400, "File-id is required")
    }
    
    const file = await File.findById(fileId);

    if(!file){
        throw new ApiError(400, "Invalid File id")
    }

    const payload = {
        _id: fileId,
    }

    const generateToken = () => {
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_SECRET_EXPIRY }
        )
    }

    const downloadToken = generateToken();
    console.log(downloadToken);

    if(!downloadToken){
        throw new ApiError(500, "Something went wrong while generating token")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, 
            {'download-link': `/download-file-secure/${downloadToken}`},
            "Successfully generate token"
        )
    )
})

const downloadFileSecure = asyncHandler( async (req, res) => {
    const { token } = req.params;

    if(!token){
        throw new ApiError(400, "Token is required");
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if(!decodeToken){
        throw new ApiError(400, "Unauthorized request")
    }

    const file = await File.findById(decodeToken._id);

    if(!file){
        throw new ApiError(500, "File not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,
            {"download": `./public/temp/${file.filename}`},
            "File successfully downloaded"
        )
    )  
})


export {
    uploadFile,
    fileList,
    downloadFile,
    downloadFileSecure
}


/*
// .download(`./public/temp/${file.filename}`)
const generateToken = (data, expiresIn = '30m') => {
    const uniqueId = uuidv4();
    const payload = { ...data, jti: uniqueId }; // Add unique ID to payload
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
*/