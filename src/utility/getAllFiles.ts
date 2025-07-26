const fs = require('fs/promises');
const path = require('path');

type Props = {
    basePath: string,
    options: { filter?: (filePath: string) => boolean }
}

 export const  getAllFiles = async ({ basePath, options }: Props) => {
    const { filter = () => true } = options;
    const results: any[] = [];

    const traverse = async (dir: string) => {
        const files = await fs.readdir(dir, { withFileTypes: true });
        await Promise.all(files.map(async (dirent: any) => {
            const fullPath = path.join(dir, dirent.name);

            if (dirent.isDirectory()) {
                await traverse(fullPath);
            } else if (dirent.isFile() && filter(fullPath)) {
                const content = await fs.readFile(fullPath, 'utf-8'); // Read file content

                results.push({
                    filePath: fullPath,
                    content
                    // Diğer eklemek istediğiniz bilgiler
                });
            }
        }));
    };

    await traverse(basePath);
    return results;
}