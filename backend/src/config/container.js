const EscolaRepository = require('../repositories/EscolaRepository');
const EscolaService = require('../services/EscolaService');

class Container {
  constructor() {
    this.dependencies = new Map();
    this.setupDependencies();
  }

  setupDependencies() {
    this.dependencies.set('EscolaRepository', new EscolaRepository());
    
    this.dependencies.set('EscolaService', new EscolaService(
      this.dependencies.get('EscolaRepository')
    ));
  }

  get(key) {
    return this.dependencies.get(key);
  }
}

module.exports = new Container(); 