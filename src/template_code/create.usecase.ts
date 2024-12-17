export default function getCreateUseCaseTemplate(
    useCaseName: string,
    repositoryInterfaceName: string,
    dtoName: string,
    entityName: string
): string {
    return `import { ${repositoryInterfaceName} } from "../../domain/interfaces/${entityName.toLowerCase()}.repository";
        import { ${dtoName} } from "../../presentation/dtos/${entityName.toLowerCase()}/${entityName.toLowerCase()}.create.dto";

export class ${useCaseName} {

    private ${repositoryInterfaceName.toLowerCase()}: ${repositoryInterfaceName};

    constructor(${repositoryInterfaceName.toLowerCase()}: ${repositoryInterfaceName}) {
        this.${repositoryInterfaceName.toLowerCase()} = ${repositoryInterfaceName.toLowerCase()};
    }

    async execute(company: ${dtoName}) {
        const createdEntity = await this.${repositoryInterfaceName.toLowerCase()}.create(company);
        return createdEntity;
    }
}`;
}
