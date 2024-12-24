import { Schema, model } from 'mongoose';

const cardSchema = new Schema({
    customerId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    productId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
    }
}, { timestamps: true });

const cardModel = model('cards', cardSchema);
export default cardModel;
