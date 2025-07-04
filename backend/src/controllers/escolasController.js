const container = require('../config/container');

const listarEscolas = async (req, res) => {
  try {
    const escolaService = container.get('EscolaService');
    const escolas = await escolaService.listarEscolas();
    res.json(escolas);
  } catch (error) {
    console.error('Erro ao buscar escolas:', error);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

const buscarEscola = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    const escola = await escolaService.buscarEscola(id);
    res.json(escola);
  } catch (error) {
    if (error.message === 'Escola não encontrada') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao buscar escola:', error);
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
};

const criarEscola = async (req, res) => {
  try {
    const escolaService = container.get('EscolaService');
    const escola = await escolaService.criarEscola(req.body);
    res.status(201).json(escola);
  } catch (error) {
    console.error('Erro ao criar escola:', error);
    res.status(500).json({ error: 'Erro ao criar escola', details: error.message });
  }
};

const atualizarEscola = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    const escola = await escolaService.atualizarEscola(id, req.body);
    res.json(escola);
  } catch (error) {
    if (error.message === 'Escola não encontrada para atualizar') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar escola:', error);
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
};

const deletarEscola = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    await escolaService.deletarEscola(id);
    res.json({ message: 'Escola deletada com sucesso' });
  } catch (error) {
    if (error.message === 'Escola não encontrada para deletar') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao deletar escola:', error);
    res.status(500).json({ error: 'Erro ao deletar escola' });
  }
};

module.exports = {
  listarEscolas,
  buscarEscola,
  criarEscola,
  atualizarEscola,
  deletarEscola
};
