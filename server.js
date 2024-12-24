import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config'; // Charge les variables d'environnement en haut du fichier
import express from 'express';
import { dbConnect } from './utiles/db.js';

// importer les routes 
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/dashboardRoutes/categoryRoutes.js';
import productRoutes from './routes/dashboardRoutes/productRoutes.js';
import sellerRoutes from './routes/dashboardRoutes/sellerRoutes.js';
import authHomeRoutes from './routes/homeRoutes/authHomeRoutes.js';
import cardRoutes from './routes/homeRoutes/cardRoutes.js';
import homeRoutes from './routes/homeRoutes/homeRoutes.js';
import orderRoutes from './routes/ordersRouters/orderRoutes.js';

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URL2];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
    credentials: true, // Allow credentials
}));


// Configuration CORS
//app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
//app.use(cors({ origin: process.env.CLIENT_URL2, credentials: true }));

// Middleware pour parser JSON et les cookies
app.use(express.json()); // Remplace body-parser pour les JSON
app.use(express.urlencoded({ extended: true })); // Remplace body-parser pour les données URL encodées
app.use(cookieParser());

// Importer et utiliser les routes d'authentification
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', sellerRoutes);
app.use('/api/home', homeRoutes);
app.use('/api', authHomeRoutes);
app.use('/api', cardRoutes);
app.use('/api', orderRoutes);

// Route d'accueil
app.get('/', (req, res) => res.send('Hello, world!'));

// Connecter à la base de données et démarrer le serveur
dbConnect().then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}!`));
}).catch((error) => {
    console.error("Erreur lors de la connexion à la base de données :", error);
});
