import mongoose from "mongoose";
import sellerModel from "../../models/sellerModel.js";
import { responseReturn } from "../../utiles/response.js";
const { Types } = mongoose;

export const get_seller_request = async (req, res) =>  {
   /// console.log('get seller request ',req.query);
    const { page = 1, searchValue = '', parPage = 10 } = req.query;
    const itemsPerPage = parseInt(parPage, 10);
    const skipPage = itemsPerPage * (parseInt(page, 10) - 1);

    try {
        let query = {};
        if (searchValue.trim()) {
            query = { $text: { $search: searchValue.trim() } };
        }else {
            query = {status : 'pending'}

            const sellers = await sellerModel.find(query)
            .skip(skipPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });
            const totalSellers = await sellerModel.countDocuments(query);
             //  console.log("Type de categories :", Array.isArray(categories)); // Vérification du type
       // console.log("Valeur de categories :", categories); // Vérification de la valeur

      return  responseReturn(res, 200, { sellers, totalSellers });
        }

    } catch (error) {
        console.error(error.message);
     return responseReturn(res, 500, { message: "An error occurred while retrieving sellers." });
    }
};


export const get_seller_by_id = async (req, res) => {
    const { id } = req.params;
    //process.stdout.write("req.params: " + JSON.stringify(req.params) + "\n");

    try {
        // Vérification de l'ID
        if (!Types.ObjectId.isValid(id)) {
            process.stdout.write("ID invalide\n");
            return responseReturn(res, 400, { message: "ID invalide" });
        }

        // Recherche du vendeur
        const seller = await sellerModel.findById(id);
        if (!seller) {
            process.stdout.write("Seller not found\n");
            return responseReturn(res, 404, { message: "Seller not found" });
        }

       // process.stdout.write("Seller found: " + JSON.stringify(seller) + "\n");
        return responseReturn(res, 200, { seller });
    } catch (error) {
        process.stdout.write("Erreur du serveur: " + error.message + "\n");
        return responseReturn(res, 500, { error: "Erreur interne du serveur" });
    }
};

export const seller_status_update = async (req, res) => {
    const {sellerId, status } = req.body;
    //process.stdout.write("req.params: " + JSON.stringify(req.body) + "\n");
    try {
        // Vérification de l'ID
        if (!Types.ObjectId.isValid(sellerId)) {
            //process.stdout.write("ID invalide\n");
            return responseReturn(res, 400, { message: "ID invalide" });
        }
        // Vérification de la valeur de status
        if (!["active", "deactive"].includes(status)) {
            //process.stdout.write("Status invalide\n");
            return responseReturn(res, 400, { message: "Status invalide" });
        }
        // Mise à jour du status
        const seller = await sellerModel.findByIdAndUpdate(sellerId, { status }, { new: true });
        if (!seller) {
            //process.stdout.write("Seller not found\n");
            return responseReturn(res, 404, { message: "Seller not found" });
        }
       // process.stdout.write("Seller updated: " + JSON.stringify(seller) + "\n");
        return responseReturn(res, 200, { message : "Seller status updated" });
        
    } catch (error) {
        process.stdout.write("Erreur du serveur: " + error.message + "\n");
        return responseReturn(res, 500, { error: "Erreur interne du serveur" });
        
    }

}
