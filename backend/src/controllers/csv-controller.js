const CsvService = require('../services/csv-service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

class CsvController {
  constructor() {
    this.csvService = new CsvService();
  }

  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        // Usa o diretório temporário do sistema
        const tempDir = os.tmpdir();
        const uploadsDir = path.join(tempDir, 'csv-uploads');
        
        // Garante que a pasta existe
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        // Gera nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `csv-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
      } else {
        cb(new Error('Apenas arquivos CSV são permitidos'), false);
      }
    }
  });

  async uploadCsv(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      console.log('Processando arquivo:', req.file.originalname);
      console.log('Caminho temporário:', req.file.path);

      const result = await this.csvService.processCsvFile(req.file.path);
      
      // Limpar arquivo temporário
      try {
        fs.unlinkSync(req.file.path);
        console.log('Arquivo temporário removido:', req.file.path);
      } catch (cleanupError) {
        console.warn('Erro ao remover arquivo temporário:', cleanupError.message);
        // Não falha o upload se não conseguir limpar o arquivo
      }
      
      res.json(result);
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      
      // Tenta limpar o arquivo mesmo em caso de erro
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.warn('Erro ao limpar arquivo após erro:', cleanupError.message);
        }
      }
      
      if (error.message && (
        error.message.includes('formato incompatível') ||
        error.message.includes('campos obrigatórios') ||
        error.message.includes('Nenhum registro válido') ||
        error.message.includes('formato correto')
      )) {
        return res.status(422).json({ 
          error: error.message,
          type: 'validation_error'
        });
      }
      
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        type: 'internal_error'
      });
    }
  }

  async getSchoolsCount(req, res) {
    try {
      const count = await this.csvService.getSchoolsCount();
      res.json({ count });
    } catch (error) {
      console.error('Erro ao obter contagem de escolas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = CsvController;
