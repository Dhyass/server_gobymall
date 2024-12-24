
/*
class QueryProducts {
    products = [];
    query = {};

    constructor(products, query) {
        this.products = products;
        this.query = query;
    }

    categoryQuery = () => {
        this.products = this.query.categorie
            ? this.products.filter(product => product.categorie === this.query.categorie)
            :this.products;
        
        return this;
    };

    ratingQuery = () => {
       this.products = this.query.rating 
       ? this.products.filter(product => 
        parseInt(this.query.rating) <= product.rating 
        && product.rating < parseInt(this.query.rating)+1) 
       :this.products;

       return this;
    }

    priceQuery = () => {
        this.products = this.query.price ? this.products.filter(product =>  
        product.price >= this.query.lowPrice 
        && product.price <= this.query.highPrice) 
        : this.products
        return this;
    }

    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice==='low-to-high') {
                this.products = this.products.sort(function(a,b){
                    return a.price - b.price;
                });
            } else {
                this.products = this.products.sort(function(a,b){
                    return b.price - a.price;
                });
            }
        }
        return this;
    }

    skip = () => {
        let {pageNumber} = this.query;
        let skipPage = (parseInt(pageNumber)-1)*this.query.parPage;
        let skipProducts = []
        for (let i = skipPage; i < this.products.length; i++) {
            skipProducts.push(this.products[i]);
        }
        this.products = skipProducts;
        return this;
    }

    limit = () =>{
        let temp =[]
        if (this.products.length > this.query.parPage) {
            for (let i = 0; i < this.query.parPage; i++) {
                temp.push(this.products[i])
            }
            
        }else {
            temp = this.products  
        }
        this.products = temp
       return this; 
    }

    getProducts = () => {
        return this.products;
    }

    countProducts = () => {
        return this.products.length
    }
}
export default QueryProducts;
*/
class QueryProducts {
    products = [];
    query = {};

    constructor(products, query) {
        this.products = products;
        this.query = query;
    }

    categoryQuery = () => {
       // console.log("Before categoryQuery:", this.products);
        this.products = this.query.categorie
            ? this.products.filter(product => product.categorie === this.query.categorie)
            : this.products;
       //console.log("After categoryQuery:", this.products);
        return this;
    };
    

    ratingQuery = () => {
        this.products = this.query.rating
            ? this.products.filter(product =>
                product.rating >= parseInt(this.query.rating) &&
                product.rating < parseInt(this.query.rating) + 1
            )
            : this.products;
        return this;
    };
    
    priceQuery = () => {
        const { lowPrice, highPrice } = this.query;
        if (lowPrice !== undefined && highPrice !== undefined) {
            this.products = this.products.filter(
                product => product.price >= parseInt(lowPrice) && product.price <= parseInt(highPrice)
            );
        }
        return this;
    };
    
    searchQuery = () => {
        this.products = this.query.searchValue ? 
        this.products.filter(product=> product.name.toUpperCase().indexOf(this.query.searchValue.toUpperCase()) > -1)
        :this.products

        return this
    }

    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice==='low-to-high') {
                this.products = this.products.sort(function(a,b){
                    return a.price - b.price;
                });
            } else {
                this.products = this.products.sort(function(a,b){
                    return b.price - a.price;
                });
            }
        }
        return this;
    }

    skip = () => {
        const { pageNumber, parPage } = this.query;
        const skipPage = (parseInt(pageNumber) - 1) * parPage;
        //console.log(`Skipping ${skipPage} products out of ${this.products.length}`);
        this.products = this.products.slice(skipPage);
        return this;
    };
    
    limit = () => {
        const { parPage } = this.query;
        //console.log(`Limiting to ${parPage} products from ${this.products.length}`);
        this.products = this.products.slice(0, parPage);
        return this;
    };
    

    getProducts = () => {
        return this.products;
    }

    countProducts = () => {
        return this.products.length
    }
}
export default QueryProducts;
