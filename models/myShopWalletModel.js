import { Schema, model } from 'mongoose';

const myShopWalletSchema = new Schema({
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

const myShopWalletSchemaModel = model('myShopWallets', myShopWalletSchema);
export default myShopWalletSchemaModel;
