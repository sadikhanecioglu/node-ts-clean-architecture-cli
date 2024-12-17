import * as path from 'path';
import * as fs from 'fs-extra';
import { capitalizeFirstLetter } from '../utility/capitalizeFirstLetter';
import { getRepositoryInterfaceTemplate } from '../template_code';
export default function writeInterfaces(modulename: string, basepath: string) {

    const moduleCapitalizedName = capitalizeFirstLetter(modulename);
    const interfaceName = `I${moduleCapitalizedName}Repository`;
    const entityName = `${moduleCapitalizedName}Entity`;

    const methods = [
        { name: "findAll", params: [], returnType: `${entityName}[]` },
        { name: "create", params: [{ name: "company", type: `Create${moduleCapitalizedName}Dto` }], returnType: entityName },
        { name: "update", params: [{ name: "company", type: entityName }], returnType: "void" },
        { name: "findById", params: [{ name: "id", type: "string" }], returnType: `${entityName} | null` },
    ];

    const interfaceTemplate = getRepositoryInterfaceTemplate(interfaceName, entityName, modulename, methods);

    const interfacesPath = path.join(basepath, 'domain/interfaces');
    fs.ensureDirSync(interfacesPath);
    fs.writeFileSync(path.join(interfacesPath, `${modulename}.repository.ts`), interfaceTemplate);
}