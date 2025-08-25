import formidable from 'formidable';
import { NextApiRequest } from 'next';

export interface ParsedForm {
  fields: { [key: string]: string | string[] };
  files: { [key: string]: formidable.File | formidable.File[] };
}
export const parseForm = async (req: NextApiRequest): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, 
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

    
      const cleanedFields: { [key: string]: string | string[] } = {};
      for (const key in fields) {
        const value = fields[key];
        if (value !== undefined) {
          cleanedFields[key] = value;
        }
      }

   
      const cleanedFiles: { [key: string]: formidable.File | formidable.File[] } = {};
      for (const key in files) {
        const value = files[key];
        if (value !== undefined) {
          cleanedFiles[key] = value;
        }
      }

      resolve({ fields: cleanedFields, files: cleanedFiles });
    });
  });
};



export const fileToUploadFormat = (file: formidable.File) => {
  return {
    buffer: Buffer.from(''), 
    originalname: file.originalFilename || '',
    mimetype: file.mimetype || '',
    size: file.size,
  };
};
