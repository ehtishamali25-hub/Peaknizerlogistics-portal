-- 004: Dropshipping inventory entries + allow invoices without shipping details

CREATE TABLE IF NOT EXISTS dropshipping_entries (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    entry_number SERIAL NOT NULL UNIQUE,
    entry_date DATE NOT NULL,
    excel_file_path TEXT NOT NULL,
    excel_original_name VARCHAR(255) NOT NULL,
    labels_file_path TEXT NOT NULL,
    labels_original_name VARCHAR(255) NOT NULL,
    shipping_status VARCHAR(30) NOT NULL DEFAULT 'unshipped',
    arrival_status VARCHAR(30) NOT NULL DEFAULT 'not_received',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    prep_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT dropshipping_shipping_status_check
        CHECK (shipping_status IN ('unshipped', 'partially_shipped', 'shipped')),
    CONSTRAINT dropshipping_arrival_status_check
        CHECK (arrival_status IN ('not_received', 'partially_received', 'fully_received')),
    CONSTRAINT dropshipping_approval_status_check
        CHECK (approval_status IN ('pending', 'approved'))
);

CREATE INDEX IF NOT EXISTS idx_dropshipping_entries_customer
    ON dropshipping_entries (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dropshipping_entries_company
    ON dropshipping_entries (company_id);

-- Dropshipping Prep invoices have no shipping details record
ALTER TABLE invoices ALTER COLUMN shipping_details_id DROP NOT NULL;