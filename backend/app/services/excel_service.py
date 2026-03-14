import openpyxl
from datetime import datetime
from decimal import Decimal
from typing import List, Dict, Any, Tuple
from uuid import UUID

class ExcelValidationError(Exception):
    pass

class ExcelService:
    
    REQUIRED_COLUMNS = ['Tracking Number', 'Label Cost', 'Customer Name', 'Order Number', 'Qty','Date']
    
    @staticmethod
    def validate_excel_file(file_path: str) -> Tuple[bool, List[Dict[str, Any]], List[str]]:
        """
        Validate Excel file and extract rows
        Returns: (is_valid, rows, errors)
        """
        rows = []
        errors = []
        
        try:
            workbook = openpyxl.load_workbook(file_path, data_only=True)
            sheet = workbook.active
            
            # Check headers
            headers = [cell.value for cell in sheet[1]]
            missing_columns = [col for col in ExcelService.REQUIRED_COLUMNS if col not in headers]
            
            if missing_columns:
                errors.append(f"Missing columns: {', '.join(missing_columns)}")
                return False, rows, errors
            
            # Get column indices
            col_indices = {col: headers.index(col) for col in ExcelService.REQUIRED_COLUMNS}
            
            # Process rows
            for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
                if not any(row):  # Skip empty rows
                    continue
                    
                row_errors = []
                
                try:
                    tracking = str(row[col_indices['Tracking Number']]) if row[col_indices['Tracking Number']] else ''
                    label_cost_str = str(row[col_indices['Label Cost']]) if row[col_indices['Label Cost']] else '0'
                    customer_name = str(row[col_indices['Customer Name']]) if row[col_indices['Customer Name']] else ''
                    order_number = str(row[col_indices['Order Number']]) if row[col_indices['Order Number']] else ''
                    qty_str = str(row[col_indices['Qty']]) if row[col_indices['Qty']] else '1'
                    date_value = row[col_indices['Date']]
                    
                    # Validation
                    if not tracking:
                        row_errors.append("Tracking number is required")
                    
                    try:
                        label_cost = Decimal(str(label_cost_str).replace('$', '').replace(',', ''))
                        if label_cost < 0:
                            row_errors.append("Label cost cannot be negative")
                    except:
                        row_errors.append("Invalid label cost")
                        label_cost = Decimal('0')
                    
                    if not customer_name:
                        row_errors.append("Customer name is required")
                    
                    if not order_number:
                        row_errors.append("Order number is required")
                    
                    # Parse quantity
                    try:
                        qty = int(float(qty_str))
                        if qty < 1:
                            row_errors.append("Quantity must be at least 1")
                    except:
                        row_errors.append("Invalid quantity format")
                        qty = 1
                    
                    # Parse date
                    parsed_date = None
                    if date_value:
                        if isinstance(date_value, datetime):
                            parsed_date = date_value.date()
                        elif isinstance(date_value, str):
                            try:
                                parsed_date = datetime.strptime(date_value, '%Y-%m-%d').date()
                            except:
                                try:
                                    parsed_date = datetime.strptime(date_value, '%m/%d/%Y').date()
                                except:
                                    row_errors.append("Invalid date format. Use YYYY-MM-DD")
                    
                    row_data = {
                        'row_number': row_idx,
                        'tracking_number': tracking,
                        'label_cost': label_cost,
                        'end_customer_name': customer_name,
                        'order_number': order_number,
                        'quantity': qty,
                        'date': parsed_date,
                        'is_valid': len(row_errors) == 0,
                        'validation_errors': '; '.join(row_errors) if row_errors else None
                    }
                    
                    rows.append(row_data)
                    
                except Exception as e:
                    errors.append(f"Row {row_idx}: {str(e)}")
            
            workbook.close()
            
        except Exception as e:
            errors.append(f"Failed to read Excel file: {str(e)}")
            return False, rows, errors
        
        is_valid = len(errors) == 0 and all(row['is_valid'] for row in rows)
        return is_valid, rows, errors

    @staticmethod
    def generate_filename(customer_code: str) -> str:
        """Generate filename for uploaded Excel"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return f"{customer_code}_ShippingBatch_{timestamp}.xlsx"
