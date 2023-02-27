import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserType {
    User,
    Agent,
    Admin
}

export interface User {
    name: string;
    email: string;
    password: string;
    type: UserType;
    created: Date;
    isActive: boolean;
    isZendeskAgent: boolean;
    expertiseAreas: string[];
    additionalInfo: string;
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: email => {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email)
            },
            message: 'Email format is incorrect!'
        },
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isZendeskAgent: {
        type: Boolean,
        default: false
    },
    expertiseAreas: {
        type: [String],
        default: []
    },
    additionalInfo: {
        type: String,
        default: ''
    }
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model<User & mongoose.Document>('User', UserSchema);