import { User, Message } from "../../../DB/Models/index.js";

// <=========================================sendMessageService=========================================>
export const sendMessageService = async (req, res) => {
    try {
        const { content } = req.body;
        const { receiverId } = req.params;

        const user = await User.findById(receiverId);

        if (!user) return res.status(404).json({ message: "user not found" });

        const message = await Message.create({ content, receiverId });

        return res.status(201).json({ message: "message sent successfully", message });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
}
// <=========================================getMessagesService=========================================>
export const getMessagesService = async (req, res) => {
    try {
        const messages = await Message.find().populate([ // why use array in populate ?
            { path: 'receiverId', select: 'firstName  lastName' }
        ]);
        return res.status(200).json({ messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
        
    }
}

// <=========================================deleteMessageByOwner=============================================>
export const deleteMessage = (req, res, next) => {

    
}

// <=========================================makeMessagePublicByOwner=========================================>
export const makeMesssage = (req,res,next)=>{

     
        

}