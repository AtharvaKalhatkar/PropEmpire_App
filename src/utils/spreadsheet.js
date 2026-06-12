import ExcelJS from 'exceljs';

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeCsvValue = (value) => {
  const text = value == null ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const exportRowsToXlsx = async ({ rows, sheetName, fileName }) => {
  if (!rows.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  
  const columnsCount = Object.keys(rows[0]).length;
  
  // Row 1: Company Brand
  worksheet.mergeCells(1, 1, 1, columnsCount);
  const brandCell = worksheet.getCell(1, 1);
  brandCell.value = 'PROP EMPIRE';
  brandCell.font = { name: 'Segoe UI', size: 22, bold: true, color: { argb: 'FF0F172A' } }; // Deep Navy
  brandCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  // Row 2: Report Title
  worksheet.mergeCells(2, 1, 2, columnsCount);
  const titleCell = worksheet.getCell(2, 1);
  titleCell.value = `${sheetName.toUpperCase()} REPORT`;
  titleCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFD4AF37' } }; // Champagne Gold
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(2).height = 20;

  // Row 3: Metadata
  worksheet.mergeCells(3, 1, 3, columnsCount);
  const dateCell = worksheet.getCell(3, 1);
  dateCell.value = `Generated on: ${new Date().toLocaleString()}`;
  dateCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF64748B' } }; // Slate Gray
  dateCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(3).height = 20;

  // Setup columns
  const keys = Object.keys(rows[0]);
  worksheet.columns = keys.map((key) => ({ key, width: 20 }));

  // Row 4: Headers
  const headerRow = worksheet.getRow(4);
  headerRow.values = keys.map(k => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
  headerRow.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.height = 30;
  
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Deep Navy
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FFD4AF37' } } // Gold accent border
    };
  });

  // Freeze top panes & HIDE GRIDLINES for a clean PDF-like look
  worksheet.views = [{ showGridLines: false, state: 'frozen', xSplit: 0, ySplit: 4 }];

  // Add Data Rows
  rows.forEach((row) => {
    const newRow = worksheet.addRow(row);
    newRow.height = 25;
    
    newRow.eachCell({ includeEmpty: true }, (cell) => {
      // Clean white background
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      
      // Only bottom border for a sleek modern grid
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF334155' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
      
      // Auto-align numbers to right
      if (!isNaN(cell.value) && cell.value !== '') {
        cell.alignment.horizontal = 'right';
      }
    });
  });

  // Auto-fit columns dynamically based on content length
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    // Add extra padding for the clean look
    column.width = maxLength < 15 ? 15 : maxLength > 50 ? 50 : maxLength + 5;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, fileName);
};

export const exportRowsToCsv = ({ rows, fileName }) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
  ];

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileName);
};