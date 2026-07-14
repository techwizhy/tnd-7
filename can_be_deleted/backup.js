const fs = require('fs');
const path = require('path');

function getBackupFolderName() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  
  // Format day, month, year, hours, minutes
  const day = String(now.getDate()).padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `backup_${day}_${month}_${year}_${hours}-${minutes}`;
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  const entries = fs.readdirSync(from, { withFileTypes: true });
  
  for (let entry of entries) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    
    // Exclude patterns
    const nameLower = entry.name.toLowerCase();
    if (nameLower === 'node_modules' || 
        nameLower === '.git' || 
        nameLower.startsWith('backup') || 
        nameLower === 'archive' || 
        nameLower === 'backup.js') {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

function main() {
  const srcDir = __dirname;
  let backupName = getBackupFolderName();
  let destDir = path.join(srcDir, backupName);
  
  // If destination already exists, append a counter
  let counter = 1;
  while (fs.existsSync(destDir)) {
    destDir = path.join(srcDir, `${backupName}_${counter}`);
    counter++;
  }
  
  console.log(`Starting backup from: ${srcDir}`);
  console.log(`Backing up to: ${destDir}`);
  
  try {
    copyFolderSync(srcDir, destDir);
    console.log(`Backup completed successfully! Created folder: ${path.basename(destDir)}`);
  } catch (err) {
    console.error('Backup failed:', err);
  }
}

main();
