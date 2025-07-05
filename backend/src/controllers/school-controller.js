const container = require('../config/container');

const listSchools = async (req, res) => {
  try {
    const schoolService = container.getSchoolService();
    const schools = await schoolService.list();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolService = container.getSchoolService();
    const school = await schoolService.findById(id);
    res.json(school);
  } catch (error) {
    if (error.message === 'Escola não encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const createSchool = async (req, res) => {
  try {
    const schoolService = container.getSchoolService();
    const school = await schoolService.create(req.body);
    res.status(201).json(school);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolService = container.getSchoolService();
    const school = await schoolService.update(id, req.body);
    res.json(school);
  } catch (error) {
    if (error.message === 'Escola não encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolService = container.getSchoolService();
    await schoolService.delete(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Escola não encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  listSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool
};
