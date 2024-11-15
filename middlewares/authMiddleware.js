import jwt from 'jsonwebtoken';
import { responseReturn } from '../utiles/response.js';

export const authMiddleware = async (req, res, next) => {
    // Retrieve token from Authorization header or cookies
    let token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'null') {
        // Fallback to cookie if token from Authorization header is missing or null
        token = req.cookies.AccessToken;
    }

   //console.log("Authorization Header:", req.headers.authorization);
   //console.log("Cookies:", req.cookies);
    //console.log("Token:", token); // This should now have a valid token from either source

    if (!token) {
        return  responseReturn(res, 401, { message: 'Please login first.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.role = decodedToken.role;
        req.id = decodedToken.id;
        //console.log("User ID:", req.id, "Role:", req.role); // Confirming decoded values
        req.user = {
            id: decodedToken.id,
            role: decodedToken.role
        };
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return responseReturn(res, 401, { message: 'Invalid or expired token. Please login again.' });
    }
};


