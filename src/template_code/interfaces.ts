
export default function getRepositoryInterfaceTemplate(interfaceName: string, entityName: string, moduleName:string, methods: any[]): string {
    const methodTemplates = methods.map(method => {
        const methodName = method.name;
        const returnType = method.returnType;
        const params = method.params
            .map((param: any) => `${param.name}: ${param.type}`)
            .join(", ");

        return `    ${methodName}(${params}): Promise<${returnType}>;`;
    });

    return `
    import { ${entityName} } from "../entities/${moduleName}.entity";
    export interface ${interfaceName} {
${methodTemplates.join("\n")}
}
`;
}

