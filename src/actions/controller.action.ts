import * as path from 'path';
import * as fs from 'fs-extra';
import { getControllerTemplate } from "../template_code";
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";

export default function writeController(modulename: string, basepath: string) { 

    const moduleCapitalizedName = capitalizeFirstLetter(modulename);
    
    const controllerTemplate = getControllerTemplate(
        `${moduleCapitalizedName}Controller`,
        [
            {
                propertyName: `create${moduleCapitalizedName}`,
                type: `Create${moduleCapitalizedName}UseCase`,
                injectIdentifier: `${moduleCapitalizedName.toUpperCase()}_TYPES.Create${moduleCapitalizedName}UseCase`,
                importPath: `../../use-cases/${modulename}/create-${modulename}.usecase`
            },
            {
                propertyName: `getAll${moduleCapitalizedName}`,
                type: `GetAll${moduleCapitalizedName}UseCase`,
                injectIdentifier: `${moduleCapitalizedName.toUpperCase()}_TYPES.GetAll${moduleCapitalizedName}UseCase`,
                importPath: `../../use-cases/${modulename}/getall-usecase`
            }
        ],
        [
            {
                name: 'create',
                params: [{ name: 'req', type: 'Request' }, { name: 'res', type: 'Response' }],
                body: `if (!req.body) {
                    res.status(400).json({ message: 'No data provided' });
                    return;
                }
    
                const result = Create${moduleCapitalizedName}Dto.create(req.body);
    
                if (result.errors.length > 0) {
                    res.status(400).json(result.errors);
                    return;
                }
    
                if (!result.dto) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
    
                this.create${moduleCapitalizedName}.execute(result.dto).then((result) => {
                    res.status(200).json(result);
                }).catch((error) => {
                    this.ErroStatus(error, res);
                });`
            },
            {
                name: 'getAll',
                params: [{ name: 'req', type: 'Request' }, { name: 'res', type: 'Response' }],
                body: `const result = Filter${moduleCapitalizedName}Dto.create(req.query);
    
                if (result.errors.length > 0) {
                    res.status(400).json(result.errors);
                    return;
                }
    
                if (!result.dto) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
    
                this.getAll${moduleCapitalizedName}.execute(result.dto).then((result) => {
                    res.status(200).json(result);
                }).catch((error) => {
                    this.ErroStatus(error, res);
                });`
            }
        ]
    );
   


    const controllerPath = path.join(basepath, 'presentation', modulename);
    fs.ensureDirSync(controllerPath);
    fs.writeFileSync(path.join(controllerPath, `${modulename}.controller.ts`), controllerTemplate);

}