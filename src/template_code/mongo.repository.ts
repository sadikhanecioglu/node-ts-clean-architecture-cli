export default function getMongoRepositoryTemplate(repositoryName: string, entityName: string, moduleName: string, methods: any[]): string {
    const methodTemplates = methods.map(method => {
        const methodName = method.name;
        const returnType = method.returnType;
        const params = method.params
            .map((param: any) => `${param.name}: ${param.type}`)
            .join(", ");

        const mongoImplementation = (() => {
            switch (methodName) {
                case 'findAll':
                    return `return await ${repositoryName}Model.find();`;
                case 'create':
                    return `const ${repositoryName.toLowerCase()}Entity = new ${repositoryName}Model(${method.params[0]?.name});\n        return await ${repositoryName.toLowerCase()}Entity.save();`;
                case 'update':
                    return `await ${repositoryName}Model.updateOne({ id: ${method.params[0]?.name}.id }, ${method.params[0]?.name});`;
                case 'findById':
                    return `return await ${repositoryName}Model.findById(${method.params[0]?.name});`;
                default:
                    return `// Add implementation for ${methodName}`;
            }
        })();

        return `    async ${methodName}(${params}): Promise<${returnType}> {
        ${mongoImplementation}
    }`;
    });

    return `import { ${entityName} } from "../../domain/entities/${moduleName}.entity";
import { I${repositoryName}Repository } from "../../domain/interfaces/${moduleName}.repository";
import { ${repositoryName}Model } from "../models/${moduleName}.model";

export class ${repositoryName}MongoRepository implements I${repositoryName}Repository {
${methodTemplates.join("\n\n")}
}
`;
}
