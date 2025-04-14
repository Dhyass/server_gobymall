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
import bannerRoutes from './routes/dashboardRoutes/bannerRoutes.js';
import categoryRoutes from './routes/dashboardRoutes/categoryRoutes.js';
import dashboardIndexRoutes from './routes/dashboardRoutes/dashboardIndexRoutes.js';
import productRoutes from './routes/dashboardRoutes/productRoutes.js';
import sellerRoutes from './routes/dashboardRoutes/sellerRoutes.js';
import authHomeRoutes from './routes/homeRoutes/authHomeRoutes.js';
import cardRoutes from './routes/homeRoutes/cardRoutes.js';
import homeRoutes from './routes/homeRoutes/homeRoutes.js';
import orderRoutes from './routes/ordersRouters/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes/paymentRoutes.js';

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
let allAdmins = []; // users online

const addUser = (customerId,socketId,customerInfo) => {
    const customerExists = allCustomers.some((customer) => customer.customerId === customerId);
    if (!customerExists) {
        allCustomers.push({
            customerId,
            socketId,
            customerInfo,
        });
    }
   //console.log('all Customers', allCustomers);
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
   // console.log('all Sellers', allSellers);
};
const addAdmin = (adminId,socketId,userInfo) => {
    const adminExists = allAdmins.some((admin) => admin.adminId === adminId);
    if (!adminExists) {
        allAdmins.push({
            adminId,
            socketId,
            userInfo,
        })
    }
   // console.log('all Admins', allAdmins);
}

const findCustomer = (customerId) =>{
    return allCustomers.find((customer) => customer.customerId === customerId);
}

const findSeller = (sellerId) => {
    return allSellers.find((seller) => seller.sellerId.sellerId === sellerId);
}

const remove = (socketId) => {
    allCustomers = allCustomers.filter((customer) => customer.socketId !== socketId);
    allSellers = allSellers.filter((seller) => seller.socketId !== socketId);
}

let admin = {}

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {}
    }
}


// Gestion des connexions Socket.io
io.on('connection', (socket) => {
    console.log('Client Socket connecté');
    // Ajout d'un utilisateur
    socket.on('add_customer', (customerId, customerInfo) => {
      // console.log(customerId, customerInfo);
       addUser(customerId, socket.id, customerInfo);
       io.emit('activeCustomer', allCustomers);
       io.emit('activeSeller', allSellers);
    });

    // Ajout d'un vendeur
    socket.on('add_seller', (sellerId, userInfo) => {
        //console.log(sellerId, userInfo);
        addSeller(sellerId, socket.id, userInfo);
        io.emit('activeSeller', allSellers);
        io.emit('activeCustomer', allCustomers);
        io.emit('ActiveAdmin', {status : true});
     });
     // ajout d'un adminstrateur 
     socket.on('add_admin', (adminInfo) => {
        //console.log(adminId, adminInfo);
        delete adminInfo.email
        admin = adminInfo
        admin.socketId = socket.id
        io.emit('activeSeller', allSellers);
        io.emit('ActiveAdmin', {status : true});
     })

    socket.on('send_message_to_Customer',(message)=>{
        //console.log('message coté serveur  ',message);
        //console.log('customer id  ',message.receiverId);
        const customer = findCustomer(message.receiverId);
        //console.log('cusytomer ',customer);
        if(customer !== undefined){
           // console.log('message coté serveur  ',message);
           console.log(' ');
            socket.to(customer.socketId).emit('receive_seller_message',message);
        }
    });

    socket.on('send_message_to_seller',(message)=>{
        //console.log('message coté serveur  ',message);
      //  console.log('seller id  ',message.receiverId);
       const seller = findSeller(message.receiverId);
       // console.log('seller  ',seller );
        if(seller !== undefined){
           // console.log('message coté serveur  ',message);
           console.log(' ');
            socket.to(seller.socketId).emit('receive_customer_message',message);
        }
    });

    socket.on('send_message_admin_to_seller',(message) => {
        //console.log('message envoyé au vendeur  ', message);
        //console.log('seller id  ',message.receiverId);
        const seller = findSeller(message.receiverId);
       // console.log('seller  ',seller );
        if(seller !== undefined){
           // console.log('message coté serveur  ',message);
           console.log(' ');
            socket.to(seller.socketId).emit('receive_admin_message',message);
        }
    })

    socket.on('send_message_seller_to_admin',(message) => {
        if (admin.socketId) {
            socket.to(admin.socketId).emit('receive_seller_message', message);
        }
    })



    // Déconnexion
    socket.on('disconnect', () => {
        console.log('Client Socket déconnecté');
        remove(socket.id);
        removeAdmin (socket.id);
        io.emit('ActiveAdmin', {status : false});
        io.emit('activeSeller', allSellers);
        io.emit('activeCustomer', allCustomers);
    });
});

const port = process.env.PORT;
const allowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URL2];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            
            callback(null, true); // Autoriser la requête
        } else {
            callback(new Error('Not allowed by CORS')); // Rejeter la requête
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
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
app.use('/api/seller', sellerRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', authHomeRoutes);
app.use('/api', cardRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardIndexRoutes)
app.use('/api', bannerRoutes);

// Route d'accueil
app.get('/', (req, res) => res.send(
    'Hello, world!',
    process.env.CLIENT_URL,
    process.env.CLIENT_URL2
));


// Connecter à la base de données et démarrer le serveur
dbConnect().then(() => {
    appServer.listen(port, () => console.log(`Server is running on port ${port}!`));
}).catch((error) => {
    console.error("Erreur lors de la connexion à la base de données :", error);
});
