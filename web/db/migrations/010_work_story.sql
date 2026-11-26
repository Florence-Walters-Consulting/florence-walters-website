-- 010_work_story.sql
-- A short story for each work highlight: the problem, the result, and the time it took (what FWC did is the existing summary
-- and steps). Safe to run more than once. The seeded text is a first draft describing the usual situation for each
-- certificate; edit it in the admin. "Time taken" is left empty until the real figure is entered, and is hidden while empty.

SET @has := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'work_highlights' AND column_name = 'problem');
SET @stmt := IF(@has = 0,
  'ALTER TABLE `work_highlights` ADD COLUMN `problem` VARCHAR(400) NOT NULL DEFAULT \'\', ADD COLUMN `result` VARCHAR(400) NOT NULL DEFAULT \'\', ADD COLUMN `duration` VARCHAR(80) NOT NULL DEFAULT \'\'',
  'DO 0');
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

UPDATE `work_highlights` w JOIN (
  SELECT 'scuml' AS slug, 'The business needed SCUML registration but was unsure which documents the EFCC required.' AS problem, 'SCUML certificate issued, with every filing receipt in hand.' AS result
  UNION ALL SELECT 'cac', 'A founder needed a properly registered company, ready for a bank account and for investors.', 'Certificate of Incorporation issued, with a complete bank-ready pack.'
  UNION ALL SELECT 'nogic-jqs', 'An oil and gas contractor could not bid for work without NCDMB NOGIC JQS registration.', 'NOGIC JQS certificate issued, so the business could start bidding.'
  UNION ALL SELECT 'nafdac', 'A food or product business could not sell until its products were registered with NAFDAC.', 'NAFDAC registration issued, so the products could go to market.'
  UNION ALL SELECT 'trademark', 'A business wanted its name and logo legally protected before competitors copied them.', 'Trademark application filed and acknowledged by the Trademarks Registry.'
  UNION ALL SELECT 'bpp', 'A contractor could not bid for government contracts without BPP registration.', 'BPP registration certificate issued.'
  UNION ALL SELECT 'tax-clearance', 'A business needed a tax clearance certificate but its filings were not up to date.', 'Filings brought up to date and the tax clearance certificate issued.'
  UNION ALL SELECT 'itf', 'An employer needed its yearly ITF certificate of compliance.', 'ITF certificate of compliance issued.'
  UNION ALL SELECT 'ndpc-audit', 'A business that handles personal data needed to file its data protection compliance audit.', 'Audit filing submitted and acknowledged by the NDPC.'
  UNION ALL SELECT 'nsitf', 'An employer needed NSITF Employees Compensation Scheme clearance.', 'NSITF clearance certificate issued.'
  UNION ALL SELECT 'nuprc', 'A business needed a permit from the NUPRC and was unsure of the process.', 'NUPRC permit issued.'
  UNION ALL SELECT 'nogic-jqs-consultancy', 'A consultancy needed NOGIC JQS registration in the consultancy category to work with oil and gas operators.', 'NOGIC JQS consultancy registration issued.'
) d ON d.slug = w.slug
SET w.problem = d.problem, w.result = d.result
WHERE w.problem = '';
