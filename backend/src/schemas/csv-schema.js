const { z } = require('zod');

const csvRowSchema = z.object({
  NOMESC: z.string().min(1, 'Nome da escola é obrigatório').trim(),
  DE: z.string().min(1, 'Diretoria de ensino é obrigatória').trim(),
  MUN: z.string().min(1, 'Município é obrigatório').trim(),
  CODESC: z.string().min(1, 'Código da escola é obrigatório').trim(),
  TOT_SALAS_AULA: z.string()
    .min(1, 'Total de salas é obrigatório')
    .transform((val) => {
      const num = parseInt(val);
      if (isNaN(num) || num < 0) {
        throw new Error('Total de salas deve ser um número válido (maior ou igual a zero)');
      }
      return num;
    }),
  REFEITORIO: z.string()
    .optional()
    .transform((val) => val === '1')
    .default(false)
});

const csvFileSchema = z.object({
  rows: z.array(csvRowSchema).min(1, 'Arquivo deve conter pelo menos uma linha válida'),
  errors: z.array(z.string()).default([])
});

const csvValidationResult = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  validRows: z.number(),
  totalRows: z.number()
});

module.exports = {
  csvRowSchema,
  csvFileSchema,
  csvValidationResult
}; 