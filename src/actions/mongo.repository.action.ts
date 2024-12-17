import { getMongoRepositoryTemplate } from "../template_code";
import * as path from 'path';
import * as fs from 'fs-extra';
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";

export default function writeMongoRepository(modulename: string, basepath: string) {

        const moduleCapitalizedName = capitalizeFirstLetter(modulename);
        const entityName = `${moduleCapitalizedName}Entity`;
        const methods = [
            { name: "findAll", params: [], returnType: `${entityName}[]` },
            { name: "create", params: [{ name: "company", type: `Create${moduleCapitalizedName}Dto` }], returnType: entityName },
            { name: "update", params: [{ name: "company", type: entityName }], returnType: "void" },
            { name: "findById", params: [{ name: "id", type: "string" }], returnType: `${entityName} | null` },
        ];
        const mongooseRepositoryTemplate = getMongoRepositoryTemplate(moduleCapitalizedName, entityName, modulename, methods);
        const mongoRepositoryPath = path.join(basepath, 'infrastructure/repositories');
        fs.ensureDirSync(mongoRepositoryPath);
        fs.writeFileSync(path.join(mongoRepositoryPath, `${modulename}.mongo.repository.ts`), mongooseRepositoryTemplate);
}