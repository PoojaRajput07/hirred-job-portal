import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileExtension =
        "." + file.originalname.split(".").pop().toLowerCase();

    if (
        allowedTypes.includes(file.mimetype) ||
        allowedExtensions.includes(fileExtension)
    ) {
        callback(null, true);
    } else {
        callback(
            new Error("Only PDF and DOC/DOCX files are allowed"),
            false
        );
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
});

export default upload;