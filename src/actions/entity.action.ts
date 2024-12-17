import * as path from 'path';
import * as fs from 'fs-extra';
import { getEntityTemplate } from "../template_code";
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";



export default function WriteEntity(modulename: string, types: any, basepath: string) {



    const moduleCapitalizedName = capitalizeFirstLetter(modulename);
    const entityName = `${moduleCapitalizedName}Entity`;
    const entitiyTemplate = getEntityTemplate(entityName, types);
    const entityPath = path.join(basepath, 'domain/entities');

    fs.ensureDirSync(entityPath);
    fs.writeFileSync(path.join(entityPath, `${modulename}.entity.ts`), entitiyTemplate);
}