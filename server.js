import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config'; // Charge les variables d'environnement en haut du fichier
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { dbConnect } from './utiles/db.js';

// Importer les routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import categoryRoutes from './routes/dashboardRoutes/categoryRoutes.js';
import productRoutes from './routes/dashboardRoutes/productRoutes.js';
import sellerRoutes from './routes/dashboardRoutes/sellerRoutes.js';
import authHomeRoutes from './routes/homeRoutes/authHomeRoutes.js';
import cardRoutes from './routes/homeRoutes/cardRoutes.js';
import homeRoutes from './routes/homeRoutes/homeRoutes.js';
import orderRoutes from './routes/ordersRouters/orderRoutes.js';

const app = express();
const appServer = http.createServer(app);

// Initialiser Socket.io avec appServer
const io = new Server(appServer, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

let allCustomers = []; // users online
let allSellers = []; // users online

const addUser = (customerId,socketId,customerInfo) => {
    const customerExists = allCustomers.some((customer) => customer.customerId === customerId);
    if (!customerExists) {
        allCustomers.push({
            customerId,
            socketId,
            customerInfo,
        });
    }
   // console.log(allCustomers);
};

const addSeller = (sellerId,socketId,userInfo) => {
    const sellerExists = allSellers.some((seller) => seller.sellerId === sellerId );
    if (!sellerExists) {
        allSellers.push({
            sellerId,
            socketId,
            userInfo,
        })
    }
}

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
    console.log('Client Socket connecté');
    // Ajout d'un utilisateur
    socket.on('add_customer', (customerId, customerInfo) => {
       // console.log(customerId, customerInfo);
       addUser(customerId, socket.id, customerInfo);
    });

    // Ajout d'un vendeur
    socket.on('add_seller', (sellerId, userInfo) => {
        //console.log(sellerId, userInfo);
        addSeller(sellerId, socket.id, userInfo);
     });

    // Déconnexion
    socket.on('disconnect', () => {
        console.log('Client Socket déconnecté');
    });
});

const port = process.env.PORT || 8080;
const allowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URL2];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Autoriser la requête
        } else {
            callback(new Error('Not allowed by CORS')); // Rejeter la requête
        }
    },
    credentials: true, // Autoriser les credentials
}));

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
app.use('/api/chat', chatRoutes);
app.use('/api', authHomeRoutes);
app.use('/api', cardRoutes);
app.use('/api', orderRoutes);

// Route d'accueil
app.get('/', (req, res) => res.send('Hello, world!'));

// Connecter à la base de données et démarrer le serveur
dbConnect().then(() => {
    appServer.listen(port, () => console.log(`Server is running on port ${port}!`));
}).catch((error) => {
    console.error("Erreur lors de la connexion à la base de données :", error);
});
