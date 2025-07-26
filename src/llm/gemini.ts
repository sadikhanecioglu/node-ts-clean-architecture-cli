import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";






export default async function Gemini({ input }: { input: string }) {

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: "You are an expert in Clean Architecture and Node.js, working with TypeScript and Express. I want you to generate code files for a new module in my project. The project structure follows Clean Architecture principles with the following folder structure:\n\n/src  \n  /container  \n    /modules  \n    /types  \n\n  /domain  \n    /entities  \n    /interfaces  \n\n  /infrastructure  \n    /models  \n    /repositories  \n\n  /presentation  \n    /{new_module_name}  \n      /controller.ts  \n      /route.ts  \n    /dtos  \n      /{new_module_name}  \n        /create.dto.ts  \n        /filter.dto.ts  \n    /routes  \n      index.ts  \n\n  /use-cases  \n    /{new_module_name}  \n      /create.usecase.ts  \n      /getall.usecase.ts  \n\nI want you to create the following for a new module named `{module_name}`:  \n\n1. **Entity**: A class named `{module_name}` with specified parameters and an `id` field.  \n2. **Interface**: A repository interface for the entity with CRUD methods (`create`, `findAll`, `findById`, `update`).  \n3. **Model**: A Mongoose schema and model definition for the entity.  \n4. **Repository**: A MongoDB-based repository implementation for the interface.  \n5. **Use Cases**:  \n   - `create.usecase.ts`: Implements the logic for creating a new `{module_name}`.  \n   - `getall.usecase.ts`: Implements the logic for fetching all `{module_name}` entities.  \n6. **DTOs**:  \n   - `create.dto.ts`: Contains the data structure required to create a `{module_name}`.  \n   - `filter.dto.ts`: Contains the data structure for filtering `{module_name}` records.  \n7. **Controller**: A controller that manages the logic for routes like `create` and `getAll`.  \n8. **Routes**: A router that connects the controller methods to the respective HTTP endpoints.  \n\nFor each file, follow these templates:\n\n- **Entity**:  \n```typescript\nexport class {module_name} {\n    constructor(\n        public readonly id: string | undefined,\n        {parameters}\n    ) {}\n}\n\n\n```interface\nexport interface I{module_name}Repository {\n    create(entity: {module_name}): Promise<{module_name}>;\n    findAll(): Promise<{module_name}[]>;\n    findById(id: string): Promise<{module_name} | null>;\n    update(entity: {module_name}): Promise<void>;\n}\n\n\n\nModel:\nGenerate a Mongoose schema and model using the field definitions from the entity.\n\nRepository:\nCreate a MongoDB repository class that implements the interface methods. Use Mongoose for database interactions.\n\nUse Cases:\n\ncreate.usecase.ts: Logic for creating a new {module_name}.\ngetall.usecase.ts: Logic for retrieving all {module_name}.\nDTOs:\n\ncreate.dto.ts: Define the required fields for creating a {module_name}.\nfilter.dto.ts: Define the fields for filtering {module_name} records.\nController:\nImplement methods for HTTP endpoints (e.g., POST /{module_name}, GET /{module_name}). Inject use cases and services via constructor.\n\nRouter:\nDefine Express routes for the module and connect them to controller methods.\n\n\n",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };


    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(input);
    return result.response.text();

}

// run();