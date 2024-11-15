import adminModel from '../models/adminModel.js';

import bcrypt from 'bcrypt';
import sellerModel from '../models/sellerModel.js';

import sellerCustomerModel from '../models/chats/sellerCustomerModel.js';
import { responseReturn } from '../utiles/response.js';
import sendEmail from '../utiles/smtp_function.js';
import { createToken } from '../utiles/tokenCreate.js';


export const admin_login = async (req, res) =>  {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(req.body.email)) {
        responseReturn(res, 400, { message: "Email invalide" });
        //return res.status(400).json({ status: false, message: "Email invalide" });
    }

    if (req.body.password.length < 8) {
        responseReturn(res, 400, {status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const admin = await adminModel.findOne({ email }).select('+password');
        if (!admin) {
            return responseReturn(res, 404, { message: "Account not found" });
        }

        // Déchiffrer le mot de passe pour vérifier
    // const decryptedPassword = CryptoJs.AES.decrypt(admin.password, process.env.SECRET).toString(CryptoJs.enc.Utf8);
        const match = await bcrypt.compare(password, admin.password);

        if (match) {
            const token = await createToken({
                id: admin.id,
                role: admin.role 
            });
            res.cookie('AccessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
            responseReturn(res, 200, {message: "Connexion réussie" , token});
        } else {
            responseReturn(res, 404, { message: "Mot de passe incorrect" });
        }
    } catch (error) {
        responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
}


export const seller_login = async (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
        return responseReturn(res, 400, { message: "Email invalide" });
    }

    if (password.length < 8) {
        return responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const seller = await sellerModel.findOne({ email }).select('+password');
        if (!seller) {
            return responseReturn(res, 404, { message: "Compte introuvable" });
        }

        const match = await bcrypt.compare(password, seller.password);

        if (match) {
            const token = await createToken({
                id: seller.id,
                role: seller.role 
            });
            res.cookie('AccessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
            return responseReturn(res, 200, { message: "Connexion réussie", token });
        } else {
            return responseReturn(res, 404, { message: "Mot de passe incorrect" });
        }
    } catch (error) {
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};


export const getUser = async (req, res) => {
    const { id, role } = req;

    // Log to check if id and role are received correctly
    //console.log("User ID:", id, "Role:", role);

    if (!id || !role) {
        return responseReturn(res, 400, { message: "Invalid request: missing user ID or role" });
    }

    try {
        let userInfo;
        if (role === 'admin') {
            userInfo = await adminModel.findById(id);
        } else if (role === 'seller') {
            userInfo = await sellerModel.findById(id);
        } else {
            return responseReturn(res, 403, { message: "Unauthorized role" });
        }

        if (!userInfo) {
            return responseReturn(res, 404, { message: "User not found" });
        }

        responseReturn(res, 200, { userInfo });
    } catch (error) {
        console.error("Server Error:", error.message);
        responseReturn(res, 500, { message: "Internal server error", error: error.message });
    }
};





export const seller_register= async(req, res) =>{
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    
    if (!emailRegex.test(req.body.email)) {
        responseReturn(res, 400, { message: "Email invalide" });

    }

    if (req.body.password.length < 8) {
        responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const emailExists = await sellerModel.findOne({ email: req.body.email });
        if (emailExists) {
            //return res.status(400).json({ status: false, message: "Email déjà existant" });
            responseReturn(res, 400, { message: "Email déjà existant" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe avec bcrypt

        const newSeller = new sellerModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword, // Stockage du mot de passe haché
            role: "seller",
            method :"manual",
            shopInfo: {},
        });

        await newSeller.save();

        sendEmail(newSeller.email, "Bienvenue chez GOBYMAIL", "Vous êtes désormais inscrit");
        await sellerCustomerModel.create({
            myId : newSeller.id,
        })
        
        const token = await createToken({
            id: newSeller.id,
            role: newSeller.role 
        });
        res.cookie('AccessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
        
        //console.log(newSeller);
        responseReturn(res, 201, {message: " Votre  compte vendeur est bien créé" , token});

       
    } catch (error) {
        responseReturn(res, 500, { status: false,message: "Erreur Interne du serveur" });
        
    }
    
}


 export const admin_register=async (req, res)=> {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(req.body.email)) {
         responseReturn(res, 404, { message: "Account not found" });
        //return res.status(400).json({ status: false, message: "Email invalide" });
    }

    if (req.body.password.length < 8) {
        responseReturn(res, 404, { message: "Mot de passe doit contenir au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const emailExists = await adminModel.findOne({ email: req.body.email });
        if (emailExists) {
            responseReturn(res, 400, { message: "Email déjà utilisé" });
            
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe avec bcrypt

        const newUser = new adminModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword, // Stockage du mot de passe haché
            role: "admin",
        });

        await newUser.save();
        responseReturn(res, 201, {status: true, message: "Comptecréé avec succès" });
        //res.status(201).json({ status: true, message: "Utilisateur créé avec succès" });
    } catch (error) {
        responseReturn(res, 500, {status: false, message: "Erreur Interne du serveur" });
        
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout successfully" });
}


