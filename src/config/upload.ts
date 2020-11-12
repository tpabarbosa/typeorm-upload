import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

// import AppError from '../errors/AppError';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(_request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  /*
  fileFilter(_request, file, callback): unknown {
    if (file.mimetype === 'text/csv') {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new AppError('Only .csv format allowed!', 400), false);
    }
    return null;
  },
  */
};
