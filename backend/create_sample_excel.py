import openpyxl
from datetime import datetime

# Create workbook
wb = openpyxl.Workbook()
ws = wb.active

# Add headers
headers = ['Tracking Number', 'Label Cost', 'Customer Name', 'Order Number', 'Date']
ws.append(headers)

# Add sample rows
rows = [
    ['TRK-001', '12.50', 'John Buyer', 'ORD-1001', '2026-02-12'],
    ['TRK-002', '8.75', 'Mary Buyer', 'ORD-1002', '2026-02-12'],
    ['TRK-003', '10.00', 'John Buyer', 'ORD-1003', '2026-02-12'],
]

for row in rows:
    ws.append(row)

# Save file
wb.save('sample_shipping_batch.xlsx')
print('Sample Excel file created: sample_shipping_batch.xlsx')
