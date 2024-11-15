import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: 'admin' },
    image: { type: String, default: "https://www.duracuire.com/wp-content/uploads/Oeuf-au-plat-1140x641.jpg" },
}, { timestamps: true });

const adminModel = model('admins', adminSchema);
export default adminModel;
