const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';

// Directories to delete entirely
const dirsToDelete = [
    path.join(rootDir, 'images', 'gallery'),
    path.join(rootDir, 'Anshuman enterprises')
];

// File extensions to delete from the root and 'images' directory
const uselessExtensions = ['.jpg', '.jpeg', '.png', '.mp4'];

let deletedFilesCount = 0;
let deletedDirsCount = 0;
let freedBytes = 0;

function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectory(curPath);
            } else {
                freedBytes += fs.statSync(curPath).size;
                fs.unlinkSync(curPath);
                deletedFilesCount++;
            }
        }
        fs.rmdirSync(dirPath);
        deletedDirsCount++;
        console.log(`Deleted folder: ${dirPath}`);
    }
}

// 1. Delete useless directories
for (const dir of dirsToDelete) {
    deleteDirectory(dir);
}

// 2. Delete useless files in root and 'images' folder
const foldersToScan = [rootDir, path.join(rootDir, 'images')];

for (const scanDir of foldersToScan) {
    if (!fs.existsSync(scanDir)) continue;
    
    const files = fs.readdirSync(scanDir);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (uselessExtensions.includes(ext)) {
            const filePath = path.join(scanDir, file);
            if (fs.lstatSync(filePath).isFile()) {
                freedBytes += fs.statSync(filePath).size;
                fs.unlinkSync(filePath);
                deletedFilesCount++;
                console.log(`Deleted file: ${file}`);
            }
        }
    }
}

const freedMB = (freedBytes / (1024 * 1024)).toFixed(2);
console.log(`\nCleanup Complete!`);
console.log(`Deleted ${deletedFilesCount} useless files and ${deletedDirsCount} useless folders.`);
console.log(`Freed up ${freedMB} MB of space on your device!`);
