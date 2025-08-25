import formidable from 'formidable';
import { NextApiRequest } from 'next';
import { promises as fs } from 'fs';

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
      if (err) return reject(err);

      // Limpiar fields (sin undefined)
      const cleanedFields: { [key: string]: string | string[] } = {};
      for (const key in fields) {
        const value = fields[key];
        if (value !== undefined) {
          cleanedFields[key] = value;
        }
      }

      // Limpiar files (sin undefined)
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

export const fileToUploadFormat = async (file: formidable.File) => {
  const buffer = await fs.readFile(file.filepath);

  return {
    buffer,
    originalname: file.originalFilename || '',
    mimetype: file.mimetype || '',
    size: file.size,
  };
};