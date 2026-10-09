-- 003: Business model for customers (wholesale / dropshipping)
-- Every existing customer automatically becomes 'wholesale'.

ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS business_model VARCHAR(20) NOT NULL DEFAULT 'wholesale';

ALTER TABLE customers
    DROP CONSTRAINT IF EXISTS customers_business_model_check;

ALTER TABLE customers
    ADD CONSTRAINT customers_business_model_check
    CHECK (business_model IN ('wholesale', 'dropshipping'));