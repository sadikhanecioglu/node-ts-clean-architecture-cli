import { getRouterTemplate } from "../template_code";
import * as path from 'path';
import * as fs from 'fs-extra';
import { capitalizeFirstLetter } from "../utility/capitalizeFirstLetter";

export default function writeRouter(modulename: string, basepath: string) {

    const moduleCapitalizedName = capitalizeFirstLetter(modulename);

    const routerTemplate = getRouterTemplate(
        
        `${modulename}Routes`,
        `${moduleCapitalizedName}Controller`,
        [
            { method: 'post', route: '/create', action: 'create', middleware: ['AuthorizedMiddleware'] },
            { method: 'get', route: '/all', action: 'getAll', middleware: ['AuthorizedMiddleware'] },
        ],
        `${modulename.toUpperCase()}_TYPES`,
        '../../container',
        `./${modulename}.controller`
    );
    
    const routerPath = path.join(basepath, 'presentation',modulename);
    fs.ensureDirSync(routerPath);
    fs.writeFileSync(path.join(routerPath, `${modulename}.router.ts`), routerTemplate);


}