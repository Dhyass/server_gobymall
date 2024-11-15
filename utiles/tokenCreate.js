//const jwt = require('jsonwebtoken');

import jwt from 'jsonwebtoken';

export const createToken = async(data) =>{
    
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "21d" });

    return token
}
