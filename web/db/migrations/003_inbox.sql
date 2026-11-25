-- 003_inbox.sql
-- The admin Inbox: every contact enquiry, business assessment and paid-consultation request is saved here
-- (it is still e-mailed as before). Safe to run more than once. Apply on every environment.

CREATE TABLE IF NOT EXISTS `leads` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `type`       VARCHAR(20)  NOT NULL,                     -- contact | assessment | consultation
  `status`     VARCHAR(20)  NOT NULL DEFAULT 'new',       -- new | reviewing | qualified | closed
  `priority`   VARCHAR(10)  NOT NULL DEFAULT 'normal',    -- normal | urgent
  `name`       VARCHAR(200) NOT NULL,
  `email`      VARCHAR(254) NOT NULL,
  `phone`      VARCHAR(50)  NOT NULL DEFAULT '',
  `company`    VARCHAR(150) NOT NULL DEFAULT '',
  `subject`    VARCHAR(255) NOT NULL DEFAULT '',          -- service interest / consultation type
  `summary`    VARCHAR(400) NOT NULL DEFAULT '',          -- first lines of the message, for lists
  `details`    JSON         NOT NULL,                     -- [{label, value}] as shown in the detail view
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_type` (`type`),
  KEY `idx_leads_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lead_notes` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `lead_id`    INT          NOT NULL,
  `admin_name` VARCHAR(50)  NOT NULL,
  `note`       TEXT         NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lead_notes_lead` (`lead_id`),
  CONSTRAINT `fk_lead_notes_lead` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
