export default function csvParse(headerSchema, data, filename) {
  const headers = Object.keys(headerSchema).join(';');

  const props = data
    .map(row => {
      return (
        Object.entries(headerSchema)
          .map(([headerKey, dataKeys]) => {
            if (Array.isArray(dataKeys)) {
              return dataKeys.map(key => (row[key] ? row[key]?.toString().replace(/"/g, '""') : '')).join(' / ');
            } else {
              return row[dataKeys] ? `"${row[dataKeys]?.toString().replace(/"/g, '""')}"` : '';
            }
          })
          .join(';')
      );
    })
    .join('\n');

  const csvString = `${headers}\n${props}`;

  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
