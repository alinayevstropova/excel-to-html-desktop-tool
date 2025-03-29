import * as XLSX from 'xlsx';

export async function parseExcel(fileBuffer) {
    try {
        if (!(fileBuffer instanceof ArrayBuffer)) {
            throw new Error('Invalid file data');
        }

        const workbook = XLSX.read(fileBuffer, { type: 'array' });
        return workbook.SheetNames.map(sheetName => XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })); // Добавлено { header: 1 }
    } catch (error) {
        console.error('Error parsing Excel file:', error);
        throw error;
    }
}

export function extractDataFromSheet(sheet, settings) {
    const data =[];

    sheet.forEach((row) => {
        if (!row || row.length === 0) return; // Пропускаем пустые строки

        const type = String(row[0] || '').trim().toLowerCase(); // Преобразуем в строку и обрабатываем null
        const content = String(row[1] || '').trim(); // Преобразуем в строку и обрабатываем null
        
        let item = {};

        switch (type) {
            case 'h':
                item.tag = settings.headerTag;
                item.class = settings.headerClass;
                item.content = content;
                break;
            case 'img':
                //Предполагаем, что путь к изображению указан в Excel
                item.tag = 'img';
                item.src = content; 
                item.alt = ''; // Можно добавить alt текст
                break;
            case 'form':
                item.tag = 'form';
                item.id = 'form1';
                break;
            default:
                item.tag = settings.textTag;
                item.class = settings.textClass;
                item.content = content;
        }

        if (item.tag) {
            data.push(item);
        }
    });

    return data;
}