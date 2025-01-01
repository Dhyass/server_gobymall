import express from 'express';
import {
    customer_review,
    get_home_Category,
    get_home_product,
    get_price_range_latest_products,
    get_product,
    get_query_sort_products,
    getProductReviews
} from '../../controllers/homeControllers/homeControllers.js';
const router = express.Router();

router.get("/category_get", get_home_Category);
router.get("/product_get", get_home_product);
router.get("/price-range-latest-products", get_price_range_latest_products)
router.get("/query_sort_products", get_query_sort_products)
router.get('/get_product_details/:productId', get_product)
router.post('/customer-review/:productId', customer_review)
router.get('/product/get-reviews/:productId', getProductReviews)



export default router;
