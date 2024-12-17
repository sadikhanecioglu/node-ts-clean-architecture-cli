
import * as path from 'path';
import * as fs from 'fs-extra';
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";
import { getCreateUseCaseTemplate } from '../template_code';
export default function writeCreateUseCase(modulename: string, types: any, basepath: string) {


    const moduleCapitalizedName = capitalizeFirstLetter(modulename);

    const useCaseTemplate = getCreateUseCaseTemplate(
        `Create${moduleCapitalizedName}UseCase`,
        `I${moduleCapitalizedName}Repository`,
        `Create${moduleCapitalizedName}Dto`,
        moduleCapitalizedName
    );
    
    const useCasePath = path.join(basepath, 'use-cases', modulename);
    fs.ensureDirSync(useCasePath);
    fs.writeFileSync(path.join(useCasePath, `create-${modulename}.usecase.ts`), useCaseTemplate);

}