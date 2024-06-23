import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb -> callback
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

export const upload = multer({ storage, fileFilter });
