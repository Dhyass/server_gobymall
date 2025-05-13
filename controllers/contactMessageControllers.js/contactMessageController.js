import nodemailer from 'nodemailer';
import contactMessageModel from "../../models/contactMessageModel.js";
import { responseReturn } from '../../utiles/response.js';


export const sendContactMessage = async (req, res) => {
  const { firstName, name, email, telephone, subject, message } = req.body;

 // console.log("req body ", req.body);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[0-9]{8,15}$/;

  if (!firstName || !name || !email || !telephone || !subject || !message) {
    return responseReturn(res, 400, { message: "Tous les champs sont requis." });
  }

  if (firstName.trim().length < 2) {
    return responseReturn(res, 400, { message: "Le prénom doit contenir au moins 2 caractères." });
  }

  if (name.trim().length < 2) {
    return responseReturn(res, 400, { message: "Le nom doit contenir au moins 2 caractères." });
  }

  if (!emailRegex.test(email)) {
    return responseReturn(res, 400, { message: "Email invalide." });
  }

  if (!phoneRegex.test(telephone)) {
    return responseReturn(res, 400, { message: "Numéro de téléphone invalide." });
  }

  if (subject.trim().length < 5 || subject.trim().length > 100) {
    return responseReturn(res, 400, { message: "Le sujet doit contenir entre 5 et 100 caractères." });
  }

  if (message.trim().length < 10 || message.trim().length > 1000) {
    return responseReturn(res, 400, { message: "Le message doit contenir entre 10 et 1000 caractères." });
  }

  try {
    console.log("req body ", req.body);

    const newMessage = new contactMessageModel({
      firstName,
      name,
      email,
      telephone,
      subject,
      message
    });

    console.log("message ", newMessage);

    await newMessage.save();

    // ✅ Envoi du mail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou smtp: "smtp.mailprovider.com"
      auth: {
        user: process.env.AUTH_EMAIL, // contact@gobymall.com
        pass: process.env.AUTH_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Gobymall Contact" <${process.env.AUTH_EMAIL}>`,
      to: process.env.PERSONAL_EMAIL, // par ex. vers ton adresse personnelle ou contact pro
      subject: `📩 Nouveau message de contact - ${subject}`,
      html: `
        <h3>Nouveau message reçu via le formulaire de contact</h3>
        <p><strong>Nom :</strong> ${firstName} ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `
    };

      try {
          await transporter.sendMail(mailOptions);
          //console.log(`Verification Email sent to ${userEmail}`);
      } catch (error) {
        console.log(error);
          throw new Error(`Email sending failed with error: ${error}`);
      }

    return responseReturn(res, 201, { message: 'Message envoyé avec succès.' });

  } catch (error) {
    console.error(error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
