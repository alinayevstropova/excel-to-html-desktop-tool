import JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';

const TEMP_DIR = path.join(__dirname, 'temp');
const OUTPUT_ZIP_NAME = 'modified.zip';

export async function processZip(zipFilePath, htmlContent, targetFiles = ['index.php']) {
    try {
        const data = fs.readFileSync(zipFilePath);
        const zip = await JSZip.loadAsync(data);

        let filesUpdated = 0;

        for (const targetFile of targetFiles) {
            if (zip.file(targetFile)) {
                let fileContent = await zip.file(targetFile).async('string');
                fileContent = fileContent.replace(/<div id="my-content">[\s\S]*?<\/div>/i, `<div id="my-content">${htmlContent}</div>`);
                zip.file(targetFile, fileContent);
                filesUpdated++;
            } else {
                console.warn(`${targetFile} not found in ZIP archive.`);
            }
        }

        if (filesUpdated === 0) {
            throw new Error('No target files found in ZIP archive.');
        }

        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
        }

        const newZipData = await zip.generateAsync({ type: 'nodebuffer' });
        const newZipPath = path.join(TEMP_DIR, OUTPUT_ZIP_NAME);
        fs.writeFileSync(newZipPath, newZipData);

        return newZipPath;

    } catch (error) {
        console.error('Error processing ZIP archive:', error);
        throw error;
    }
}

export async function extractFiles(filePath) {
    try {
        const data = await fs.promises.readFile(filePath);
        const zip = await JSZip.loadAsync(data);
        const files ={};

        zip.forEach((relativePath, zipEntry) => {
            files.push(zipEntry.name);
        });

        return files;
    } catch (error) {
        console.error("Error extracting files:", error);
        throw error;
    }
}