

import { compareSync, hashSync } from "bcrypt";
import { customAlphabet } from "nanoid";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from 'google-auth-library';

import { User, BlackListedTokens } from "../../../DB/Models/index.js";
import { generateToken, verifyToken, emitter, asymmetricEncrypt } from "../../../Utils/index.js";
import { providerEnum } from "../../../Common/Enums/user.enum.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const uniqueString = customAlphabet("1234567890abcdef", 10);

// <=========================================signInService=========================================>
export const signInService = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, provider: providerEnum.local });
        if (!user) {
            return res.status(409).json({ message: 'invalid email or password' });
        }
        const isPasswordMatched = compareSync(password, user.password);
        if (!isPasswordMatched) {
            return res.status(409).json({ message: 'invalid email or password' });
        }

        // generate access token
        const accessToken = generateToken({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, jwtid: uuid() });

        // generate refresh token
        const refreshToken = generateToken({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, jwtid: uuid() });

        return res.status(201).json({ message: 'User signed in successfully', accessToken, refreshToken });


    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });


    }
}


// <=========================================signUpService=========================================>
export const signUpService = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, gender, age, phoneNumber, } = req.body;

        const isEmailExist = await User.findOne({ email, provider: providerEnum.local });

        if (isEmailExist) return res.status(409).json({ message: "user already exist" });


        // encrypt phoneNumber
        const encryptedPhoneNumber = asymmetricEncrypt(phoneNumber);



        const otp = uniqueString();
        const user = await User.create({ firstName, lastName, email, password: hashSync(password, 10), gender, age, phoneNumber: encryptedPhoneNumber, otps: { confirmation: hashSync(otp, 10) } });




        emitter.emit('sendEmail', { to: email, subject: 'confimation email', html: `your confirmation OTP is: ${otp}` })

        return res.status(201).json({ message: 'User created successfully', user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// <=========================================confirmEmailService===================================>
export const confirmEmailService = async (req, res) => {

    const { email, otp } = req.body;

    const user = await User.findOne({ email, isConfirmed: false });

    if (!user) return res.status(400).json({ message: "User not found or Already confirmed" });

    const isOtpMatched = compareSync(otp, user.otps?.confirmation);
    if (!isOtpMatched) return res.status(400).json({ message: 'invalid OPT' });

    user.isConfirmed = true;
    user.otps.confirmation = undefined;
    await user.save();


    return res.status(200).json({ message: "confirmed" })


}



// <=========================================logOutServices========================================>
export const logOutServices = async (req, res, next) => {
    try {

        const { jti, exp } = req.logedInUser?.token;



        await BlackListedTokens.create({ tokenId: jti, expirationData: new Date(exp) });
        return res.status(201).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

// <=========================================refreshTokenService========================================>
export const refreshTokenService = async (req, res, next) => {
    try {

        const { refreshtoken } = req.headers;
        const { id, email } = verifyToken(refreshtoken, process.env.JWT_REFRESH_SECRET);

        // generate access token
        const accessToken = generateToken({ id: id, email: email }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, jwtid: uuid() });

        return res.status(201).json({ message: 'token generated successfully', accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}


// <=========================================updatePasswordService==========================================>
export const authWithGoogleService = async (req, res, next) => {


    const { idToken } = req.body;

    // verify the id token
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,

    });
    const payload = ticket.getPayload();

    // destructure data from payload
    const { given_name, family_name, sub, email_verified, email } = payload;

    // check if the user is verified by google
    if (!email_verified) return res.status(400).json({ message: "please verify your email with google" });



    // check if user already exist in db
    const isUserExist = await User.findOne({ sub, provider: providerEnum.google });
    let newUser;
    if (!isUserExist) {
        // add user to db
        newUser = await User.create({ firstName: given_name, lastName: family_name || ' ', sub, email, provider: providerEnum.google, password: hashSync(sub, 10), isConfirmed: true });


    }
    else {
        newUser = isUserExist;
        isUserExist.email = email;
        isUserExist.firstName = given_name;
        isUserExist.lastName = family_name || ' ';
        await isUserExist.save();
    }


    // generate access token
    const accessToken = generateToken({ id: newUser._id, email: newUser.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, jwtid: uuid() });

    // generate refresh token
    const refreshToken = generateToken({ id: newUser._id, email: newUser.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, jwtid: uuid() });

    res.status(201).json({ message: 'User signed in successfully', accessToken, refreshToken });









}





















