const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /escolas - lista todas as escolas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instalacoes_escolares ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar escolas:', error);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
});

// GET /escolas/:id - busca escola por id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM instalacoes_escolares WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar escola:', error);
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
});

// POST /escolas - cria uma nova escola
router.post('/', async (req, res) => {
  const { nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO instalacoes_escolares
       (nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar escola:', error);
    res.status(500).json({ error: 'Erro ao criar escola', details: error.message });
  }
});

// PUT /escolas/:id - atualiza uma escola
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE instalacoes_escolares SET
        nome_escola = $1,
        diretoria_ensino = $2,
        municipio = $3,
        codigo_escola = $4,
        total_salas_aula = $5,
        refeitorio = $6
      WHERE id = $7 RETURNING *`,
      [nome_escola, diretoria_ensino, municipio, codigo_escola, total_salas_aula, refeitorio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Escola não encontrada para atualizar' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar escola:', error);
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
});

// DELETE /escolas/:id - deleta uma escola
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM instalacoes_escolares WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Escola não encontrada para deletar' });
    }
    res.json({ message: 'Escola deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar escola:', error);
    res.status(500).json({ error: 'Erro ao deletar escola' });
  }
});

module.exports = router;
