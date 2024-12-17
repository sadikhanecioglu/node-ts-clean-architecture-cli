import * as path from 'path';
import * as fs from 'fs-extra';
import { getMongooseSchemaTemplate } from "../template_code";
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";


export default function writeModel(modulename: string, types: any,basepath: string) {
    
    const moduleCapitalizedName = capitalizeFirstLetter(modulename);
    const schemaDefinition = Object.entries(types).reduce<Record<string, any>>((acc, [key, value]) => {
        acc[key] = { type: value === 'Date' ? 'Date' : 'String', required: true };
        return acc;
    }, {});

    const modelTemplate = getMongooseSchemaTemplate(moduleCapitalizedName, schemaDefinition);
    const modelPath = path.join(basepath, 'infrastructure/models');

    fs.ensureDirSync(modelPath);
    fs.writeFileSync(path.join(modelPath, `${modulename}.model.ts`), modelTemplate);
}