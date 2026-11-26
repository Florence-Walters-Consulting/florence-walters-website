-- 002_activity_log.sql
-- Records who changed what in the admin, for the "Recent activity" feed on the overview page.
-- Safe to run more than once. Apply on every environment:  sudo mysql florencewalters < 002_activity_log.sql

CREATE TABLE IF NOT EXISTS `admin_activity` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `admin_id`   INT          NULL,
  `admin_name` VARCHAR(50)  NOT NULL,
  `kind`       VARCHAR(20)  NOT NULL DEFAULT 'other',  -- create | update | delete | auth | other
  `message`    VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_activity_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
