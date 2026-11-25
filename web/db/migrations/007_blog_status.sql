-- 007_blog_status.sql
-- Blog posts can be saved as drafts (not shown on the website). Existing posts stay published.
-- Safe to run more than once.

SET @has := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'blog' AND column_name = 'status');
SET @stmt := IF(@has = 0,
  'ALTER TABLE `blog` ADD COLUMN `status` VARCHAR(10) NOT NULL DEFAULT \'published\'',
  'DO 0');
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;
