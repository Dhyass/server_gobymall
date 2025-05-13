import adminModel from '../models/adminModel.js';

import bcrypt from 'bcrypt';
import sellerModel from '../models/sellerModel.js';

import generateOtp from '../utiles/otp_generator.js';
import sendEmail from '../utiles/smtp_function.js';


import { createToken } from '../utiles/tokenCreate.js';

import { v2 as cloudinary } from 'cloudinary';
import debug from "debug";
import fs from "fs";
import { console } from 'inspector';
import mongoose from 'mongoose';
import sellerCustomerModel from '../models/chats/sellerCustomerModel.js';
import customerModel from '../models/customerModel.js';
import { responseReturn } from '../utiles/response.js';

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

    if (!emailRegex.test(email)) {
       return responseReturn(res, 400, { message: "Email invalide" });
        //return res.status(400).json({ status: false, message: "Email invalide" });
    }

    if (password.length < 8) {
       return responseReturn(res, 400, {status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
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
            res.cookie('accessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true, // OBLIGATOIRE pour un site en HTTPS
                sameSite: 'None', // OBLIGATOIRE pour cross-origin
            });
           // console.log('seller login token : ' + token);
           
            return responseReturn(res, 200, {message: "Connexion réussie" , token});
        } else {
           return responseReturn(res, 404, { message: "Mot de passe incorrect" });
        }
    } catch (error) {
       return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
}

/*
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
           // res.cookie('accessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
           res.cookie('accessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true, // OBLIGATOIRE pour un site en HTTPS
            sameSite: 'None', // OBLIGATOIRE pour cross-origin
        });
           //console.log('seller login token : ' + token);
           //process.stdout.write('seller admin token : ' + token + "\n");
            return responseReturn(res, 200, { message: "Connexion réussie", token });
        } else {
            return responseReturn(res, 404, { message: "Mot de passe incorrect" });
        }
    } catch (error) {
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};
*/

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
        let customerToken
        if (role === 'admin') {
            userInfo = await adminModel.findById(id);
        } else if (role === 'seller') {
            userInfo = await sellerModel.findById(id);

            const customer = await customerModel.findOne({email : userInfo.email}).select('+password');
            if (!customer) {
                return responseReturn(res, 400, { message: "Compte acheteur lié introuvable." });
            }

            customerToken = await createToken({
                id: customer._id,
                name: customer.name,
                email: customer.email,
            });

            res.cookie('customerToken', customerToken, {
                expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });

            // Rediriger vers le frontend client
           // res.redirect(`${process.env.CLIENT_URL2}/client-switch?`);

        } else {
            return responseReturn(res, 403, { message: "Unauthorized role" });
        }

        if (!userInfo) {
            return responseReturn(res, 404, { message: "User not found" });
        }

       return responseReturn(res, 200, { userInfo , customerToken});
    } catch (error) {
        console.error("Server Error:", error.message);
        responseReturn(res, 500, { message: "Internal server error", error: error.message });
    }
};

/*

export const seller_register= async(req, res) =>{
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    console.log('email ', req.body.email)
    console.log('password', req.body.password)

    
    if (!emailRegex.test(req.body.email)) {
       return responseReturn(res, 400, { message: "Email invalide" });

    }

    if (req.body.password.length < 8) {
      return  responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const emailExists = await sellerModel.findOne({ email: req.body.email });
        if (emailExists) {
            //return res.status(400).json({ status: false, message: "Email déjà existant" });
           return responseReturn(res, 400, { message: "Email déjà existant" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe avec bcrypt

         // generate OTP
         const otp = generateOtp();

        const newSeller = new sellerModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword, // Stockage du mot de passe haché
            role: "seller",
            method :"manual",
            otp: otp,
            shopInfo: {},
        });

        await newSeller.save();

        sendEmail(newSeller.email,otp, "Bienvenue chez GOBYMAIL", "Vous êtes désormais inscrit");
        
        await sellerCustomerModel.create({
            myId : newSeller.id,
        })
        
        const token = await createToken({
            id: newSeller.id,
            role: newSeller.role,
            otp: newSeller.otp
        });
       // res.cookie('accessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });

       res.cookie('accessToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, // OBLIGATOIRE pour un site en HTTPS
        sameSite: 'None', // OBLIGATOIRE pour cross-origin
    });

    /// pour creation automatique d'un compte acheteur

        const newCustomer = new customerModel({
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: hashedPassword, // Stockage du mot de passe haché
                method :"manual",
                otp : otp
        });
    
            await newCustomer.save();
    
    
           await sellerCustomerModel.create({
                myId : newCustomer.id,
            })
        
            const customerToken = await createToken({
                id: newCustomer.id,
                name : newCustomer.name,
                email : newCustomer.email,
                method : newCustomer.method,
                otp: newCustomer.otp
            });
            res.cookie('customerToken', customerToken, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });


    //////////////////////////////////////////
        
        //console.log(newSeller);
      return responseReturn(res, 201, {message: " Vos  comptes vendeurs sont bien créé" , token});

       
    } catch (error) {
      return  responseReturn(res, 500, { status: false, message: error.message });
        
    }
    
}
*/

 export const admin_register=async (req, res)=> {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(req.body.email)) {
        return responseReturn(res, 404, { message: "Account not found" });
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

export const logout = async (req, res) => {
   /// console.log("Début de la fonction logout");
   // process.stdout.write("Début de la fonction logout : " + "\n");

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



export const upload_profile_image = async (req, res) => {
  try {
    const { id } = req; // Assurez-vous que l'ID de l'utilisateur est disponible (par exemple via authMiddleware)
    //process.stdout.write(" id profile : " + id + "\n");
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



export const seller_register= async(req, res) =>{
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const session = await mongoose.startSession();
    session.startTransaction();

    
    if (!emailRegex.test(req.body.email)) {
      return  responseReturn(res, 400, { message: "Email invalide" });

    }

    if (req.body.password.length < 8) {
     return responseReturn(res, 400, { message: "Le mot de passe doit comporter au moins 8 caractères" });
        //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
    }

    try {
        const emailExists = await sellerModel.findOne({ email: req.body.email });
        if (emailExists) {
            //return res.status(400).json({ status: false, message: "Email déjà existant" });
          return responseReturn(res, 400, { message: "Email déjà existant" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const otp = generateOtp();
    
        const newSeller = await sellerModel.create([{
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: "seller",
            method: "manual",
            otp: otp,
            shopInfo: {},
        }], { session });

        await sellerCustomerModel.create({
            myId : newSeller[0]._id,
        })
    
        const newCustomer = await customerModel.create([{
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: hashedPassword,
            method: "manual",
            otp: otp
        }], { session });
    
        /*await sellerCustomerModel.create([{
            sellerId: newSeller[0]._id,
            customerId: newCustomer[0]._id
        }], { session });*/

        await sellerCustomerModel.create({
            myId : newCustomer[0]._id,
        })
        const text=  "Bienvenue chez GOBYMAIL, Vous êtes désormais inscrits. Saissez ce code pour valider votre email"
        sendEmail(newSeller[0].email,otp, text);
    
        await session.commitTransaction();
        session.endSession();
    
        const token = await createToken({ id: newSeller[0]._id, role: newSeller[0].role, otp: newSeller[0].otp });
        const customerToken = await createToken({ id: newCustomer[0]._id, name: newCustomer[0].name, email: newCustomer[0].email, method: newCustomer[0].method, otp: newCustomer[0].otp });
    
        res.cookie('accessToken', token, { expires: new Date(Date.now() + 21*24*60*60*1000), httpOnly: true, secure: true, sameSite: 'None' });
        res.cookie('customerToken', customerToken, { expires: new Date(Date.now() + 21*24*60*60*1000), httpOnly: true, secure: true, sameSite: 'None' });
    
       return responseReturn(res, 201, { message: "Vos comptes vendeur et acheteur sont créés.", token, customerToken });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
      return  responseReturn(res, 500, { message: error.message })
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
        // Vérifier si l'email existe dans le modèle Seller
        //const cleanEmail = email.toLowerCase().trim();
        const seller = await sellerModel.findOne({email }).select('+password');

        if (!seller) {
            return responseReturn(res, 404, { message: "Email ou mot de passe incorrect" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, seller.password);
       // const match = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return responseReturn(res, 400, { message: "Email ou mot de passe incorrect" });
        }

        // Récupérer son compte client associé
      /*  const link = await sellerCustomerModel.findOne({ sellerId: seller._id });
        if (!link) {
            return responseReturn(res, 400, { message: "Lien vendeur-acheteur introuvable." });
        }*/

        const customer = await customerModel.findOne({email}).select('+password');
        if (!customer) {
            return responseReturn(res, 400, { message: "Compte acheteur lié introuvable." });
        }

       // process.stdout.write("customer account : " + customer + "\n");

        // Générer les tokens
        const token = await createToken({
            id: seller._id,
            role: seller.role,
        });

        const customerToken = await createToken({
            id: customer._id,
            name: customer.name,
            email: customer.email,
        });

        // Mettre les deux tokens dans des cookies sécurisés
        res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.cookie('customerToken', customerToken, {
            expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        // Rediriger vers le frontend client
       // res.redirect(`${process.env.CLIENT_URL2}/client-switch?`);

      return  responseReturn(res, 200, { 
            message: "Connexion réussie",
            token,
          //  customerToken
        });

    } catch (error) {
        console.error(error);
        responseReturn(res, 500, { message: error.message });
    }
}


// /api/customer/switch-to-seller
export const switch_to_customer = async (req, res) => {

    const { id, role } = req;
   // process.stdout.write("id : " + id + "\n");
   // process.stdout.write("role : " + role + "\n");
    
    try {

        if (!id || !role) {
            return responseReturn(res, 400, { message: "Invalid request: missing user ID or role" });
        }

        const seller = await sellerModel.findById(id);

      if (!seller) {
        return res.status(404).json({ message: "Compte associé introuvable." });
      }
  
      const customer = await customerModel.findOne({email : seller.email});
      if (!customer) {
        return res.status(404).json({ message: "Compte vendeur associé introuvable." });
      }
  
      // Génère le token acheteur
      const customerToken = await createToken({
        id: customer._id,
        name: customer.name,
        email: customer.email,
    });

      res.cookie('customerToken', customerToken, {
        expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
  
      // Redirige vers le frontend vendeur
      res.json({
        success: true,
        redirect: `${process.env.CLIENT_URL2}/dashboard`,
        customerToken
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur lors du switch." });
    }
  };

  export const verify_seller_otp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const seller = await sellerModel.findOne({ email });

        if (!seller) {
            return responseReturn(res, 404, { message: "Vendeur introuvable." });
        }

        if (seller.otp !== otp) {
            return responseReturn(res, 400, { message: "Code OTP invalide." });
        }

        const customer = await customerModel.findOne({email})
        if (!customer) {
            return responseReturn(res, 404, { message: "acheteur associé introuvable." });
        }

        //seller.isVerified = true;
        seller.otp = null; // facultatif : supprime le code
        await seller.save();

        //seller.isVerified = true;
        customer.otp = null; // facultatif : supprime le code
        await customer.save();

        return responseReturn(res, 200, { message: "Compte vérifié avec succès." });
    } catch (error) {
        return responseReturn(res, 500, { message: error.message });
    }
}



export const send_reset_otp = async (req, res) => {
    const { email } = req.body;
  
    try {
      const seller = await sellerModel.findOne({ email });
      if (!seller) {
        return responseReturn(res, 404, { message: "Aucun compte avec cet email." });
      }

      const customer = await customerModel.findOne({email})

      if (!customer) {
        return responseReturn(res, 404, { message: "Aucun compte avec cet email." });
      }
  
      const otp = generateOtp();
      seller.otp = otp;
      await seller.save();

      customer.otp = otp;
      await customer.save();
  
      const text = "Voici votre code de réinitialisation de mot de passe pour GOBYMAIL : ";
      await sendEmail(email, otp, text);
  
      return responseReturn(res, 200, { message: "OTP envoyé à votre email." });
    } catch (error) {
      return responseReturn(res, 500, { message: error.message });
    }
  };


  export const verify_reset_otp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const seller = await sellerModel.findOne({ email });
  
      if (!seller || seller.otp !== otp) {
        return responseReturn(res, 400, { message: "OTP invalide." });
      }
  
      return responseReturn(res, 200, { message: "OTP vérifié avec succès." });
    } catch (error) {
      return responseReturn(res, 500, { message: error.message });
    }
  };



export const reset_password = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const seller = await sellerModel.findOne({ email });

    if (!seller || seller.otp !== otp) {
      return responseReturn(res, 400, { message: "OTP invalide." });
    }

    const customer = await customerModel.findOne({email})

    if (!customer) {
      return responseReturn(res, 404, { message: "Aucun compte avec cet email." });
    }

    const hashed = await bcrypt.hash(password, 10);
    seller.password = hashed;
    seller.otp = null;
    await seller.save();

    customer.password = hashed;
    customer.otp = null;
    await customer.save();

    return responseReturn(res, 200, { message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    return responseReturn(res, 500, { message: error.message });
  }
};




