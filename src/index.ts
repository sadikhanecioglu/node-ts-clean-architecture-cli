import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getEntityTemplate, getMongooseSchemaTemplate, getMongoRepositoryTemplate, getRepositoryInterfaceTemplate } from './template_code/index';
import { writeController, writeCreateDto, writeCreateUseCase, writeEntity, writeFiles, writeInterfaces, writeModel, writeMongoRepository, writeRouter } from './actions';
import Gemini from './llm/gemini';
import { getAllFiles } from './utility/getAllFiles';
import * as dotenv from 'dotenv';

dotenv.config();

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
  .option('-ai, --ai <ai>', 'Use AI to generate code', 'gemini')
  .option('-test, --test')
  .description('Create a new module')
  .action(async (modulename, types, options) => {

    if (!modulename) {
      console.error('Module name is required');
      return;
    }
    if (!types) {
      console.error('Entity  is required');
      return;
    }
    if (!options.path) {
      // console.error('Path is required');
      // return;
      options.path = '../../node-ts-clean-architecture-api/src'
    }
    const basePath = path.join(__dirname, options.path);
    console.log(`Module name: ${modulename}`);
    console.log(`Path : ${basePath}`);

    if (options.ai === 'gemini') {


      const allfiles = await getAllFiles({
        basePath: basePath+'/src',
        options: {}
      });

      console.log('allfiles', allfiles);


      const input = `
        Generate code for a new module named ${modulename}. The entity has the following fields: ${types}. 
        Use the folder structure and templates provided. 

        Additionally, here is the list of existing files in the project structure:
        ${JSON.stringify(allfiles, null, 2)}

        Ensure the generated code does not conflict with existing files and integrates seamlessly into the current architecture.

        Output the result as a JSON array where each object has the following format:
        {
          "content": "<Generated code here>",
          "path": "<Path of the file in the folder structure>"
        }

        Example output:
        [
          {
            "content": "export class User { constructor(public readonly id: string, public readonly name: string) {} }",
            "path": "/src/domain/entities/user.entity.ts"
          },
          {
            "content": "import { Router } from 'express'; const router = Router(); export default router;",
            "path": "/src/presentation/routes/user.route.ts"
          }
        ]
      `;

      console.log("Getting code from AI...");
      const result = await Gemini({ input: JSON.stringify(input) });
      console.log(`AI Result: ${result}`);
      const parsedResult = JSON.parse(result);
      console.log('parsedResult', parsedResult);
      for (const item of parsedResult) {
        console.log(`Writing file: ${item.path}`);
        writeFiles(item.content, basePath, item.path);
        console.log(`Wrote file: ${item.path}`);
      }

      return;

    } else {

      if (options.test)
        return;

      const TypeData = JSON.parse(types);
      console.log('Creating module...');
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
    }
    console.log('Module created successfully!');
  });



// CLI'yi başlat
program.parse();

