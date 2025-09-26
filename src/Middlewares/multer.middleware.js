
import multer from "multer";
import fs from "fs";
import { allowedFileExtentions, fileTypes } from "../Common/Enums/Constants/files.constant.js";

function checkOrCreateFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

// upload locally
export const LocalUpload = ({ folderPath = 'samples', limits = {} }) => {


    // storage
    const storage = multer.diskStorage({ // we can use diskStorage without destination and filename in this case , not store any file , just make a parsed file 
        destination: (req, file, cb) => {
            const fileDir = `uploads/${folderPath}`;
            checkOrCreateFolder(fileDir);
            cb(null, fileDir) // cb is a callback function Its importance is to call it when the destination is ready , its takes two arguments , first is error or null and second is the destination
        },
        filename: (req, file, cb) => {
            console.log(`file info before  upload`, file);

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + file.originalname)
        }
    })


    // file filter
    const fileFilter = (req, file, cb) => {

        const fileMimetype = file.mimetype.split('/')[0];
        const fileType = fileTypes[fileMimetype];
        if (!fileType) return cb(new Error('Invalid file type', false));
        const fileExtentention = file.mimetype.split('/')[1];

        if (!allowedFileExtentions[fileType].includes(fileExtentention)) return cb(new Error('Invalid file extentention', false));
        return cb(null, true);


    }

    return multer({ limits, fileFilter, storage })
}
// upload on cloudinary
export const CloudinaryUpload = ({ limits = {} }) => {


    // storage
    const storage = multer.diskStorage({}) // just make a parsed file


    // file filter
    const fileFilter = (req, file, cb) => {

        const fileMimetype = file.mimetype.split('/')[0];
        const fileType = fileTypes[fileMimetype];
        if (!fileType) return cb(new Error('Invalid file type', false));
        const fileExtentention = file.mimetype.split('/')[1];

        if (!allowedFileExtentions[fileType].includes(fileExtentention)) return cb(new Error('Invalid file extentention', false));
        return cb(null, true);


    }

    return multer({ limits, fileFilter, storage })
}    