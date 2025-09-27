

import { hashSync } from "bcrypt";
import { User, Message } from "../../../DB/Models/index.js";
import { deleteFileFromCloudinary, uploadFileOnCloudinary } from "../../../Common/Services/cloudinary.service.js";




// <=========================================UpdateService=========================================>
export const UpdateService = async (req, res, next) => {
    try {

        const { id } = req.logedInUser.user;
        const { firstName, lastName, email, gender, age } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, email, gender, age }, { new: true })
        if (!updatedUser) {
            return res.status(409).json({ message: 'User not found' });
        }

        return res.status(201).json({ message: 'User updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error });
    }

}


// <=========================================DeleteUserService=====================================>
export const DeleteUserService = async (req, res, next) => {

    // start session
    const session = await mongoose.startSession();

    // attach session to the request
    req.session = session;

    // start transaction
    session.startTransaction();

    const { id } = req.logedInUser.user;
    // send session to the models
    const deletedUser = await User.findByIdAndDelete(id, { session });

    if (!deletedUser) {
        return res.status(409).json({ message: 'User not found' });
    }

    // unlink profile picture
    if (deletedUser.profilePicture) {
        // fs.unlinkSync(deletedUser.profilePicture); // this mean delete file from local storage

        // delete from cloudinary
        await deleteFileFromCloudinary(deletedUser.profilePicture.public_id);
    }

    // send session to the models
    await Message.deleteMany({ receiverId: "lfjdfklj" }, { session });

    // commit transaction
    await session.commitTransaction();
    // end session
    session.endSession();
    return res.status(201).json({ message: 'User deleted successfully', deletedUser });

}


// <=========================================listAllUsers==========================================>
export const listAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('messages');


        return res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}


// <=========================================getUserById==========================================>
export const getUserByIdService = async (req, res, next) => {

    try {
        const { id } = req.params;
        if (!id) res.status(400).json({ message: "id is required" });

        const user = await User.findById(id, { password: 0 });

        if (!user) return res.status(400).json({ message: "user not found" });

        return res.status(200).json({ message: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

// <=========================================updatePasswordService==========================================>
export const updatePasswordService = async (req, res, next) => {

    try {
        const { password } = req.body;
        const { user: { _id } } = req.logedInUser;
        const { token: { exp, jti } } = req.logedInUser;


        // revoke token
        await BlackListedTokens.create({ tokenId: jti, expirationData: new Date(exp) });

        // update user password
        const user = await User.findByIdAndUpdate(_id, { password: hashSync(password, 10) });
        if (!user) return res.status(409).json({ message: 'User not found' });
        res.status(200).json({ message: "user password update successfully" })
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: error });
    }



}



// <=========================================uploadProfilePictureService==========================================>
export const uploadProfilePictureService = async (req,res,next)=>{
 

    const { user: { _id } } = req.logedInUser;
    const { path } = req.file;
    
    const {secure_url,public_id} = await uploadFileOnCloudinary(path,{folder:'sarahah_app/users/profilePictures',resource_type:'image',/*use_filename:true, unique_filename:fase*/});// explain this line  , use_filename:true this is a file name that it was out put from multer middleware , unique_filename:fase this attribute thats add unique name to public_id to make sure that the file name is unique

    
    const user = await User.findByIdAndUpdate(_id, { profilePicture:{secure_url,public_id} },{new:true});

    if (!user) return res.status(409).json({ message: 'User not found' });
    res.status(200).json({ message: "user profile picture uploaded successfully",user })
}

// <=========================================deleteProfilePictureService==========================================>
export const deleteProfilePictureService = async (req,res,next)=>{

    const { user: { _id } } = req.logedInUser;

    const { public_id } = req.body;
    // delete profile picture from cloudinary
    const deletedProfilePicture = await deleteFileFromCloudinary(public_id);
    if (!deletedProfilePicture) return res.status(409).json({ message: 'Profile picture not found' });

    // update user profile picture
    const user = await User.findByIdAndUpdate(_id, {profilePicture:null},{new:true});
    if (!user) return res.status(409).json({ message: 'User not found' });

    if(deletedProfilePicture.result === 'not found')
        return res.status(409).json({ message: 'Profile picture not found' });

    res.status(200).json({ message: "user profile picture deleted successfully",deletedProfilePicture })

}

// <=========================================test==========================================>


export const testService = async (req,res,next)=>{
    res.status(200).json({ message: "test" })
}






