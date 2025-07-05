const container = require('../config/container');

const listSchools = async (req, res) => {
  try {
    const escolaService = container.get('EscolaService');
    const schools = await escolaService.listSchools();
    res.json(schools);
  } catch (error) {
    console.error('Erro ao buscar escolas:', error);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};

const findSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    const school = await escolaService.findSchool(id);
    res.json(school);
  } catch (error) {
    if (error.message === 'Escola não encontrada') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao buscar escola:', error);
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
};

const createSchool = async (req, res) => {
  try {
    const escolaService = container.get('EscolaService');
    const school = await escolaService.createSchool(req.body);
    res.status(201).json(school);
  } catch (error) {
    console.error('Erro ao criar escola:', error);
    res.status(500).json({ error: 'Erro ao criar escola', details: error.message });
  }
};

const updateSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    const school = await escolaService.updateSchool(id, req.body);
    res.json(school);
  } catch (error) {
    if (error.message === 'Escola não encontrada para atualizar') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar escola:', error);
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
};

const deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const escolaService = container.get('EscolaService');
    await escolaService.deleteSchool(id);
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
  listSchools,
  findSchool,
  createSchool,
  updateSchool,
  deleteSchool
};
