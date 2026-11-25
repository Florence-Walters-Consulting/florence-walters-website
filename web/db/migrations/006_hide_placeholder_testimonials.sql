-- 006_hide_placeholder_testimonials.sql
-- The three testimonials that came with the original template (placeholder names, stock photos) are hidden
-- from the website until real ones are ready. They are kept: show them again, or edit them, from Testimonials
-- in the admin. Runs once (the migration runner remembers it), so it never hides testimonials added later.

UPDATE `testimonials` SET `display` = 'No' WHERE `name` IN ('Andy Drake', 'Mary Momodu', 'Chinesom Njoku');
