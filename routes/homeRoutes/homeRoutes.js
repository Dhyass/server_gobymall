import express from 'express';
import {
    get_home_Category,
    get_home_product,
    get_price_range_latest_products,
    get_query_sort_products
} from '../../controllers/homeControllers/homeControllers.js';
const router = express.Router();

router.get("/category_get", get_home_Category);
router.get("/product_get", get_home_product);
router.get("/price-range-latest-products", get_price_range_latest_products)
router.get("/query_sort_products", get_query_sort_products)

export default router;
