-- Migration: Add image_url column to existing articles table
-- Run this if you already have articles and don't want to drop the table

-- Add column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='articles' AND column_name='image_url'
    ) THEN
        ALTER TABLE articles ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Column image_url added successfully';
    ELSE
        RAISE NOTICE 'Column image_url already exists';
    END IF;
END $$;

-- Optionally, add default images to existing articles
UPDATE articles 
SET image_url = 'https://source.unsplash.com/800x600/?technology,' || id
WHERE image_url IS NULL;

