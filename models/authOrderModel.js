import { Schema, model } from 'mongoose';

const authOrderSchema = new Schema({
    orderId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    sellerId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    products : {
        type : Array,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    payment_status : {
        type : String,
        required : true,
    },
    shippingInfo : {
        type : String,
        required : true,
    },
    delivery_status : {
        type : String,
        required : true,
    },
    date : {
        type : String,
        required : true,
    }
}, { timestamps: true });

const authOrderModel = model('authOrders', authOrderSchema);
export default authOrderModel;
