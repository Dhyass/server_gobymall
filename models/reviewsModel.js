import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    name: { 
        type: String, 
        required: true
     },
    rating: { 
        type: Number, 
        required: true, 
    },
    review: { 
        type: String, 
        required: true, 
    },
    date: { 
        type: String, 
        required: true 
    },
 
}, { timestamps: true });

const reviewModel = model('reviews', reviewSchema );
export default reviewModel;
