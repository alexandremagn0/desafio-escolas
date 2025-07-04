const { z } = require('zod');

const escolaSchema = z.object({
  nome_escola: z.string().min(1, 'Nome da escola é obrigatório'),
  codigo_escola: z.string().min(1, 'Código da escola é obrigatório'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  diretoria_ensino: z.string().min(1, 'Diretoria de ensino é obrigatória'),
  total_salas_aula: z.number({ invalid_type_error: 'Total de salas deve ser um número' }).int().nonnegative(),
  refeitorio: z.boolean()
});

module.exports = escolaSchema; 