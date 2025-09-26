
//modules 
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";


import dbConnection from "./DB/db.connection.js";
import { messageController, userController, authController } from './Modules/controller.index.js'

// create application
const app = express();

// json parser
app.use(express.json());
app.use('/uploads',express.static('uploads'));

// cors
var whitelist = process.env.WHITE_LISTED_ORIGINS;
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// cors
app.use(cors(corsOptions));

// helmet
app.use(helmet());


// rate limiter
// app.use(globalRateLimiter);


// multer middleware
/*
notes:
    - if   controller have an multer , then it make a parsing of the request body not express.json




*/




// connect to database
await dbConnection();


// use user controller
app.use('/users', userController);
app.use('/auth', authController);

// use message controller
app.use('/messages', messageController);












// handle not found page
app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

// hanldle server error
app.use(async (err, req, res, next) => {

    if (req.session && req.session.inTransaction()) {
        await req.session.abortTransaction();
        req.session.endSession();
        console.log("Transaction aborted due to error");

    }
    console.error(err);
    res.status(500).json({ message: `Internal server error ${err}` });
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

