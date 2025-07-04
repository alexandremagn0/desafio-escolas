const EscolaRepository = require('../repositories/EscolaRepository');
const EscolaService = require('../services/EscolaService');

// Container de dependências
class Container {
  constructor() {
    this.dependencies = new Map();
    this.setupDependencies();
  }

  setupDependencies() {
    // Registrar repositórios
    this.dependencies.set('EscolaRepository', new EscolaRepository());
    
    // Registrar serviços com suas dependências
    this.dependencies.set('EscolaService', new EscolaService(
      this.dependencies.get('EscolaRepository')
    ));
  }

  get(key) {
    return this.dependencies.get(key);
  }
}

module.exports = new Container(); 