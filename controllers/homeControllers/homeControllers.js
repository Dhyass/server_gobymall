import categoryModel from "../../models/categoryModel.js";
import productModel from "../../models/productModel.js";
import { responseReturn } from "../../utiles/response.js";

// Format products into rows of 3
const formatProduct = (products) => {
    const productArray = [];
    let i = 0;

    while (i < products.length) {
        const temp = [];
        let j = i;
        while (j < i + 3 && j < products.length) { // Ensure index does not exceed array length
            temp.push(products[j]);
            j++;
        }
        productArray.push(temp);
        i = j;
    }
    return productArray;
};

export const get_home_Category = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        responseReturn(res, 200, { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
};

export const get_home_product = async (req, res) => {
    try {
        // Get products sorted by creation date
        const products = await productModel.find({}).limit(16).sort({ createdAt: -1 });

        // Get the latest 9 products and format them
        const allProducts = await productModel.find({}).limit(9).sort({ createdAt: -1 });
        const latestProducts = formatProduct(allProducts);

        // Get top-rated products with a rating >= 9
        //const ratedProducts = await productModel.find({ rating: { $gte: 9 } }).limit(9).sort({ rating: -1 });
        const ratedProducts = await productModel.find({ rating: { $gte: 1 } }).limit(9).sort({ rating: -1 });
        const topRatedProducts = formatProduct(ratedProducts);

        // Get top discounted products
        //const discountProducts = await productModel.find({ discount: { $exists: true, $gt: 0 } }).limit(9).sort({ discount: -1 });
        const discountProducts = await productModel.find({}).limit(9).sort({ discount: -1 });
        const topDiscountedProducts = formatProduct(discountProducts);

        // Debug output
       // process.stdout.write("Home discountProducts: " + JSON.stringify(topDiscountedProducts) + "\n");

        // Return response
        responseReturn(res, 200, { products, latestProducts, topRatedProducts, topDiscountedProducts });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

export const get_price_range_latest_products = async (req, res) => {
    try {
        const priceRange = {
            min: 0,
            max: 0,
        };

        // Get the latest 9 products and format them
        const products = await productModel.find({}).limit(9).sort({ createdAt: -1 });
        const priceRangeLatestProducts = formatProduct(products);

        const priceRangeLatest = await productModel.find({}).sort({ price: 1 });

        if (priceRangeLatest.length > 0) {
            priceRange.max = priceRangeLatest[priceRangeLatest.length - 1].price;
            priceRange.min = priceRangeLatest[0].price;
        }

        //console.log("latest products:", priceRange);

        // Return response
        responseReturn(res, 200, { priceRangeLatestProducts, priceRange });
    } catch (error) {
        console.error("Server error:", error);
        responseReturn(res, 500, { message: "Error fetching products" });
    }
};

/*
export const get_query_sort_products = async (req, res) => {
    const parPage  = 12;
    req.query.parPage =parPage;
    console.log( "query data",req.query)
    try {
        const products = await productModel.find({}).sort({ createdAt : -1 });
        const totalProducts = new QueryProducts(products, req.query).categoryQuery()
        .ratingQuery().priceQuery().sortByPrice().countProducts();

        const result = new QueryProducts(products, req.query).categoryQuery()
        .ratingQuery().priceQuery().sortByPrice().skip().limit().getProducts();
        console.log('resultat', result);

        responseReturn(res, 200, {products : result, totalProducts})
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}
*/

/*
export const get_query_sort_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    console.log('query req ', req.query)

    try {
        // Préparez les filtres avec validation
        const filters = {
            ...(req.query.categorie && { category: req.query.categorie }),
            ...(req.query.rating && !isNaN(Number(req.query.rating)) && {
                rating: { $gte: Number(req.query.rating.trim()) },
            }),
            ...(req.query.lowPrice && !isNaN(Number(req.query.lowPrice)) &&
            req.query.highPrice && !isNaN(Number(req.query.highPrice)) && {
                price: { $gte: Number(req.query.lowPrice), $lte: Number(req.query.highPrice) },
            }),
        };

        // Appliquez les filtres
        let products = await productModel.find(filters);

        // Appliquez le tri basé sur sortPrice
        if (req.query.sortPrice) {
            if (req.query.sortPrice === 'low-to-high') {
                products = products.sort((a, b) => a.price - b.price);
            } else if (req.query.sortPrice === 'high-to-low') {
                products = products.sort((a, b) => b.price - a.price);
            }
        } else {
            // Par défaut, triez par date de création décroissante
            products = products.sort((a, b) => b.createdAt - a.createdAt);
        }

        // Appliquez la pagination
        const totalProducts = products.length;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * parPage;
        const paginatedProducts = products.slice(startIndex, startIndex + parPage);

        // Retournez les produits paginés et le total des produits
        responseReturn(res, 200, { products: paginatedProducts, totalProducts, parPage });
    } catch (error) {
        console.error("Error fetching products:", error);
        responseReturn(res, 500, { message: "Erreur lors de la récupération des produits" });
    }
};
*/
export const get_query_sort_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    //console.log('query req ', req.query);

    try {
        // Préparez les filtres avec validation
        const filters = {
            ...(req.query.categorie && { category: req.query.categorie }),
            ...(req.query.rating && !isNaN(Number(req.query.rating)) && {
                rating: { $gte: Number(req.query.rating.trim()) },
            }),
            ...(req.query.lowPrice && !isNaN(Number(req.query.lowPrice)) &&
            req.query.highPrice && !isNaN(Number(req.query.highPrice)) && {
                price: { $gte: Number(req.query.lowPrice), $lte: Number(req.query.highPrice) },
            }),
        };

        // Appliquez les filtres
        let products = await productModel.find(filters);

        // Filtrez les produits avec searchQuery
        if (req.query.searchValue) {
            const searchValue = req.query.searchValue.toUpperCase();
            products = products.filter(product => 
                product.name.toUpperCase().indexOf(searchValue) > -1
            );
        }

        // Appliquez le tri basé sur sortPrice
        if (req.query.sortPrice) {
            if (req.query.sortPrice === 'low-to-high') {
                products = products.sort((a, b) => a.price - b.price);
            } else if (req.query.sortPrice === 'high-to-low') {
                products = products.sort((a, b) => b.price - a.price);
            }
        } else {
            // Par défaut, triez par date de création décroissante
            products = products.sort((a, b) => b.createdAt - a.createdAt);
        }

        // Appliquez la pagination
        const totalProducts = products.length;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * parPage;
        const paginatedProducts = products.slice(startIndex, startIndex + parPage);

        // Retournez les produits paginés et le total des produits
        responseReturn(res, 200, { products: paginatedProducts, totalProducts, parPage });
    } catch (error) {
        //console.error("Error fetching products:", error);
        responseReturn(res, 500, { message: "Erreur lors de la récupération des produits" });
    }
};

