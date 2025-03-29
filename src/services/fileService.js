export function readFile(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
  });
}

export async function readFilePath(filePath) {
  try {
      return await window.electron.readFile(filePath);
  } catch (error) {
      console.error('Error reading file:', error);
      throw error;
  }
}

export async function writeFilePath({filePath, content}) {
try {
  return await window.electron.writeFile({filePath, content});
} catch(error) {
    console.error('error writing file', error);
    throw error;
}
}