import { Schema, model } from 'mongoose';


const contactMessageSchema = new Schema({
  firstName: { 
    type: String, 
    required: true 
    },
  name: { 
    type: String, 
    required: true
   },
  email: { 
    type: String, 
    required: true 
   },
  telephone: { 
    type: String, required: 
    true 
  },
  subject: { 
    type: String, 
    required: true 
   },
  message: { type: String, required: true },
}, { timestamps: true });



const contactMessageModel = model('ContactMessages', contactMessageSchema );
export default contactMessageModel;
