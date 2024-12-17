export default function getExpressRouterTemplate(
    routerName: string,
    controllerName: string,
    endpoints: { method: string; route: string; action: string; middleware?: string[] }[],
    containerType: string,
    containerPath: string,
    controllerPath: string
): string {
    const middlewareImports = endpoints
        .flatMap(endpoint => endpoint.middleware || [])
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(middleware => `import { ${middleware} } from "../middlewares/${middleware.toLowerCase()}.middlewares";`)
        .join("\n");

    const endpointDefinitions = endpoints.map(endpoint => {
        const middlewareChain = endpoint.middleware?.length
            ? `${endpoint.middleware.join(".authorize, ")}.authorize, `
            : "";
        return `    router.${endpoint.method}('${endpoint.route}', ${middlewareChain}${controllerName}.${endpoint.action});`;
    }).join("\n");

    return `import { Router } from "express";
import { AppContainer } from "${containerPath}";
import { ${controllerName} } from "${controllerPath}";
import { ${containerType} } from "${containerPath}/types/${containerType.toLowerCase()}.types";
${middlewareImports}

export const ${routerName} = () => {
    const container = AppContainer.getInstance().getContainer();
    const router = Router();
    const ${controllerName.toLowerCase()} = container.get<${controllerName}>(${containerType}.${controllerName});

${endpointDefinitions}

    return router;
};
`;
}

// Example Usage

