-- Migration: Add charity_donations table
-- Run this against your existing database

CREATE TABLE charity_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    donor_name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    purpose VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    donated_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_charity_donations_company ON charity_donations(company_id);