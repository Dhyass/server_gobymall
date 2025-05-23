
import mongoose from "mongoose";
import Stripe from 'stripe'; // Assure-toi que tu utilises une version compatible ES Modules.
import { v4 as uuidv4 } from "uuid";
import sellerModel from "../../models/sellerModel.js";
import sellerWalletModel from '../../models/sellerWalletModel.js';
import stripeModel from "../../models/stripeModel.js";
import withdrawRequestModel from '../../models/withdrawRequestModel.js';
import { responseReturn } from "../../utiles/response.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Utilise la clé depuis l'environnement.




export const create_stripe_connect_account = async(req, res)=>{
  //console.log('create_stripe_connect_account')
  //console.log('req id', req.id)
  const {id} = req
  const uid = uuidv4()
  try {
    const stripeInfo = await stripeModel.findOne({sellerId : id})

    if (stripeInfo) {
      await stripeInfo.deleteOne({sellerId : id})
      const account = await stripe.accounts.create({type : 'express'})

      const accountLink = await stripe.accountLinks.create({
        account: account.id, // Identifiant du compte Stripe
        refresh_url: `${process.env.CLIENT_URL}/refresh`, // URL pour recharger en cas d'échec
        return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`, // URL de retour après validation
        type: 'account_onboarding', // Type de lien (nécessaire pour Stripe)
      });
      await stripeModel.create({
        sellerId : id,
        stripeId : account.id,
        code : uid
      })
      console.log('accountLink ', accountLink)
     return responseReturn(res, 201, {url : accountLink})
    }else {
      const account = await stripe.accounts.create({type : 'express'})

      const accountLink = await stripe.accountLinks.create({
        account: account.id, // Identifiant du compte Stripe
        refresh_url: `${process.env.CLIENT_URL}/refresh`, // URL pour recharger en cas d'échec
        return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`, // URL de retour après validation
        type: 'account_onboarding', // Type de lien (nécessaire pour Stripe)
      });
      await stripeModel.create({
        sellerId : id,
        stripeId : account.id,
        code : uid
      })
      
     // console.log('accountLink ', accountLink)
      return responseReturn(res, 200, {url : accountLink})
    }
  } catch (error) {
    console.log('internal error ', error.message)
    responseReturn(res, 500, {message : 'internal error'})
  }
}

/*
export const create_stripe_connect_account  = async (req, res) => {
  const { id } = req; // ID du vendeur
  const uid = uuidv4(); // Code d'activation unique

  try {
    let stripeInfo = await stripeModel.findOne({ sellerId: id });

    // Si un compte Stripe existe déjà
    if (stripeInfo) {
      const account = await stripe.accounts.retrieve(stripeInfo.stripeId);

      // Si le compte n'est pas encore activé
      if (!account.charges_enabled || !account.payouts_enabled || account.requirements.pending_verification.length > 0) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.CLIENT_URL}/refresh`,
          return_url: `${process.env.CLIENT_URL}/success?activeCode=${stripeInfo.code}`,
          type: 'account_onboarding',
        });

        return responseReturn(res, 200, { url: accountLink });
      }

      // Le compte est déjà activé
      return responseReturn(res, 200, {
        message: "Compte Stripe déjà activé pour ce vendeur.",
        stripeId: stripeInfo.stripeId,
      });
    }

    // Aucun compte Stripe trouvé : on crée un nouveau compte
    const account = await stripe.accounts.create({ type: 'express' });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_URL}/refresh`,
      return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`,
      type: 'account_onboarding',
    });

    // Enregistrer les infos du compte Stripe dans la base de données
    await stripeModel.create({
      sellerId: id,
      stripeId: account.id,
      code: uid,
    });

    return responseReturn(res, 201, { url: accountLink });
  } catch (error) {
    console.error('Erreur Stripe :', error.message);
    return responseReturn(res, 500, { message: 'Erreur interne Stripe' });
  }
};
*/

/*
export const create_stripe_connect_account = async (req, res) => {
  const { id } = req; // ID du vendeur
  const uid = uuidv4(); // Code d'activation unique

  try {
    let stripeInfo = await stripeModel.findOne({ sellerId: id });

    if (stripeInfo) {
      const account = await stripe.accounts.retrieve(stripeInfo.stripeId);

      // Vérifiez si des actions supplémentaires sont requises
      if (
        !account.charges_enabled ||
        !account.payouts_enabled ||
        account.requirements.pending_verification.length > 0
      ) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.CLIENT_URL}/refresh`,
          return_url: `${process.env.CLIENT_URL}/success?activeCode=${stripeInfo.code}`,
          type: "account_onboarding",
        });

        return responseReturn(res, 200, {
          message: "Actions supplémentaires requises pour activer le compte.",
          url: accountLink.url, // Redirige le vendeur vers le lien d'onboarding
        });
      }

      // Le compte est déjà activé
      return responseReturn(res, 200, {
        message: "Compte Stripe déjà activé pour ce vendeur.",
        stripeId: stripeInfo.stripeId,
      });
    }

    // Aucun compte Stripe trouvé : on crée un nouveau compte
    const account = await stripe.accounts.create({ type: "express" });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_URL}/refresh`,
      return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`,
      type: "account_onboarding",
    });

    // Enregistrer les infos du compte Stripe dans la base de données
    await stripeModel.create({
      sellerId: id,
      stripeId: account.id,
      code: uid,
    });

    return responseReturn(res, 201, { url: accountLink.url });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    return responseReturn(res, 500, { message: "Erreur interne Stripe" });
  }
};
*/

export const active_stripe_connect_account = async (req, res) => {
  //console.log(' req params ', req.params)
  const {activeCode} = req.params
  const {id} = req

  try {
    const userStripeInfo = await stripeModel.findOne({code : activeCode})
    if (userStripeInfo) {
        await sellerModel.findByIdAndUpdate(id, {payment : 'active'})
        return responseReturn(res, 200, {message : 'stripe account active'})
    }else {
     return responseReturn(res , 404, {message : 'stripe account not found'})
    }
  } catch (error) {
    console.log('internal error ', error.message)
   return responseReturn(res, 500, {message : 'internal error'})
  }
}
/*
export const sumAmount = (data)=>{
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].amount;
  }
  return sum;
}

export const get_seller_payment_details = async(req,res) =>{
  ///console.log(' req params ', req.params)
  const {sellerId} = req.params
  try {
    /*const amount = await sellerWalletModel.aggregate([
      {
        $match: {
          sellerId: {
            $eq: sellerId
          }
        }
      },

      {
        $group : {
          _id : null,
          totalAmount : {$sum : '$amount'}
        }
      }
    ])
   const payments = await sellerWalletModel.find({sellerId : sellerId})
    console.log(' payments ', payments)

    const pendingWithdraws = await withdrawRequestModel.find({
      $and:[
        {
          sellerId :{
            $eq : sellerId
          }
        },
        {
          status : {
            $eq : 'pending'
          }
        }
      ]
    })


    const successWithdraws = await withdrawRequestModel.find({
      $and:[
        {
          sellerId :{
            $eq : sellerId
          }
        },
        {
          status : {
            $eq : 'success'
          }
        }
      ]
    })

    const pendingAmount = this.sumAmount(pendingWithdraws)
    const successAmount = this.sumAmount(successWithdraws)
    const totalAmount = this.sumAmount(payments)

    let availableAmount = 0;

    if (totalAmount) {
      availableAmount = totalAmount-(pendingAmount-successAmount)
    }
    console.log('availableAmount', availableAmount)

    return responseReturn(res,200,{
      totalAmount : totalAmount,
      pendingAmount : pendingAmount,
      withdrawalAmount : successAmount,
      availableAmount : availableAmount,
      successWithdraws : successWithdraws,
      pendingWithdraws : pendingWithdraws
    })
  } catch (error) {
    console.log('internal error ', error.message)
   return responseReturn(res, 500, {message : 'internal error'})
  }
}*/

export const sumAmount = (data) => {
  return data.reduce((sum, item) => sum + (item.amount || 0), 0);
};

export const get_seller_payment_details = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const payments = await sellerWalletModel.find({ sellerId });
   // console.log('Payments:', payments);

    const pendingWithdraws = await withdrawRequestModel.find({
      sellerId,
      status: 'pending',
    });

    const successWithdraws = await withdrawRequestModel.find({
      sellerId,
      status: 'success',
    });

    // Calcul des montants
    const pendingAmount = sumAmount(pendingWithdraws);
    const successAmount = sumAmount(successWithdraws);
    const totalAmount = sumAmount(payments);

    let availableAmount = 0;

    if (totalAmount>0) {
      availableAmount = totalAmount - (pendingAmount + successAmount);
     // console.log('available Amount', availableAmount)
    }

  //  console.log('Available Amount:', availableAmount);

    return responseReturn(res, 200, {
      totalAmount,
      pendingAmount,
      withdrawalAmount: successAmount,
      availableAmount,
      successWithdraws,
      pendingWithdraws,
    });
  } catch (error) {
    console.error('Internal error:', error.message);
    return responseReturn(res, 500, { message: 'Internal error' });
  }
};


export const send_withdrawal_request= async (req, res) => {
  const { sellerId, amount } = req.body;
  try {
    const withdrawal = await withdrawRequestModel.create({
      sellerId,
      amount: parseInt(amount)
    })
    return responseReturn(res,200,{withdrawal, message : 'Withdrawal request sent successfully'})
  } catch (error) {
    console.error('Internal error:', error.message);
    return responseReturn(res, 500, { message: 'Internal error' });
  }
}

export const get_withdrawal_request= async (req, res) => {
  try {
    const withdrawalRequest = await withdrawRequestModel.find({ status: 'pending' })
    responseReturn(res, 200, { withdrawalRequest })
  } catch (error) {
      responseReturn(res, 500, { message: 'Internal server error' })
  }
}
/*
export const confirm_withdrawal_request= async (req, res) => {
  const { paymentId } = req.body
  console.log('payment id ', paymentId)

        try {
            const payment = await withdrawRequestModel.findById(paymentId)
           // console.log('payment ', payment)
           if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
                           return responseReturn(res, 400, { message: "ID invalide" });
                    }
             const paymentObjectId = mongoose.Types.ObjectId.createFromHexString(paymentId);
            const { stripeId } = await stripeModel.findOne({
                sellerId: paymentObjectId
            })

            await stripe.transfers.create({
                amount: payment.amount * 100,
                currency: 'usd',
                destination: stripeId
            })
            await withdrowRequest.findByIdAndUpdate(paymentId, { status: 'success' })
            responseReturn(res, 200, { payment, message: 'request confirm success' })
        } catch (error) {
            console.log(error)
            responseReturn(res, 500, { message: 'Internal server error' })
        }

}*/


export const confirm_withdrawal_request = async (req, res) => {
  const { paymentId } = req.body;

  console.log('payment id ', paymentId);

  // Vérifiez si l'ID est valide
  if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
    return responseReturn(res, 400, { message: "ID de paiement invalide" });
  }

  try {
    // Vérifiez si la demande de retrait existe
    const payment = await withdrawRequestModel.findById(paymentId);
    if (!payment) {
      return responseReturn(res, 404, { message: "Demande de retrait introuvable" });
    }

   // console.log('payment ', payment)

    // Récupérez le sellerId depuis la demande de retrait
    const { sellerId } = payment;
    console.log('sellerId ', sellerId)
    if (!sellerId) {
      return responseReturn(res, 400, { message: "ID du vendeur introuvable dans la demande de retrait" });
    }

    // Recherchez le compte Stripe associé au vendeur
    const stripeData = await stripeModel.findOne({ sellerId: new mongoose.Types.ObjectId(sellerId) });
    if (!stripeData || !stripeData.stripeId) {
      return responseReturn(res, 404, { message: "Aucun compte Stripe associé trouvé pour ce vendeur" });
    }

    const { stripeId } = stripeData;

    console.log('stripeId ', stripeId)
    console.log('payment.amount ', payment.amount)

    // Créez le transfert Stripe
    await stripe.transfers.create({
      amount: payment.amount * 100, // Assurez-vous que payment.amount est un nombre
      currency: 'usd',
      destination: stripeId,
    });

    // Mettez à jour le statut de la demande de retrait
    await withdrawRequestModel.findByIdAndUpdate(paymentId, { status: 'success' });

    responseReturn(res, 200, { payment, message: 'Demande de retrait confirmée avec succès' });
  } catch (error) {
    console.error(error);
    responseReturn(res, 500, { message: 'Erreur interne du serveur' });
  }
};
