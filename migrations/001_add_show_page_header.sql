-- Add show_page_header column to pages table
-- This migration adds support for toggling page header visibility

ALTER TABLE pages ADD COLUMN show_page_header INTEGER DEFAULT 1;

-- Update existing pages to show page header by default
UPDATE pages SET show_page_header = 1 WHERE show_page_header IS NULL;
