const csvService = require('../services/CsvService');

const uploadCsv = async (req, res) => {
  try {
    await csvService.validateFile(req.file);

    const result = await csvService.processCsv(req.file.path);

    await csvService.cleanTemporaryFile(req.file.path);

    res.json({ 
      message: 'CSV importado com sucesso!', 
      total: result.total 
    });

  } catch (error) {
    if (req.file) {
      await csvService.cleanTemporaryFile(req.file.path);
    }

    console.error('Erro ao importar CSV:', error);
    
    if (error.message === 'Arquivo CSV é obrigatório.' || error.message === 'Arquivo deve ser do tipo CSV.') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ 
      error: 'Erro ao importar dados.',
      details: error.message 
    });
  }
};

module.exports = { uploadCsv };
