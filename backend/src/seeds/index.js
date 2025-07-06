const createAdminUser = require('./create-admin-user');

const seeds = [
  {
    name: 'Admin User',
    function: createAdminUser,
    description: 'Cria o usuário administrador padrão'
  }
];

const runAllSeeds = async () => {
  console.log('Iniciando execução de todos os seeds...');
  
  for (const seed of seeds) {
    try {
      console.log(`\nExecutando: ${seed.name}`);
      console.log(`${seed.description}`);
      
      await seed.function();
      
      console.log(`${seed.name} executado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao executar ${seed.name}:`, error);
    }
  }
  
  console.log('\n Execução de seeds concluída!');
};

const runSeed = async (seedName) => {
  const seed = seeds.find(s => s.name.toLowerCase().includes(seedName.toLowerCase()));
  
  if (!seed) {
    console.error(`Seed "${seedName}" não encontrado. Seeds disponíveis:`);
    seeds.forEach(s => console.log(`  - ${s.name}`));
    return;
  }
  
  try {
    console.log(`Executando: ${seed.name}`);
    console.log(`${seed.description}`);
    
    await seed.function();
    
    console.log(`${seed.name} executado com sucesso!`);
  } catch (error) {
    console.error(`Erro ao executar ${seed.name}:`, error);
  }
};

if (require.main === module) {
  const { initializeDatabase } = require('../config/database');
  
  const seedName = process.argv[2];
  
  initializeDatabase()
    .then(async () => {
      if (seedName) {
        await runSeed(seedName);
      } else {
        await runAllSeeds();
      }
      
      console.log('Seeds executados com sucesso!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erro ao executar seeds:', err);
      process.exit(1);
    });
}

module.exports = {
  runAllSeeds,
  runSeed,
  seeds
}; 