import { Schema, model } from 'mongoose';

const sellerWalletSchema = new Schema({
    sellerId : {
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    month : {
        type : Number,
        required : true,
    },
    year : {
        type : Number,
        required : true,
    },
}, { timestamps: true });

const sellerWalletModel = model('sellersWallets', sellerWalletSchema);
export default sellerWalletModel;
