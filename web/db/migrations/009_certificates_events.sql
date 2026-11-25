-- 009_certificates_events.sql
-- 1) Real (blurred) certificate images for work highlights, plus highlights for the new certificates.
-- 2) Events (webinars) managed in the admin, with the "Tax-Ready for 2026" webinar.
-- Safe to run more than once: the column is added only if missing and seeds use INSERT IGNORE on the unique slug.

SET @has := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'work_highlights' AND column_name = 'certificate');
SET @stmt := IF(@has = 0,
  'ALTER TABLE `work_highlights` ADD COLUMN `certificate` VARCHAR(100) NOT NULL DEFAULT \'\' AFTER `logo`',
  'DO 0');
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- Existing highlights that have a real certificate image ('' = the drawn certificate is used).
UPDATE `work_highlights` SET `certificate` = 'scuml' WHERE `slug` = 'scuml' AND `certificate` = '';
UPDATE `work_highlights` SET `certificate` = 'cac' WHERE `slug` = 'cac' AND `certificate` = '';
UPDATE `work_highlights` SET `certificate` = 'nogic-jqs' WHERE `slug` = 'nogic-jqs' AND `certificate` = '';

INSERT IGNORE INTO `work_highlights` (slug, code, kind, body, title, logo, certificate, category, summary, scope, receive, service_slug, status, sort_order) VALUES
('bpp', 'BPP', 'Registration', 'Bureau of Public Procurement', 'Bureau of Public Procurement registration (IRR)', '', 'bpp', 'Licences & registrations',
 'Contractor registration with the BPP, which businesses need to bid for government contracts.', '[]',
 '["Your registration certificate, original plus a scanned copy","Official filing receipts and acknowledgement letters","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 7),
('tax-clearance', 'Tax Clearance', 'Certificate', 'Nigeria Revenue Service', 'Tax clearance certificate', '', 'tax-clearance', 'Licences & registrations',
 'A tax clearance certificate for a client, after bringing their filings up to date.', '[]',
 '["Your tax clearance certificate","Filing receipts and acknowledgements","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 8),
('itf', 'ITF', 'Compliance', 'Industrial Training Fund', 'Industrial Training Fund certificate of compliance', '', 'itf', 'Licences & registrations',
 'The yearly ITF certificate of compliance for an employer, from contribution to certificate.', '[]',
 '["Your certificate of compliance","Payment receipts and acknowledgements","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 9),
('ndpc-audit', 'NDPC', 'Audit filing', 'Nigeria Data Protection Commission', 'Data protection compliance audit filing', '', 'ndpc-audit', 'Licences & registrations',
 'A data protection compliance audit filing with the NDPC, prepared and submitted for a client.', '[]',
 '["Your filing acknowledgement","A copy of the audit filing","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 10),
('nsitf', 'NSITF', 'Clearance', 'NSITF', 'Employees Compensation Scheme clearance', '', 'nsitf', 'Licences & registrations',
 'An NSITF Employees Compensation Scheme clearance for an employer, handled end to end.', '[]',
 '["Your clearance certificate","Payment receipts and acknowledgements","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 11),
('nuprc', 'NUPRC', 'Permit', 'NUPRC', 'Upstream petroleum permit', '', 'nuprc', 'Licences & registrations',
 'A permit from the Nigerian Upstream Petroleum Regulatory Commission, from document checklist to approval.', '[]',
 '["Your permit","Official filing receipts and acknowledgement letters","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 12),
('nogic-jqs-consultancy', 'NOGIC (Consultancy)', 'Registration', 'NCDMB', 'NOGIC JQS registration, consultancy category', '', 'nogic-consultancy', 'Licences & registrations',
 'Registration on the NCDMB Joint Qualification System in the consultancy category.', '[]',
 '["Your registration certificate","Official filing receipts and acknowledgement letters","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 13);

CREATE TABLE IF NOT EXISTS `events` (
  `id`           INT           NOT NULL AUTO_INCREMENT,
  `slug`         VARCHAR(100)  NOT NULL,
  `title`        VARCHAR(200)  NOT NULL,
  `summary`      VARCHAR(400)  NOT NULL DEFAULT '',
  `body`         MEDIUMTEXT    NOT NULL,                      -- HTML, same editor as blog posts
  `bullets`      JSON          NOT NULL,                      -- ["what you'll learn", ...]
  `starts_at`    DATETIME      NOT NULL,                      -- Lagos time (WAT, UTC+1, no daylight saving)
  `ends_at`      DATETIME      NOT NULL,
  `venue`        VARCHAR(150)  NOT NULL DEFAULT 'Virtual',
  `register_url` VARCHAR(500)  NOT NULL DEFAULT '',
  `hashtags`     VARCHAR(200)  NOT NULL DEFAULT '',
  `image`        VARCHAR(150)  NOT NULL DEFAULT '',           -- '' | media:<file> (public/media/events) | uploaded file name
  `status`       VARCHAR(10)   NOT NULL DEFAULT 'published',  -- published | draft
  `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_slug` (`slug`),
  KEY `idx_event_status_start` (`status`, `starts_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `events` (slug, title, summary, body, bullets, starts_at, ends_at, venue, register_url, hashtags, image, status) VALUES
('tax-ready-for-2026', 'Tax-Ready for 2026',
 'A free webinar to help you understand your business tax obligations, avoid penalties and plan with confidence.',
 '<p>It is official! <strong>Tax-Ready for 2026</strong> is a free webinar built to help you understand your business tax obligations, avoid penalties and plan with confidence.</p><p>Is your business &ldquo;Tax-Ready&rdquo; for 2026?</p><p>Under Nigeria''s new tax law, which took effect on 1st January 2026, some small businesses pay 0% company income tax if they qualify. But this does not excuse them from filing their annual returns.</p><p>This is why Florence Walters Consulting came up with this free webinar, with carefully chosen expert speakers to walk you through it. It is also your chance to get your questions answered by experts and gain more clarity for your business.</p><p>Spaces are limited, so do not wait until the last minute.</p>',
 '["Who counts as a small company under the new law.","What you are exempted from and what you must still file.","How to avoid costly late filing penalties."]',
 '2026-11-26 16:00:00', '2026-11-26 17:00:00', 'Virtual',
 'https://events.teams.microsoft.com/event/7a6c3d1e-e115-44ac-b208-a40eb30ef472@2205df7a-c48b-4dfc-a420-0effe1407851',
 '#TaxReady2026 #FWCWebinar #NigeriaTax #SMEsNigeria #compliance', 'media:tax-ready-2026.webp', 'published');
