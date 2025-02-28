import { Schema, model } from 'mongoose';

const stripeSchema = new Schema({
    sellerId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    stripeId : {
        type : String,
        required : true,
    },
    code : {
        type : String,
        required : true,
    },
}, { timestamps: true });

const stripeModel = model('stripeAccounts', stripeSchema);
export default stripeModel;
