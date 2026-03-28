import { z } from 'zod';

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const fileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
    message: `File harus berupa: ${ALLOWED_FILE_TYPES.join(', ')}`,
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `Ukuran file maksimal 10MB`,
  });