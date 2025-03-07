import { Schema, model } from 'mongoose';

const bannerSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
   
    banner : {
        type : String,
        required : true,
    },
    
    link : {
        type : String,
        required : true,
    },

}, { timestamps: true });

const bannerModel = model('banners', bannerSchema);
export default bannerModel;
