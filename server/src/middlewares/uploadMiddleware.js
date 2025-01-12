import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Use import.meta.url to get the correct path of the current file and resolve to the correct directory
const uploadDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
