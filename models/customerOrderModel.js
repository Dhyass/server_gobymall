import { Schema, model } from 'mongoose';

const customerOrderSchema = new Schema({
    customerId : {
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
    quantity : {
        type : Number,
        required : true,
    },
    payment_status : {
        type : String,
        required : true,
    },
    shippingInfo : {
        type : Object,
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

const customerOrderModel = model('customerOrders', customerOrderSchema);
export default customerOrderModel;
