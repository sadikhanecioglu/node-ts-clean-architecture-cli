export default function getMongooseSchemaTemplate(modelName: string, schemaDefinition: any): string {
    const schemaFields = Object.keys(schemaDefinition).map(field => {
        const fieldDef = schemaDefinition[field];
        const { type, required, ref } = fieldDef;
        const typeString = typeof type === 'string' ? type : `Schema.Types.${type.name}`;
        const refString = ref ? `, ref: '${ref}'` : '';

        return `        ${field}: { type: ${typeString}, required: ${required}${refString} },`;
    }).join("\n");

    const interfaceFields = Object.keys(schemaDefinition).map(field => {


        return `${field}: ${schemaDefinition[field].type.toLowerCase()};`;
    }).join("\n");



    return `import mongoose, { Schema } from "mongoose";
            import { toJSONTransform } from "../../domain/helpers/mongo.tojson";


            interface I${modelName} extends Document {
            id:string;
            ${interfaceFields}
            }

            const ${modelName}Schema = new Schema<I${modelName}>({
            ${schemaFields}
            });

            ${modelName}Schema.set('toJSON', toJSONTransform());

            const ${modelName}Model = mongoose.model<I${modelName}>('${modelName}', ${modelName}Schema);

            export { ${modelName}Model ,I${modelName}};`;
}