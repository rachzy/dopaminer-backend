import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const extension = path.parse(file.originalname).ext;

      if (
        extension !== '.png' &&
        extension !== '.jpg' &&
        extension !== '.jpeg' &&
        extension !== '.gif' &&
        extension !== '.svg' &&
        extension !== '.webm'
      ) {
        return cb(new UnsupportedMediaTypeException('Invalid file type'), null);
      }

      if (file.size > 10000000) {
        return cb(
          new UnsupportedMediaTypeException('File size is too large'),
          null,
        );
      }

      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '').slice(0, 10) +
        '-' +
        uuidv4();
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export default multerConfig;
