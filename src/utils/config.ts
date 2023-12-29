import { diskStorage } from "multer";

export const configStogare = {
    storage: diskStorage({
        destination: 'uploads/images',
        filename: (req,file,cb) => {
          cb(null , Date.now() + '-' + file.originalname);
        }
      })
}