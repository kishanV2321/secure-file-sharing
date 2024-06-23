import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { 
    uploadFile,
    fileList,
    downloadFile,
    downloadFileSecure
} from "../controllers/file.controller.js";

const router = new Router();
router.route("/upload-file").post(verifyJwt, upload.single("filename"), uploadFile)
router.route("/file-list").get(verifyJwt, fileList)
router.route("/download-file/:fileId").get(verifyJwt, downloadFile)
router.route("/download-secure-file/:token").get(downloadFileSecure)

export default router;