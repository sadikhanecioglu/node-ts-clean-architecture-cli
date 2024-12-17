import * as path from 'path';
import * as fs from 'fs-extra';
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";
import { getDtoClassTemplate } from '../template_code';

export default function writeCreateDto(modulename: string, types: any, basepath: string) {

    const moduleCapitalizedName = capitalizeFirstLetter(modulename);
    const createDtoTemplate = getDtoClassTemplate(moduleCapitalizedName,"Create", types);
    const createDtoPath = path.join(basepath, 'presentation/dtos',modulename)

    fs.ensureDirSync(createDtoPath);
    fs.writeFileSync(path.join(createDtoPath, `${modulename}.create.dto.ts`), createDtoTemplate);
}