-- 004_work_highlights.sql
-- Work highlights shown on /work and the home page, managed in the admin. Safe to run more than once
-- (the seed uses INSERT IGNORE on the unique slug, so it never duplicates or overwrites edits).
-- Client names are never stored: these describe the kind of outcome, not a person.

CREATE TABLE IF NOT EXISTS `work_highlights` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `slug`         VARCHAR(80)  NOT NULL,                      -- stable, used in /work#slug links
  `code`         VARCHAR(60)  NOT NULL,                      -- e.g. SCUML
  `kind`         VARCHAR(60)  NOT NULL,                      -- Registration | Incorporation | ...
  `body`         VARCHAR(150) NOT NULL,                      -- issuing body, e.g. EFCC
  `title`        VARCHAR(255) NOT NULL,                      -- full name of the certificate
  `logo`         VARCHAR(100) NOT NULL DEFAULT '',           -- '' | built-in key (cac) | upload:<file>
  `category`     VARCHAR(40)  NOT NULL,
  `summary`      VARCHAR(400) NOT NULL DEFAULT '',
  `scope`        JSON         NOT NULL,                      -- [{t, d}]; empty = use the service's standard process
  `receive`      JSON         NOT NULL,                      -- ["..."]
  `service_slug` VARCHAR(80)  NOT NULL,
  `status`       VARCHAR(10)  NOT NULL DEFAULT 'published',  -- published | draft
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_work_slug` (`slug`),
  KEY `idx_work_status_order` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `work_highlights` (slug, code, kind, body, title, logo, category, summary, scope, receive, service_slug, status, sort_order) VALUES
('scuml', 'SCUML', 'Registration', 'EFCC', 'Special Control Unit against Money Laundering', 'scuml', 'Licences & registrations',
 'SCUML registration for a client, from document checklist to EFCC certificate, handled end to end.', '[]',
 '["Your licence, permit or certificate, original plus a scanned copy","Official filing receipts and acknowledgement letters","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 1),
('cac', 'CAC', 'Incorporation', 'Corporate Affairs Commission', 'Private company limited by shares', 'cac', 'Company formation',
 'Incorporation of a private company limited by shares, from name search to a complete, bank-ready pack.', '[]',
 '["Certificate of Incorporation, with your RC number","Memorandum & Articles of Association","CAC status report","Tax Identification Number (TIN)"]',
 'business-formation-corporate-services', 'published', 2),
('nogic-jqs', 'NOGIC JQS', 'Registration', 'NCDMB', 'Nigerian Oil & Gas Industry Content Joint Qualification System', '', 'Licences & registrations',
 'Registration on the NCDMB Joint Qualification System, which oil and gas contractors and suppliers need to bid for work.', '[]',
 '["Your licence, permit or certificate, original plus a scanned copy","Official filing receipts and acknowledgement letters","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 3),
('nafdac', 'NAFDAC', 'Registration', 'NAFDAC', 'Product registration', 'nafdac', 'Licences & registrations',
 'NAFDAC product registration for a business selling food, drinks, drugs or cosmetics.', '[]',
 '["Your licence, permit or certificate, original plus a scanned copy","Official filing receipts and acknowledgement letters","Copies of everything we filed, organised and labelled","Written status updates at each stage"]',
 'regulatory-licensing-compliance', 'published', 4),
('trademark', 'Trademark', 'Registration', 'Trademarks Registry', 'Registered trademark, Nigeria', '', 'Intellectual property',
 'A brand registered in the owner''s name: availability search, filing and follow-up through to the certificate.',
 '[{"t":"Search","d":"An availability search and the right classes for your goods or services."},{"t":"Filing","d":"The application filed at the Trademarks Registry."},{"t":"Acceptance","d":"We follow up with the Registry and answer any queries."},{"t":"Publication","d":"The mark is published in the Trademarks Journal so third parties can oppose it. We watch for oppositions."},{"t":"Certificate","d":"The certificate and every filing receipt handed over."}]',
 '["Trademark search report","Filing acknowledgement, acceptance and certificate as they issue","Copies of everything we filed"]',
 'contracts-ip-governance', 'published', 5);
