const { z } = require('zod');

const escolaUpdateSchema = z.object({
  nome_escola: z.string().min(1, 'Nome da escola é obrigatório').optional(),
  codigo_escola: z.string().min(1, 'Código da escola é obrigatório').optional(),
  municipio: z.string().min(1, 'Município é obrigatório').optional(),
  diretoria_ensino: z.string().min(1, 'Diretoria de ensino é obrigatória').optional(),
  total_salas_aula: z.number({ invalid_type_error: 'Total de salas deve ser um número' }).int().nonnegative().optional(),
  refeitorio: z.boolean().optional()
});

module.exports = escolaUpdateSchema; 