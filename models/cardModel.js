import { Schema, model } from 'mongoose';
/*
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
*/


const cardSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedVariant: {
    color: { type: String },
    size: { type: String },
    variantPrice: { type: Number },          // Prix final de la variante
    variantImage: { type: String },          // Image spécifique de la variante
    variantStock: { type: Number },
  },
}, { timestamps: true });

const cardModel = model('cards', cardSchema);

export default cardModel;
