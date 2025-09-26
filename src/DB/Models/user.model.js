import mongoose from 'mongoose';
import { genderEnum } from '../../Common/Enums/user.enum.js';
import { roleEnum } from '../../Common/Enums/user.enum.js';
import { providerEnum } from '../../Common/Enums/user.enum.js';
const userSchema = new mongoose.Schema({


    firstName: {
        type: String,
        required: true,
        maxlength: [50, 'first name must be at most 50 characters'],
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true

    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: 'idx_email_unique'
        }

    },
    password: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
        trim: true,
        lowercase: true,
        enum: Object.values(genderEnum),
        default: genderEnum.male

    },
    age: {
        type: Number,
        trim: true,
        lowercase: true,
        min: [18, 'age must be at least 18'],
        max: [120, 'age must be at most 120'],
    },
    phoneNumber: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        index: {
            unique: true,
            name: 'idx_phoneNumber_unique'
        }
    },
    otps: {
        confirmation: String,
        resetPassword: String
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),// object.values return array of values of object,
        default: roleEnum.user
    },
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.local


    },
    sub: {
        type: String
    },
    profilePicture:{
        secure_url:String,
        public_id:String
    },


}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        }
    },

    methods: {
        getFullName() {
            return `${this.firstName} ${this.lastName}`;
        },
        getDoubleAge() {
            return this.age * 2;
        }
    }
    ,
    collection: 'users'
});

userSchema.virtual('messages', {// to make this viritual you must created child parent relation
    ref: 'Message',
    localField: '_id',
    foreignField: 'receiverId'
})
export const User = mongoose.model('User', userSchema);


