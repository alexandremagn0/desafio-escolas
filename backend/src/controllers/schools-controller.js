const SchoolService = require('../services/school-service');

class SchoolsController {
  constructor() {
    this.schoolService = new SchoolService();
  }

  async list(req, res) {
    try {
      const schools = await this.schoolService.list();
      res.json(schools);
    } catch (error) {
      console.error('Erro ao listar escolas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const school = await this.schoolService.findById(id);
      
      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Erro ao buscar escola:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req, res) {
    try {
      const school = await this.schoolService.create(req.body);
      res.status(201).json(school);
    } catch (error) {
      console.error('Erro ao criar escola:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const school = await this.schoolService.update(id, req.body);
      
      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Erro ao atualizar escola:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.schoolService.delete(id);
      res.json(result);
    } catch (error) {
      console.error('Erro ao deletar escola:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SchoolsController; 