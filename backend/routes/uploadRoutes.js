const express = require('express');
const { uploadVideo, uploadImage, uploadToCloudinary, generateVideoThumbnail } = require('../services/uploadService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rota para upload de vídeo - POST /api/upload/video
router.post('/video', authenticateToken, uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo de vídeo foi enviado'
      });
    }

    console.log('Fazendo upload do vídeo para Cloudinary...');
    
    // Fazer upload para Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'video');
    
    // Gerar thumbnail do vídeo
    const thumbnailUrl = generateVideoThumbnail(result.public_id);
    
    res.json({
      success: true,
      message: 'Vídeo enviado com sucesso',
      data: {
        video_url: result.secure_url,
        thumbnail_url: thumbnailUrl,
        public_id: result.public_id,
        duration: result.duration,
        format: result.format,
        resource_type: result.resource_type
      }
    });

  } catch (error) {
    console.error('Erro no upload de vídeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no upload do vídeo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para upload de imagem - POST /api/upload/image
router.post('/image', authenticateToken, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo de imagem foi enviado'
      });
    }

    console.log('Fazendo upload da imagem para Cloudinary...');
    
    // Fazer upload para Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'image');
    
    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        image_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type
      }
    });

  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no upload da imagem',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para upload combinado (vídeo + thumbnail personalizado) - POST /api/upload/product
router.post('/product', authenticateToken, (req, res) => {
  // Usar multer para múltiplos arquivos
  const upload = require('multer')({
    storage: require('multer').diskStorage({
      destination: function (req, file, cb) {
        const fs = require('fs');
        const path = require('path');
        const uploadDir = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const path = require('path');
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    }),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
    }
  }).fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]);

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Erro no upload dos arquivos',
        error: err.message
      });
    }

    try {
      const results = {};

      // Upload do vídeo (obrigatório)
      if (req.files.video && req.files.video[0]) {
        const videoResult = await uploadToCloudinary(req.files.video[0].path, 'video');
        results.video = {
          url: videoResult.secure_url,
          public_id: videoResult.public_id,
          duration: videoResult.duration
        };

        // Se não houver thumbnail personalizado, gerar um do vídeo
        if (!req.files.thumbnail) {
          results.thumbnail = {
            url: generateVideoThumbnail(videoResult.public_id),
            generated: true
          };
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Vídeo é obrigatório'
        });
      }

      // Upload do thumbnail personalizado (opcional)
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0].path, 'image');
        results.thumbnail = {
          url: thumbnailResult.secure_url,
          public_id: thumbnailResult.public_id,
          generated: false
        };
      }

      res.json({
        success: true,
        message: 'Arquivos enviados com sucesso',
        data: results
      });

    } catch (error) {
      console.error('Erro no upload dos arquivos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro no upload dos arquivos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

module.exports = router;