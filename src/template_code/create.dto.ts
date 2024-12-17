export default function getDtoClassTemplate(dtoName: string, dtoType: string, fields: Record<string, string>): string {
    const fieldDeclarations = Object.keys(fields).map(key => {
        return `    public readonly ${key}: ${fields[key]};`;
    }).join("\n");

    const constructorParams = Object.keys(fields).map(key => {
        return `${key}: ${fields[key]}`;
    }).join(", ");

    const assignments = Object.keys(fields).map(key => {
        return `        this.${key} = ${key};`;
    }).join("\n");

    const validationErrors = Object.keys(fields).map(key => {
        return `        if (!${key}) errors.push({ field: '${key}', message: '${key.charAt(0).toUpperCase() + key.slice(1)} is required' });`;
    }).join("\n");

    return `export class ${dtoType}${dtoName}Dto {
${fieldDeclarations}
    private constructor(${constructorParams}) {
${assignments}
    }

    public static create(object: { [key: string]: any }): { errors: { field: string; message: string }[]; dto?: ${dtoType}${dtoName}Dto } {
        const { ${Object.keys(fields).join(", ")} } = object;
        const errors: { field: string; message: string }[] = [];

${validationErrors}

        if (errors.length > 0) {            
            return { errors };
        }

        return { errors, dto: new ${dtoType}${dtoName}Dto(${Object.keys(fields).join(", ")}) };
    }
}`;
}
