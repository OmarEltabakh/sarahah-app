import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },

        receiverId: {// explain this filed , and explain how this id not check if this is vaild id in user model
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }
    , {
        timestamps: true
    }
)

export const Message = mongoose.model('Message', messageSchema);

