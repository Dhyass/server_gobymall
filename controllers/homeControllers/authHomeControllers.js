


import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import debug from "debug";
import sellerCustomerModel from '../../models/chats/sellerCustomerModel.js';
import customerModel from '../../models/customerModel.js';
import { responseReturn } from '../../utiles/response.js';
import sendEmail from '../../utiles/smtp_function.js';
import { createToken } from '../../utiles/tokenCreate.js';


const log = debug("app:upload");



// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export const customer_register= async(req, res) =>{
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    
    if (!emailRegex.test(req.body.email)) {
        return responseReturn(res, 400, { message: "Email invalide" });

    }

    if (req.body.password.length < 8) {
        return responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const emailExists = await customerModel.findOne({ email: req.body.email });
        if (emailExists) {
            //return res.status(400).json({ status: false, message: "Email déjà existant" });
            return responseReturn(res, 400, { message: "Email déjà existant" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe avec bcrypt

        const newCustomer = new customerModel({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: hashedPassword, // Stockage du mot de passe haché
            method :"manual",
        });

        await newCustomer.save();

        sendEmail(newCustomer.email, "Bienvenue chez GOBYMAIL", "Vous êtes désormais inscrit");
       await sellerCustomerModel.create({
            myId : newCustomer.id,
        })
    
        const token = await createToken({
            id: newCustomer.id,
            name : newCustomer.name,
            email : newCustomer.email,
            method : newCustomer.method 
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
        
        //console.log(newSeller);
        return responseReturn(res, 201, {message: " Votre  compte client est bien créé" , token});

       
    } catch (error) {
        return   responseReturn(res, 500, { status: false,message: "Erreur Interne du serveur" });
        
    }
    
}

export const customer_login = async (req, res) => {
    const { email, password } = req.body;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    ///process.stdout.write("customer email : " + email + "\n");

    if (!emailRegex.test(email)) {
        return responseReturn(res, 400, { message: "Email invalide" });
    }

    if (password.length < 8) {
        return responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const customer = await customerModel.findOne({ email }).select('+password');
        if (!customer) {
            return responseReturn(res, 404, { message: "Compte introuvable" });
        }

        const match = await bcrypt.compare(password, customer.password);

        if (match) {
             const token = await createToken({
            id: customer.id,
            name : customer.name,
            email : customer.email,
            method : customer.method 
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
            return responseReturn(res, 200, { message: "Connexion réussie", token });
        } else {
            return responseReturn(res, 404, { message: "Mot de passe incorrect" });
        }
    } catch (error) {
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};

export const customer_logouts = async (req, res) => {
    /// console.log("Début de la fonction logout");
     //process.stdout.write("Début de la fonction logout : " + "\n");
 
     try {
         /*res.cookie('customerToken',null,{
             expires : new Date(Date.now()),
             httpOnly : true
         })*/
             res.cookie('customerToken', null, {
                expires: new Date(Date.now() - 1000), // Expiration dans le passé
                httpOnly: true,
            });
        return responseReturn(res,200,{message : 'logout success'})
     } catch (error) {
        return responseReturn(res, 500, { error: error.message })
     }
 }

 export const customer_logout = async (req, res) => {
    try {
        // Supprime le cookie en le définissant comme expiré
        res.cookie('customerToken', null, {
            expires: new Date(Date.now() - 1000), // Expiration dans le passé
            httpOnly: true,
        });
        
        // Retourne une réponse de succès
        return responseReturn(res, 200, { message: 'Déconnexion réussie' });
        //return res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        // Gestion des erreurs
        return res.status(500).json({ success: false, error: error.message });
    }
};


