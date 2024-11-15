import { Schema, model } from 'mongoose';

const sellerSchema = new Schema({
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
        default: 'seller' 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'pending' 
    },
    payment: { 
        type: String, 
        required: true, 
        default: 'inactive' 
    },
    method: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: process.env.IMAGE_DEFAULT 
    },
    shopInfo: { 
        type: Object, 
        default:{}
    },
}, { timestamps: true });

const sellerModel = model('sellers', sellerSchema);
export default sellerModel;
