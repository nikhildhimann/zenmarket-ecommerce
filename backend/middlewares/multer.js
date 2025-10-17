import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

// --- THIS IS THE FIX ---
// Calculate the absolute path to the 'Backend' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up one level from 'middlewares' and then into 'public/temp'
const uploadPath = path.join(__dirname, '..', 'public', 'temp');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use the absolute path we calculated
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});