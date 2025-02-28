import { Schema, model } from 'mongoose';

const withdrawRequestSchema = new Schema({
    sellerId: 
    { 
        type: String, 
        required: true 
    }, 
    amount: 
    { 
        type: Number, 
        required: true 
    }, 
    status: 
    { 
        type: String, 
        default : 'pending'
    }, 


}, { timestamps: true }); // Ajout des timestamps

const withdrawRequestModel = model('withdrawRequest', withdrawRequestSchema ); // Correction du nom du modèle
export default withdrawRequestModel;
