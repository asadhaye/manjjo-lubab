const XLSX = require('xlsx');
const path = require('path');

const workbook = XLSX.readFile(path.join(__dirname, '../lib/Manjjo-App-Menu.xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log('Sheet name:', sheetName);
console.log('Total rows:', data.length);
console.log('\nFirst row (headers):', data[0]);
console.log('\nFirst 5 data rows:');
data.slice(1, 6).forEach((row, i) => {
  console.log(`Row ${i + 1}:`, row);
});
