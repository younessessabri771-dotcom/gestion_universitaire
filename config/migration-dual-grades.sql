-- Migration script to add dual grade system support
-- This adds support for both simple grades and multiple control grades

USE gestion_universitaire;

-- Add new columns to etudier table
ALTER TABLE etudier 
ADD COLUMN type_controle VARCHAR(100) NULL COMMENT 'Type de contrôle: Premier contrôle, Deuxième contrôle, etc.',
ADD COLUMN note_numerique DECIMAL(5,2) NULL COMMENT 'Note numérique pour les contrôles (ex: 14.5)';

-- Create index for better performance
CREATE INDEX idx_controle_type ON etudier(etudiant_id, matiere_id, type_controle);

-- Verify the changes
DESCRIBE etudier;

-- Display message
SELECT 'Migration completed successfully! Table etudier now supports dual grade system.' AS Status;
