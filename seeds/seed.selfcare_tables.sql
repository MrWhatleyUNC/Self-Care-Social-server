BEGIN;

TRUNCATE
  selfcare_comments,
  selfcare_posts,
  selfcare_users
  RESTART IDENTITY CASCADE;

INSERT INTO selfcare_users (username, email, password, admin)
VALUES
  ('MrWhatley', 'mrwhatleyunc@gmail.com', '$2a$10$cpSKcSR6KuxC9d4bxbb4zuEu3aBuZUHwOBMhXTaKIK2KdahLmzbzO', 'TRUE'),
  ('test1','test1@thinkful.com','$2a$10$gejN0Oofyw6q3bOFBrkmmuUurrJfFpD8EAd2J3Od0cnemISdlDWrq','FALSE'),
  ('test2','test2@thinkful.com','$2a$10$ixH6tLKBTLJcFwEMblFiY.qEQ4BwAs/W9vzTFReQOvspTg2S1cPiG','FALSE'),
  ('test3','test3@thinkful.com','$2a$10$HQXHtVEN0Fipq4s5Hpil4.B4sZKVIZf.7XwhPw5Z2MWPoFqEAnC4W','FALSE');

INSERT INTO selfcare_posts (text, user_id)
VALUES
  ('I hate making fake data',1),
  ('post1',2),
  ('post2',3),
  ('post3',4);

INSERT INTO selfcare_comments (text, user_id, post_id)
VALUES
  ('Although I, test1, am fake, I agree', 2, 1),
  ('fake comment on post1 by test3', 4, 2),
  ('fake comment on post2 by Me', 1, 3),
  ('fake comment on post3 by test2',3, 4);

COMMIT;