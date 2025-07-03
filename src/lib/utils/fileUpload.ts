import formidable from 'formidable';
import { NextApiRequest } from 'next';

export interface ParsedForm {
  fields: { [key: string]: string | string[] };
  files: { [key: string]: formidable.File | formidable.File[] };
}

export const parseForm = async (req: NextApiRequest): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export const fileToUploadFormat = (file: formidable.File) => {
  return {
    buffer: Buffer.from(''), // Placeholder - implement file reading
    originalname: file.originalFilename || '',
    mimetype: file.mimetype || '',
    size: file.size,
  };
};
