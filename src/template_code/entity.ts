// user.entity.template.ts
import fs from 'fs';
import path from 'path';

// Parametreler array olarak alınıyor
export default function getEntityTemplate(entityName: string, params: any): string {

    const entitiyParams = Object.keys(params).map((key: any) => {
        return `public readonly ${key}: ${params[key]}`;
    });

    return `export class ${entityName} {

    constructor(
        public readonly id: string | undefined, 
       ${entitiyParams.join(",\n")}
    ) {}

}
`;
};

