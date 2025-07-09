import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import categoryModel from "../../models/categoryModel.js";
import { responseReturn } from "../../utiles/response.js";

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export const add_category = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file; // Utilisation de multer pour accéder au fichier

       // console.log("Fichier reçu :", req.file);

        // Validation du champ `name`
        if (typeof name !== 'string' || !name.trim()) {
             responseReturn(res, 400, { message: "Invalid name format" });
        }

        const trimmedName = name.trim();
        const slug = trimmedName.split(' ').join('-'); // Création du slug

        // Téléchargement de l'image sur Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image.path, {
            folder:'categories',
            public_id:`${slug}-${Date.now()}`
        });
        

       // console.log("Image uploadée sur Cloudinary :", uploadResult.secure_url);

        // Enregistrement dans la base de données avec l'URL sécurisée de Cloudinary
        const category = await categoryModel.create({
            name: trimmedName,
            slug,
            image: uploadResult.secure_url // Utilisation de `secure_url` pour l'URL
        });

        // Suppression du fichier temporaire après l'upload
        fs.unlink(image.path, (err) => {
            if (err) console.error("Erreur lors de la suppression du fichier temporaire :", err);
        });

        // Réponse de succès
        responseReturn(res, 201, { category, message: "Category added successfully" });
    } catch (error) {
        console.error("Error adding category:", error); // Log de l'erreur
        responseReturn(res, 500, { error: "Server error" });
    }
};

/*
export const add_category = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file; // `multer` pour accéder au fichier

        // Validation du champ `name`
        if (typeof name !== 'string' || !name.trim()) {
             responseReturn(res, 400, { message: "Invalid name format" });
        }
        
        const trimmedName = name.trim();
        const slug = trimmedName.split(' ').join('-'); // Création du slug

        // Téléchargement de l'image sur Cloudinary
        const result = await cloudinary.uploader.upload(image.path, {
            folder: 'categories',
            public_id: `${slug}-${Date.now()}`
        });

        // Enregistrement dans la base de données
        const category = await categoryModel.create({
            name: trimmedName,
            slug,
            image: result.url
        }).then(result => {
            // Supprimer le fichier temporaire après upload
            fs.unlinkSync(image.path);
            return {
                url: result.secure_url,
                public_id: result.public_id
            };
        });

        // Réponse de succès
        responseReturn(res, 201, { category, message: "Category added successfully" });
    } catch (error) {
        console.error("Error adding category:", error); // Log de l'erreur
        responseReturn(res, 500, { error: "Server error" });
    }
};
*/

export const get_category = async (req, res) =>  {
    //console.log(req.query);
    const { page = 1, searchValue = '', parPage = 10 } = req.query;
    const itemsPerPage = parseInt(parPage, 10);
    const skipPage = itemsPerPage * (parseInt(page, 10) - 1);

    try {
        let query = {};
        if (searchValue.trim()) {
            query = { $text: { $search: searchValue.trim() } };
        }

        const categories = await categoryModel.find(query)
            .skip(skipPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });
        
        const totalCategory = await categoryModel.countDocuments(query);

      //  console.log("Type de categories :", Array.isArray(categories)); // Vérification du type
       // console.log("Valeur de categories :", categories); // Vérification de la valeur

    
        responseReturn(res, 200, { categories, totalCategory});
    } catch (error) {
        console.error(error.message);
        responseReturn(res, 500, { message: "An error occurred while retrieving categories." });
    }
};


/*
export const get_category = async (req, res) =>  {
    console.log(req.query)
    const {page, searchValue, parPage} = req.query;
    

    try {
        let skipPage='';
        if (parPage && page) {
           skipPage = parseInt(parPage)*(parseInt(page)-1);
        }
        if (searchValue&&page&&parPage) {
            const categories = await categoryModel.find({$text:{$search : searchValue}
            }).skip(skipPage).limit(parPage).sort({createdAt:-1});
            const totalCategory =await categoryModel.find({$text:{$search : searchValue}}).countDocuments();
            responseReturn(res, 200, {categories, totalCategory});
        } else if(searchValue==''&&page&&parPage)  {
            const categories = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({createdAt:-1});
            const totalCategory =await categoryModel.find({}).countDocuments();
            responseReturn(res, 200, {categories, totalCategory});
        }else{
            const categories = await categoryModel.find({}).limit(10).sort({createdAt:-1});
            const totalCategory =await categoryModel.find({}).countDocuments();
            responseReturn(res, 200, {categories, totalCategory});
        }
    } catch (error) {
        console.log(error.message)
    }
 
}
*/


export const delete_category = async (req, res) =>  {
    console.log('delete category')
 
}

