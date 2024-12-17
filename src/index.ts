import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getEntityTemplate, getMongooseSchemaTemplate, getMongoRepositoryTemplate, getRepositoryInterfaceTemplate } from './template_code/index';
import { writeController, writeCreateDto, writeCreateUseCase, writeEntity, writeInterfaces, writeModel, writeMongoRepository, writeRouter } from './actions';




const program = new Command();

program
  .name('node-ts-clean-architecture-cli')
  .description('Node.js + Express + TypeScript Clean Architecture CLI')
  .version('1.0.0');
// `add module` komutu için
program
  .command('add')
  .argument('<modulename>', 'modulename')
  .argument('<types>', 'types')
  .option('-p, --path <path>', '../../node-ts-clean-architecture-api/src')
  .description('Create a new module')
  .action((modulename, types, options) => {

    if (!modulename) {
      console.error('Module name is required');
      return;
    }
    if (!types) {
      console.error('Entity  is required');
      return;
    }
    if (!options.path) {
      console.error('Path is required');
      return;
    }

    const TypeData = JSON.parse(types);
    const basePath = path.join(__dirname, options.path);

    console.log('Creating module...');
    console.log(`Module name: ${modulename}`);
    console.log(`Path : ${basePath}`);



    writeEntity(modulename, TypeData, basePath);
    console.log(`${modulename} entity created successfully!`);
    writeCreateDto(modulename, TypeData, basePath);
    console.log(`${modulename} create dto created successfully!`);
    writeInterfaces(modulename, basePath);
    console.log(`${modulename} repository created successfully!`);
    writeModel(modulename, TypeData, basePath);
    console.log(`${modulename} model created successfully!`);
    writeMongoRepository(modulename, basePath);
    console.log(`${modulename} mongo repository created successfully!`);
    writeRouter(modulename, basePath);
    console.log(`${modulename} router created successfully!`);
    writeController(modulename, basePath);
    console.log(`${modulename} controller created successfully!`);
    writeCreateUseCase(modulename, TypeData, basePath);
    console.log(`${modulename} create use case created successfully!`);

    console.log('Module created successfully!');



  });


program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });
// CLI'yi başlat
program.parse();
