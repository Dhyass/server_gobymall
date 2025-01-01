import { Schema, model } from 'mongoose';

const wishlistSchema = new Schema({
    customerId: { type: String, required: true }, // Correction ici
    productId: { type: String, required: true }, // Correction ici
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: 
    {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    discount: { type: Number },
    rating: { type: Number, required: true },
    slug: { type: String, required: true },

}, { timestamps: true }); // Ajout des timestamps

const WishlistModel = model('Wishlists', wishlistSchema); // Correction du nom du modèle
export default WishlistModel;
