import adminModel from '../models/adminModel.js';

import bcrypt from 'bcrypt';
import sellerModel from '../models/sellerModel.js';

import sellerCustomerModel from '../models/chats/sellerCustomerModel.js';
import { responseReturn } from '../utiles/response.js';
import sendEmail from '../utiles/smtp_function.js';
import { createToken } from '../utiles/tokenCreate.js';

import { v2 as cloudinary } from 'cloudinary';
import debug from "debug";
import fs from "fs";
import { console } from 'inspector';

const log = debug("app:upload");



// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export const admin_login = async (req, res) =>  {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

   // console.log('email admin ' + email);
   //process.stdout.write("email admin : " + email + "\n");

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

    //process.stdout.write("seller email : " + email + "\n");

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
   // process.stdout.write("User ID: " + id +"\n" + "Role:" + role + "\n");

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
        responseReturn(res, 500, {message: "Erreur Interne du serveur" });
        
    }
}
/*
export const upload_profile_image = async (req, res) => {
    //console.log("Début de la fonction upload_profile_image");
    process.stdout.write("Début de la fonction upload_profile_image" + "\n");
    res.status(200).send({ message: "Test réussi." });
  };
*/
export const logout = async (req, res) => {
   /// console.log("Début de la fonction logout");
    process.stdout.write("Début de la fonction logout : " + "\n");

    try {
        res.cookie('accessToken',null,{
            expires : new Date(Date.now()),
            httpOnly : true
        })
        responseReturn(res,200,{message : 'logout success'})
    } catch (error) {
        responseReturn(res, 500, { error: error.message })
    }
}

/*
export const logout = async (req, res) => {
    //console.log("Déconnexion en cours...");
    process.stdout.write("Début de la fonction logout : " + "\n");
    res.clearCookie("token").status(200).json({ message: "Logout successfully" });
  };
*/

export const upload_profile_image = async (req, res) => {
  try {
    const { id } = req; // Assurez-vous que l'ID de l'utilisateur est disponible (par exemple via authMiddleware)
    process.stdout.write(" id profile : " + id + "\n");
    // Vérifiez si un fichier est attaché à la requête
    if (!req.file) {
      return responseReturn(res, 400, { error: "Aucun fichier fourni" });
    }

    const imagePath = req.file.path; // Multer enregistre le fichier temporairement ici
    const imageName = req.file.originalname;

    // Téléversement de l'image sur Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "GOBYMALL/profile",
      public_id: `profile_${id}_${Date.now()}`, // Génère un identifiant unique pour le fichier
    });

    if (!result || !result.url) {
      return responseReturn(res, 500, { error: "Échec du téléversement de l'image" });
    }

    // Mettre à jour l'image de profil de l'utilisateur dans la base de données
    const updatedUser = await sellerModel.findByIdAndUpdate(
      id,
      { image: result.url },
      { new: true } // Retourne les nouvelles informations après la mise à jour
    );

    if (!updatedUser) {
      return responseReturn(res, 404, { error: "Utilisateur introuvable" });
    }

    // Suppression du fichier temporaire après l'upload
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression du fichier temporaire :", err);
      }
    });

    const userInfo = await sellerModel.findById(id);

    // Retourner les informations mises à jour de l'utilisateur
    return responseReturn(res, 200, { message: "Image téléversée avec succès", userInfo: userInfo });

  } catch (error) {
    //console.error("Erreur lors du téléversement de l'image :", error.message);
    responseReturn(res, 500, { error: "Erreur serveur" });
  }
};

export const profile_info_add = async (req, res) => {
   // process.stdout.write("profile mise à jour :  \n" + req.body);
  const { shopName, country,city,address,telephone } = req.body;
 
 try {
    const { id } = req; // Assurez-vous que l'ID de l'utilisateur est disponible (par exemple via authMiddleware)
    //process.stdout.write(" id profile : " + id + "\n");
    // Mise à jour des informations de profil de l'utilisateur dans la base de données
    const updatedUser = await sellerModel.findByIdAndUpdate(id, {
        shopInfo : {
            shopName ,  
            country,
            city,
            address,
            telephone
        }
    })
    if (!updatedUser) {
        responseReturn(res, 404, { error: "Utilisateur introuvable" });
    }
    const userInfo = await sellerModel.findById(id);
    // Retourner les informations mises à jour de l'utilisateur
   responseReturn(res, 200, { message: "Informations de profil mises à jour avec succès" });

    
  } catch (error) {
    //console.error("Erreur lors de la mise à jour des informations de profil :", error.message );
    responseReturn(res, 500, { error: "Erreur serveur" });
    
  }


}

