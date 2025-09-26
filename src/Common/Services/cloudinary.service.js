// config/cloudinary.js
import { v2 as cloudinaryV2 } from 'cloudinary';
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file on cloudinary
export const uploadFileOnCloudinary = async (file, options = {}) => {
    try {
        const result = await cloudinaryV2.uploader.upload(file, options);
        return result;
    } catch (error) {
        console.log(error);
    }
}
// delete profile picture
export const deleteFileFromCloudinary = async (public_id) => {
    try {
        const result = await cloudinaryV2.uploader.destroy(public_id); // destory method must take an string value
        return result;
        
    } catch (error) {
        console.log(error);
    }
}
/*
note about cloundinary:
    - cloundinary dont have delete folder , this folder contain file , it delete just folder is empty after that you must delete all resources from this folder and delete folder name to delete all folder

*/
