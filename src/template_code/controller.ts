export default function getControllerTemplate(controllerName: string, dependencies: any[], methods: any[]): string {
    const constructorDependencies = dependencies.map(dep => {
        return `private ${dep.propertyName}: ${dep.type};`;
    }).join("\n    ");

    const constructorInjections = dependencies.map(dep => {
        return `@inject(${dep.injectIdentifier}) ${dep.propertyName}: ${dep.type}`;
    }).join(", ");

    const methodTemplates = methods.map(method => {
        const params = method.params.map((param: any) => `${param.name}: ${param.type}`).join(", ");
        const body = method.body || `// Implement ${method.name} logic here`;

        return `    ${method.name} = async (${params}): Promise<void> => {
        ${body}
    }`;
    }).join("\n\n");

    return `import { inject, injectable } from "inversify";
import { BaseController } from "../abstraction/base.controller";
${dependencies.map(dep => `import { ${dep.type} } from "${dep.importPath}";`).join("\n")}

@injectable()
export class ${controllerName} extends BaseController {
    ${constructorDependencies}

    constructor(${constructorInjections}) {
        super();
${dependencies.map(dep => `        this.${dep.propertyName} = ${dep.propertyName};`).join("\n")}
    }

${methodTemplates}
}
`;
}

// Example Usage



