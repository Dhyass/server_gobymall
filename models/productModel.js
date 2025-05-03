import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, required: true }, // Correction ici
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: Number },
    price: { type: Number, required: true },
    brand: { type: String },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    shopName: { type: String, required: true },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    rating: { type: Number, default: 0 },
    tags:{
        type : Array,
        default : []
     },
     variants:{
        type : Array,
        default : []
     },
    /* variants: [
        {
          name: { type: String },
          options: [{ type: String }]
        }
      ]*/
}, { timestamps: true }); // Ajout des timestamps

productSchema.index(
    {
        name: 'text',
        description: 'text',
        brand: 'text',
        category: 'text'
    },
    {
        weights: {
            name: 5,
            description: 3,
            brand: 2,
            category: 1
        }
    }
);

const Product = model('Product', productSchema); // Correction du nom du modèle
export default Product;
