import express from 'express';
import multer from 'multer';
import path from 'path';

import { add_product_video, get_product_video, get_videos, update_product_video } from '../../controllers/dashboardControllers/videoController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/* -----------------------------
      MULTER CONFIG (VIDÉOS)
------------------------------ */

// Stockage temporaire sur disque
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrer uniquement les vidéos
const videoFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm', 'video/ogg'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seules les vidéos mp4, webm, ogg sont autorisées"), false);
  }
};

// Multer instance
const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

/* -----------------------------
            ROUTES VIDÉO
------------------------------ */

router.post('/video/add_product_video', authMiddleware, uploadVideo.single('video'),add_product_video);

router.get(
  '/video/get_product_video/:productId',
  authMiddleware,
  get_product_video
);

router.put(
  '/video/update_product_video/:videoId',
  authMiddleware,
  uploadVideo.single('video'),
  update_product_video
);

router.delete('/video/get_videos',
  authMiddleware,
  get_videos
);

export default router;
