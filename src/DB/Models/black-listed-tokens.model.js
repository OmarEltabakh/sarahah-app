
import mongoose from "mongoose";

 const blackListedTokensSchema = new mongoose.Schema({
   tokenId:{
    type: String,
    required: true,
    unique: true
   },
   
    expirationData:{
        type: Date,
        required: true
    }
});

export const BlackListedTokens = mongoose.model('BlackListedTokens', blackListedTokensSchema);


