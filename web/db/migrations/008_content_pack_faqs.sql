-- 008_content_pack_faqs.sql
-- The five FAQs from the FWC Website Content Pack replace the old list on the home page. They stay editable in the
-- admin (FAQs). Runs once: if the first question is already there (this ran before, or it was added by hand), nothing changes.

SET @done := (SELECT COUNT(*) FROM `faqs` WHERE `question` = 'How do I get started?');

DELETE FROM `faqs` WHERE @done = 0;

INSERT INTO `faqs` (`question`, `body`)
SELECT * FROM (
  SELECT 'How do I get started?' AS q, '<p>Take the free assessment, then book your free 15-minute call.</p>' AS b
  UNION ALL SELECT 'Do you just advise, or do the work?', '<p>We do the work: we file, follow up and hand you the documents.</p>'
  UNION ALL SELECT 'Who do you work with?', '<p>Start-ups, SMEs, NGOs and foreign companies entering Nigeria.</p>'
  UNION ALL SELECT 'Can you fix overdue annual returns or filings?', '<p>Yes. We file what''s outstanding and bring you back into good standing.</p>'
  UNION ALL SELECT 'How much does it cost?', '<p>Every fee is confirmed in writing before we start. Regulator fees are passed on at cost, with receipts.</p>'
) AS pack
WHERE @done = 0;
