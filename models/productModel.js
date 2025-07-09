/*
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
*/

import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
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

    tags: {
        type: [String],
        default: []
    },

    /** 👇 LIVRAISON */
    deliveryType: {
        type: String,
        enum: ['free', 'negotiable', 'fixed', 'dynamic'],
        required: true
    },
    deliveryFee: {
        type: Number, // Applicable si deliveryType === 'fixe_par_produit'
        default: 0
    },
    estimatedDeliveryTime: {
        type: String, // Exemple : "2-5 jours", "48h", etc.
        required: true
    },

    /** 👇 VARIANTES */
    variants: [
        {
            color: { type: String },
            size: { type: String },
            variantPrice: { type: Number, default: 0 },
            variantStock: { type: Number, default: 0 },
            variantImage: { type: String }, // Optionnel pour une image liée à la variante
        }
    ],

    /** 👇 POIDS ET DIMENSIONS POUR CALCUL AUTOMATIQUE */
    weight: { type: Number }, // en kg ou grammes selon ton système
    dimensions: {
        length: { type: Number }, // en cm
        width: { type: Number },
        height: { type: Number }
    },

}, { timestamps: true });

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

const Product = model('Product', productSchema);
export default Product;
