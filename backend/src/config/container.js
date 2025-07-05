const SchoolRepository = require('../repositories/school-repository');
const SchoolService = require('../services/school-service');
const AuthService = require('../services/auth-service');
const CsvService = require('../services/csv-service');

class Container {
  constructor() {
    this.dependencies = new Map();
    this.initializeDependencies();
  }

  initializeDependencies() {
    this.dependencies.set('SchoolRepository', new SchoolRepository());
    this.dependencies.set('SchoolService', new SchoolService(this.dependencies.get('SchoolRepository')));
    this.dependencies.set('AuthService', new AuthService());
    this.dependencies.set('CsvService', new CsvService());
  }

  getSchoolRepository() {
    return this.dependencies.get('SchoolRepository');
  }

  getSchoolService() {
    return this.dependencies.get('SchoolService');
  }

  getAuthService() {
    return this.dependencies.get('AuthService');
  }

  getCsvService() {
    return this.dependencies.get('CsvService');
  }
}

module.exports = new Container(); 