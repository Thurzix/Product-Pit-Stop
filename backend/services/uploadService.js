const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar multer para armazenamento temporário local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Middleware multer para upload de vídeos
const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/x-msvideo', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use MP4, MOV, AVI ou WebM.'), false);
    }
  }
});

// Middleware multer para upload de imagens
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.'), false);
    }
  }
});

// Função para fazer upload para Cloudinary
const uploadToCloudinary = async (filePath, resourceType = 'image', folder = 'product-pitstop') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: `${folder}/${resourceType}s`,
      quality: 'auto',
      fetch_format: 'auto',
    });

    // Deletar arquivo temporário
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    // Deletar arquivo temporário mesmo em caso de erro
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Função para deletar arquivo do Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Erro ao deletar arquivo do Cloudinary:', error);
    throw error;
  }
};

// Função para extrair public_id da URL do Cloudinary
const extractPublicId = (url) => {
  if (!url) return null;
  
  // Exemplo: https://res.cloudinary.com/cloud_name/video/upload/v123456789/folder/filename.mp4
  const matches = url.match(/\/v\d+\/(.+)\./);
  return matches ? matches[1] : null;
};

// Função para gerar thumbnail de vídeo
const generateVideoThumbnail = (videoPublicId) => {
  return cloudinary.url(videoPublicId, {
    resource_type: 'video',
    transformation: [
      { width: 300, height: 200, crop: 'fill' },
      { quality: 'auto' },
      { format: 'jpg' }
    ]
  });
};

module.exports = {
  cloudinary,
  uploadVideo,
  uploadImage,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  generateVideoThumbnail
};