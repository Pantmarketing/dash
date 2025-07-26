
-- Update existing records to have proper average_ticket calculations
UPDATE dashboard_data 
SET average_ticket = CASE 
  WHEN sales > 0 THEN revenue / sales
  ELSE 0 
END 
WHERE average_ticket = 0;
