import express from "express";
import upload from "../Middleware/multer.middleware.js";
import { appliedJobs, applyJob, madeCandidate, removeWishist, savejobs, seeAllJobs, viewJob, wishlist } from "../controller/candidate.controller.js";
import verifyToken from "../Middleware/auth.middleware.js";
import verifyCandidate from "../Middleware/candidate.middleware.js";
const candidateRouter=express.Router();
candidateRouter.route("/madecandidate").get(verifyToken,madeCandidate);
candidateRouter.route("/wishlist/:id").post(verifyToken,verifyCandidate,wishlist);
candidateRouter.route("/removewishlist/:id").post(verifyToken,verifyCandidate,removeWishist);
candidateRouter.route("/applyJob").post(verifyToken,
    verifyCandidate,
    upload.single("resume"),
    (err, req, res, next) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File size too large. Maximum size is 5MB'
                });
            }
            if (err.message === 'Only PDF and DOC/DOCX files are allowed') {
                return res.status(400).json({
                    message: err.message
                });
            }
            return res.status(400).json({
                message: 'File upload error: ' + err.message
            });
        }
        next();
    },
    applyJob
);
candidateRouter.route("/savejobs").get(verifyToken,verifyCandidate,savejobs);
candidateRouter.route("/seealljobs").get(seeAllJobs) ;
candidateRouter.route("/viewjob/:id").post(verifyToken,viewJob);
candidateRouter.route("/appliedJobs").get(verifyToken,verifyCandidate,appliedJobs);
export default candidateRouter;
