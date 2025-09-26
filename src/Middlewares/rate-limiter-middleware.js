import rateLimit from "express-rate-limit";
import ipKeyGenerator from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import { getCountryCode } from "../Utils/index.js";

import dotenv from "dotenv";
dotenv.config();


// rate limit


export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: async function (req) {
        const { country_code } = await getCountryCode(req.headers['x-forwarded-for']);
        console.log(country_code);
        if (country_code === 'EG') return 10;
        return 3;

    },
    requestPropertyName: 'rateLimit',
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    legacyHeaders: false,
    skipFailedRequests: true,
    keyGenerator: (req) => {

        const ip = ipKeyGenerator(req.ip);

        return `${ip}-${req.path}`;
    },
    store: new MongoStore({
        uri: process.env.DB_HOST,
        collectionName: 'rateLimit',
        expireTimeMs: 15 * 60 * 1000,
    })
});

