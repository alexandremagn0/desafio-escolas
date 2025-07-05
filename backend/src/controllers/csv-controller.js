const CsvService = require('../services/csv-service');
const multer = require('multer');
const path = require('path');

class CsvController {
  constructor() {
    this.csvService = new CsvService();
  }

  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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

      const result = await this.csvService.processCsvFile(req.file.path);
      
      // Limpar arquivo temporário
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      
      res.json(result);
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
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
