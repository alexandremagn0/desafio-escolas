const { z } = require('zod');

const schoolUpdateSchema = z.object({
  school_name: z.string().min(1, 'Nome da escola é obrigatório').optional(),
  school_code: z.string().min(1, 'Código da escola é obrigatório').optional(),
  municipality: z.string().min(1, 'Município é obrigatório').optional(),
  teaching_directorate: z.string().min(1, 'Diretoria de ensino é obrigatória').optional(),
  total_classrooms: z.number({ invalid_type_error: 'Total de salas deve ser um número' }).int().nonnegative().optional(),
  cafeteria: z.boolean().optional()
});

module.exports = schoolUpdateSchema; 