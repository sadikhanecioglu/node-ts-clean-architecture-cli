import * as path from 'path';
import * as fs from 'fs-extra';

export default function writeFiles(content: string, basePath: string, filePath: string) {
        const getDirectoryPath = (filePath: string) => {
                console.log("getDirectoryPath", filePath);
                const parts = filePath.split('/');
                parts.pop(); // Dosya adını kaldırır
                return parts.join('/');
        }
        const directorPath = path.join(basePath, getDirectoryPath(filePath));
        fs.ensureDirSync(directorPath);
        const wirtePath = path.join(basePath, filePath);
        fs.writeFileSync(wirtePath, content);
}

