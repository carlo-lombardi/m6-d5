import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudMulter = () => {
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "profiles",
    },
  });

  const upload = multer({
    storage: cloudinaryStorage,
    fileFilter: function (req, file, next) {
      const acceptedExt = [".png", ".jpg", ".gif", ".bmp", ".jpeg"];
      console.log(file);
      if (!acceptedExt.includes(extname(file.originalname))) {
        return next(
          new ErrorResponse(
            `Image type not allowed: ${extname(file.originalname)}`,
            400,
            "multerExt"
          )
        );
      }
      next(null, true);
    },
  });
  return upload.single("profilePic");
};

export default cloudMulter;

export const cloudMulterPosts = () => {
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Posts",
    },
  });

  const upload = multer({
    storage: cloudinaryStorage,
    fileFilter: function (req, file, next) {
      const acceptedExt = [".png", ".jpg", ".gif", ".bmp", ".jpeg"];
      console.log(file);
      if (!acceptedExt.includes(extname(file.originalname))) {
        return next(
          new ErrorResponse(
            `Image type not allowed: ${extname(file.originalname)}`,
            400,
            "multerExt"
          )
        );
      }
      next(null, true);
    },
  });
  return upload.single("PostImg");
};
