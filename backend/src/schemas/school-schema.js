const { z } = require('zod');

const schoolSchema = z.object({
  school_name: z.string().min(1, 'Nome da escola é obrigatório'),
  school_code: z.string().min(1, 'Código da escola é obrigatório'),
  municipality: z.string().min(1, 'Município é obrigatório'),
  teaching_directorate: z.string().min(1, 'Diretoria de ensino é obrigatória'),
  total_classrooms: z.number({ invalid_type_error: 'Total de salas deve ser um número' }).int().nonnegative(),
  cafeteria: z.boolean()
});

module.exports = schoolSchema; 