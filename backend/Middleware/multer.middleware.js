import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/"); // ✅ specify upload folder
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname); // ✅ correct usage
    }
});

// File filter to accept only PDF and DOC files
const fileFilter = (req, file, callback) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        callback(null, true);
    } else {
        callback(new Error('Only PDF and DOC/DOCX files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
export default upload;