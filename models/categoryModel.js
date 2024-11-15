import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true },
}, { timestamps: true });

CategorySchema.index({
    name: 'text'
})

const categoryModel = model('categories', CategorySchema );
export default categoryModel;
