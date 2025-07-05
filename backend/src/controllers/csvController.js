const csvService = require('../services/CsvService');

const uploadCsv = async (req, res) => {
  try {
    await csvService.validarArquivo(req.file);

    const resultado = await csvService.processarCsv(req.file.path);

    await csvService.limparArquivoTemporario(req.file.path);

    res.json({ 
      message: 'CSV importado com sucesso!', 
      total: resultado.total 
    });

  } catch (error) {
    if (req.file) {
      await csvService.limparArquivoTemporario(req.file.path);
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
