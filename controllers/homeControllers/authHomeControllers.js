


import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import debug from "debug";
import mongoose from 'mongoose';
import sellerCustomerModel from '../../models/chats/sellerCustomerModel.js';
import customerModel from '../../models/customerModel.js';
import sellerModel from '../../models/sellerModel.js';
import generateOtp from '../../utiles/otp_generator.js';
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
        
           // generate OTP
        const otp = generateOtp();

        const newCustomer = new customerModel({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: hashedPassword, // Stockage du mot de passe haché
            method :"manual",
            otp : otp
        });

        await newCustomer.save();
        
                    // Envoyer OTP par email
            //await sendEmail(customer.email, newOtp);
        const text = "Bienvenue chez GOBYMAIL, Saisissez ce code pour valider votre compte"
           
        sendEmail(newCustomer.email, otp, text);

       await sellerCustomerModel.create({
            myId : newCustomer.id,
        })
    
        const token = await createToken({
            id: newCustomer.id,
            name : newCustomer.name,
            email : newCustomer.email,
            method : newCustomer.method,
            otp: newCustomer.otp
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });
        
        //console.log(newSeller);
        return responseReturn(res, 201, {message: " Votre  compte client est bien créé" , token, newCustomerId : newCustomer.id});

       
    } catch (error) {
        return   responseReturn(res, 500, { status: false, message: "Erreur Interne du serveur" });
        
    }
    
}
/*
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
        //customer.verification = true;


        if (customer.otp===null) {
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
        } else {
            console.log('newCustomerId ', customer.id)
            return responseReturn(res, 204, { message: "votre compte n'est pas verifié" , newCustomerId : customer.id});
        }

    } catch (error) {
        console.error('erreur ', error.message)
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};
*/
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

/*
export const verifyCustomerAccount = async (req, res) => {
    const { customerId, otp } = req.params;

    try {
        const customer = await customerModel.findById(customerId);

        console.log('customer ', customer)

        if (!customer) {
           // return res.status(404).json({ status: false, message: "Client non trouvé" });
            return responseReturn(res, 404, { message: "Client non trouvé"  });
        }

        if (customer.verification) {
           // return res.status(400).json({ status: false, message: "Compte déjà vérifié" });
            return responseReturn(res, 400, {message: "Compte déjà vérifié" });
        }

        if (customer.otp !== otp) {
            //return res.status(400).json({ status: false, message: "Code OTP invalide" });
            return responseReturn(res, 400, {message: "Code OTP invalide" });
        }

        customer.verification = true;
        customer.otp = null;
        await customer.save();

     //   const token = jwt.sign({id: customer._id,email: customer.email,userType: "customer"
      //  }, process.env.JWT_SECRET_KEY, { expiresIn: "21d" });

        const token = await createToken({
            id: customer.id,
            name : customer.name,
            email : customer.email,
            method : customer.method,
            otp: customer.otp
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });

        const { password, otp: _, __v, ...safeData } = customer._doc;


        return responseReturn(res, 200, {message: "Compte vérifié avec succès", token});

    } catch (error) {
        console.error("Erreur vérification client :", error);
        return res.status(500).json({ status: false, message: "Erreur interne du serveur" });
    }
};
*/


export const customer_login = async (req, res) => {
    const { email, password } = req.body;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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
        if (!match) {
            return responseReturn(res, 401, { message: "Mot de passe incorrect" });
        }

        if (customer.otp!==null) {
            console.log('old otp ',customer.otp)
            // Générer un nouvel OTP
            const newOtp = generateOtp();
            customer.otp = newOtp;
            await customer.save();

            // Envoyer OTP par email
            //await sendEmail(customer.email, newOtp);
            const text = "Voici ci-dessous votre nouveau code de verification, Saisissez ce code pour valider votre compte"
            sendEmail(customer.email, newOtp, text);

        //    console.log('customer id ', customer.id)

            return responseReturn(res, 403, { 
                message: "Votre compte n'est pas vérifié. Un nouveau code vous a été envoyé.", 
                newCustomerId: customer.id
            });
        }

        // Compte vérifié : connexion normale
        const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });

        const seller = await sellerModel.findOne({ email }).select('+password');
        let roleSecond;

        if (seller) {
            roleSecond = seller.role
        }
        console.log('second role', roleSecond)
        return responseReturn(res, 200, { message: "Connexion réussie", token, roleSecond});

    } catch (error) {
        console.error('Erreur connexion client :', error.message);
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};


export const verifyCustomerAccount = async (req, res) => {
    const { customerId, otp } = req.params;

    try {
        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return responseReturn(res, 404, { message: "Client non trouvé" });
        }

        if (customer.otp===null) {
            return responseReturn(res, 400, { message: "Compte déjà vérifié" });
        }

        if (customer.otp !== otp) {
            return responseReturn(res, 400, { message: "Code OTP invalide" });
        }

        // Vérification réussie
       // customer.verification = true;
        customer.otp = null;
        await customer.save();

        const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method
        });
        res.cookie('customerToken', token, { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) });

        return responseReturn(res, 200, { message: "Compte vérifié avec succès", token });

    } catch (error) {
        console.error("Erreur vérification client :", error);
        return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};


// /api/customer/switch-to-seller
export const switch_to_seller = async (req, res) => {

    const {customerId} = req.params
   // console.log('params', req.params)

    try {
      const customer = await customerModel.findById(customerId); // req.user vient du middleware JWT

      if (!customer) {
        return res.status(404).json({ message: "Compte associé introuvable." });
      }
  
      const seller = await sellerModel.findOne({email : customer.email});
      if (!seller) {
        return res.status(404).json({ message: "Compte vendeur associé introuvable." });
      }
  
      // Génère le token vendeur
      const sellerToken = await createToken({
        id: seller._id,
        role: seller.role,
      });
  
      // Place le token vendeur en cookie sécurisé
      res.cookie("accessToken", sellerToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      });
  
      // Redirige vers le frontend vendeur
      res.json({
        success: true,
        redirect: `${process.env.CLIENT_URL}/seller/dashboard`,
        
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur lors du switch." });
    }
  };



export const send_customer_reset_otp = async (req, res) => {
    const { email } = req.body;
  
    try {
      

      const customer = await customerModel.findOne({email})

      if (!customer) {
        return responseReturn(res, 404, { message: "Aucun compte avec cet email." });
      }
  
      const otp = generateOtp();

      customer.otp = otp;
      await customer.save();
  
      const text = "Voici votre code de réinitialisation de mot de passe pour GOBYMAIL : ";
      await sendEmail(email, otp, text);
  
      return responseReturn(res, 200, { message: "OTP envoyé à votre email." });
    } catch (error) {
      return responseReturn(res, 500, { message: error.message });
    }
  };


  export const verify_customer_reset_otp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
        const customer = await customerModel.findOne({email})
  
      if (!customer || customer.otp !== otp) {
        return responseReturn(res, 400, { message: "OTP invalide." });
      }
  
      return responseReturn(res, 200, { message: "OTP vérifié avec succès." });
    } catch (error) {
      return responseReturn(res, 500, { message: error.message });
    }
  };



export const reset_customer_password = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const customer = await customerModel.findOne({email})

    if (customer.otp !== otp) {
      return responseReturn(res, 400, { message: "OTP invalide." });
    }

    if (!customer) {
      return responseReturn(res, 404, { message: "Aucun compte avec cet email." });
    }

    const hashed = await bcrypt.hash(password, 10);

    customer.password = hashed;
    customer.otp = null;
    await customer.save();

    return responseReturn(res, 200, { message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    return responseReturn(res, 500, { message: error.message });
  }
};
  
/*
export const create_seller_account= async(req, res) =>{
   

    console.log('request body', req.body)
    console.log('colsele file', req.file)
    
    
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

        const customer = await customerModel.findOne({email : req.body.email})
        let newSeller ;

        let newCustomer ;

        if (!customer ||(customer && customer.otp!==null)) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const otp = generateOtp();

            newSeller = await sellerModel.create([{
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: "seller",
                method: "manual",
                otp: otp,
                shopInfo: {
                    shopName :req.body.shopName,
                    country : req.body.country,
                    city: req.body.city,
                    address: req.body.address,
                    telephone: req.body.telephone,
                },
            }], { session });


            newCustomer = await customerModel.create([{
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: hashedPassword,
                method: "manual",
                otp: otp
            }], { session });
            
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const otp = generateOtp();
    
        newSeller = await sellerModel.create([{
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
    
         newCustomer = await customerModel.create([{
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: hashedPassword,
            method: "manual",
            otp: otp
        }], { session });
    
       

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
*/

export const create_seller_account = async (req, res) => {
   // console.log("request body", req.body);
   // console.log("file", req.file);
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    if (!emailRegex.test(req.body.email)) {
        console.log("Email invalide")
      return responseReturn(res, 400, { message: "Email invalide" });
    }
  
   
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const existingSeller = await sellerModel.findOne({ email: req.body.email });
      if (existingSeller) {
        console.log("Email déjà utilisé pour un compte vendeur")
        return responseReturn(res, 400, {
          message: "Email déjà utilisé pour un compte vendeur",
        });
      }
  
      if (!req.file) {
        return responseReturn(res, 400, { error: "Aucune image de profil envoyée" });
      }
  
      // Téléversement image Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "GOBYMALL/profile",
        public_id: `profile_${req.body.name}_${Date.now()}`,
      });
  
      if (!result || !result.secure_url) {
        return responseReturn(res, 500, {
          error: "Échec du téléversement de l'image",
        });
      }
  
      const customer = await customerModel.findOne({ email: req.body.email });
      let newSeller;
      let newCustomer = null;
      let otp = null;
      let hashedPassword;
      let newCustomerId;
  
      if (!customer || (customer && customer.otp !== null)) {
        if (!req.body.password || req.body.password.length < 8) {
            return responseReturn(res, 400, {
              message: "Le mot de passe doit comporter au moins 8 caractères",
            });
          }
        // Client inexistant ou non vérifié
        otp = generateOtp();
        hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        newSeller = await sellerModel.create(
          [
            {
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword,
              role: "seller",
              method: "manual",
              otp,
              image: result.secure_url,
              shopInfo: {
                shopName: req.body.shopName,
                country: req.body.country,
                city: req.body.city,
                address: req.body.address,
                telephone: req.body.telephone,
              },
            },
          ],
          { session }
        );
  
        if (!customer) {
          newCustomer = await customerModel.create(
            [
              {
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: hashedPassword,
                method: "manual",
                otp,
              },
            ],
            { session }
          );
        } else {
          customer.name = req.body.name;
          customer.password = hashedPassword;
          customer.otp = otp;
          await customer.save({ session });
          newCustomer = customer;
        }
  
        // Envoi OTP par mail
        sendEmail(req.body.email, otp, "Bienvenue chez GOBYMALL, saisissez ce code pour valider votre email");
     
      } else if (customer.otp === null) {
        // Client déjà vérifié
        newSeller = await sellerModel.create(
          [
            {
              name: customer.name,
              email: customer.email,
              password: customer.password,
              role: "seller",
              method: "manual",
              otp: null,
              image: result.secure_url,
              shopInfo: {
                shopName: req.body.shopName,
                country: req.body.country,
                city: req.body.city,
                address: req.body.address,
                telephone: req.body.telephone,
              },
            },
          ],
          { session }
        );
      }
 // console.log('customer' , customer)
 // console.log('new customer' , newCustomer)
 // console.log('new seller' , newSeller)
      // Lien dans la table des relations
      await sellerCustomerModel.create([{ myId: newSeller[0]._id }], { session });
  
      if (newCustomer && newCustomer._id) {
        newCustomerId = newCustomer._id;
        await sellerCustomerModel.create([{ myId: newCustomer._id ||newCustomer[0]._id  }], { session });
      }
  
      await session.commitTransaction();
      session.endSession();
  
      const sellerToken = await createToken({
        id: newSeller[0]._id,
        role: newSeller[0].role,
        otp: newSeller[0].otp,
      });
  
      const baseCustomer = newCustomer || customer;
  
      const customerToken = await createToken({
        id: baseCustomer._id,
        name: baseCustomer.name,
        email: baseCustomer.email,
        method: baseCustomer.method,
        otp: baseCustomer.otp,
      });
  
      res.cookie("accessToken", sellerToken, {
        expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
  
      res.cookie("customerToken", customerToken, {
        expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
   
      return responseReturn(res, 201, {
        message: `Compte vendeur créé avec succès `,
        sellerToken,
        customerToken,
        newCustomerId:newCustomer[0]._id
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Erreur de création de compte vendeur :", error);
      return responseReturn(res, 500, { message: error.message });
    }
  };
  
/*
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
*/