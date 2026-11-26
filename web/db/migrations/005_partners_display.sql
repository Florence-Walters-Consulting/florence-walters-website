-- 005_partners_display.sql
-- Regulator logos get a name (for accessibility) and a show/hide switch. The migration runner applies it once;
-- do not re-run it by hand after re-showing an old logo, as it hides the original uploads again.

SET @has := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'partners' AND column_name = 'display');
SET @stmt := IF(@has = 0,
  'ALTER TABLE `partners` ADD COLUMN `name` VARCHAR(100) NOT NULL DEFAULT \'\', ADD COLUMN `display` VARCHAR(10) NOT NULL DEFAULT \'Yes\'',
  'DO 0');
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- Name the logos that already exist, and hide the original uploads: they are screenshots with a visible
-- search-lens icon, grey or dotted backgrounds and mixed shapes. They are hidden, not deleted: show any of
-- them again from Regulators in the admin.
UPDATE `partners` SET `name` = 'Nigeria Revenue Service (NRS)' WHERE `picture` = '0868aabacd.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'NAFDAC' WHERE `picture` = '11a242786e.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'FCCPC' WHERE `picture` = '48d5bf3a51.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'Securities and Exchange Commission (SEC)' WHERE `picture` = '75994d40b3.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'FIRS' WHERE `picture` = '7c8bdcaf6d.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'SCUML' WHERE `picture` = '8b2ef98357.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'Bureau of Public Procurement (BPP)' WHERE `picture` = 'b260de5e10.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'Nigeria Data Protection Commission (NDPC)' WHERE `picture` = 'da4c2316cd.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'National Insurance Commission (NAICOM)' WHERE `picture` = 'db2c144920.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'SCUML' WHERE `picture` = 'e56ee9e8b5.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'Nigeria Deposit Insurance Corporation (NDIC)' WHERE `picture` = 'eb589d832b.jpeg' AND `name` = '';
UPDATE `partners` SET `name` = 'Nigeria Social Insurance Trust Fund (NSITF)' WHERE `picture` = 'f70401c557.jpeg' AND `name` = '';
UPDATE `partners` SET `display` = 'No' WHERE `picture` IN ('0868aabacd.jpeg', '11a242786e.jpeg', '48d5bf3a51.jpeg', '75994d40b3.jpeg', '7c8bdcaf6d.jpeg', '8b2ef98357.jpeg', 'b260de5e10.jpeg', 'da4c2316cd.jpeg', 'db2c144920.jpeg', 'e56ee9e8b5.jpeg', 'eb589d832b.jpeg', 'f70401c557.jpeg') AND `name` <> '' AND `display` = 'Yes';

-- Clean, consistently sized logos (files in site_img/partners).
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-cac.webp', 'Corporate Affairs Commission (CAC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-cac.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nrs.webp', 'Nigeria Revenue Service (NRS)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nrs.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-scuml.webp', 'SCUML, EFCC', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-scuml.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nafdac.webp', 'NAFDAC', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nafdac.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-cbn.webp', 'Central Bank of Nigeria (CBN)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-cbn.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-sec.webp', 'Securities and Exchange Commission (SEC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-sec.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-naicom.webp', 'National Insurance Commission (NAICOM)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-naicom.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-pencom.webp', 'National Pension Commission (PenCom)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-pencom.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-ncc.webp', 'Nigerian Communications Commission (NCC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-ncc.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nerc.webp', 'Nigerian Electricity Regulatory Commission (NERC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nerc.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-ndpc.webp', 'Nigeria Data Protection Commission (NDPC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-ndpc.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nuprc.webp', 'Nigerian Upstream Petroleum Regulatory Commission (NUPRC)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nuprc.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nmdpra.webp', 'Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nmdpra.webp');
INSERT INTO `partners` (`picture`, `name`, `display`) SELECT 'reg-nimasa.webp', 'Nigerian Maritime Administration and Safety Agency (NIMASA)', 'Yes' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `partners` WHERE `picture` = 'reg-nimasa.webp');
