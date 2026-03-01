import { Schema, model } from "mongoose";

const productVideoSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        url: { type: String, required: true },
        public_id: { type: String, required: true },

        duration: {
            type: Number, // secondes
            required: true,
            min: [5, "La durée minimale est 5 secondes"],
            max: [45, "La durée maximale est 45 secondes"],
        },

        size: {
            type: Number, // en bytes
            required: true,
            max: [10 * 1024 * 1024, "La taille maximale est 10MB"],
        },

        format: {
            type: String,
            enum: ["mp4", "webm", "ogg"],
            required: true,
        },
    },
    { timestamps: true }
);

const ProductVideoModel = model("ProductVideo", productVideoSchema);
export default ProductVideoModel;
