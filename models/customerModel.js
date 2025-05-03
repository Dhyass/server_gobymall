import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
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
    otp: { 
        type: String, 
        default: "none" 
    },
    method: { 
        type: String, 
        required: true 
    },
 
}, { timestamps: true });

const customerModel = model('customers', customerSchema );
export default customerModel;
