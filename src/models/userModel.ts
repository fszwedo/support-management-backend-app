import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserType {
    User,
    Admin
}

export interface User {
    name: string;
    email: string;
    password: string;
    type: UserType;
    created: Date
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
    status: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

export default mongoose.model<User & mongoose.Document>('User', UserSchema);