-- 001_cleanup.sql
-- Applied AFTER importing the original florencewalters.sql dump (which is kept unchanged).
-- Changes only storage engine and indexes. No column types, names or data are touched.

-- 1. MyISAM -> InnoDB (the dump mixes engines; only `services` was InnoDB).
ALTER TABLE `admin`             ENGINE=InnoDB;
ALTER TABLE `blog`              ENGINE=InnoDB;
ALTER TABLE `blog_categories`   ENGINE=InnoDB;
ALTER TABLE `categories`        ENGINE=InnoDB;
ALTER TABLE `comments`          ENGINE=InnoDB;
ALTER TABLE `email_subscribers` ENGINE=InnoDB;
ALTER TABLE `faqs`              ENGINE=InnoDB;
ALTER TABLE `gallery1`          ENGINE=InnoDB;
ALTER TABLE `general_images`    ENGINE=InnoDB;
ALTER TABLE `notifications`     ENGINE=InnoDB;
ALTER TABLE `partners`          ENGINE=InnoDB;
ALTER TABLE `picture_slider`    ENGINE=InnoDB;
ALTER TABLE `projects`          ENGINE=InnoDB;
ALTER TABLE `team`              ENGINE=InnoDB;
ALTER TABLE `testimonials`      ENGINE=InnoDB;

-- 2. Slug lookups (blog-single, service-single) were full table scans.
--    slug is MEDIUMTEXT, so a prefix length is required. Not UNIQUE: existing data is
--    not guaranteed unique and the admin generates slugs without a uniqueness check.
ALTER TABLE `blog`     ADD INDEX `idx_blog_slug` (`slug`(191));
ALTER TABLE `services` ADD INDEX `idx_services_slug` (`slug`(191));

-- 3. blog.blog_id is the key comments reference.
ALTER TABLE `blog` ADD INDEX `idx_blog_blog_id` (`blog_id`);

-- 4. newsletter: subscribe.php already treated a duplicate as SQLSTATE 23000,
--    but the table had no UNIQUE key, so duplicates were never actually rejected.
--    (Table is empty in the dump. On a table with duplicates this statement would fail.)
ALTER TABLE `email_subscribers` ADD UNIQUE KEY `uq_email_subscribers_email` (`email`);
