import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "job-portal/resumes",
                resource_type: "raw",
                public_id: `${Date.now()}-${originalName}`
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
};

export default uploadToCloudinary;