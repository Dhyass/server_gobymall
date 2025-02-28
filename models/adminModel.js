import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
    name: {
         type: String, 
         required: true 
        },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    role: { 
        type: String, 
        required: true, 
        default: 'admin' 
    },
    image: {
         type: String, 
         default: process.env.ADMIN_DEFAULT_IMAG
    },
}, { timestamps: true });

const adminModel = model('admins', adminSchema);
export default adminModel;
