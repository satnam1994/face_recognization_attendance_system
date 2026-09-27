-- Demo cohort: four MCA classes, one teacher per class, and five students per class.
-- All demo accounts use the existing password123 demo password.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS roll_number VARCHAR(32);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_roll_number_unique
  ON users (roll_number)
  WHERE roll_number IS NOT NULL;

INSERT INTO users (name, email, password_hash, role, roll_number, is_active)
VALUES
  ('Dr. Asha Mehta', 'mca1.teacher@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'teacher', NULL, true),
  ('Prof. Vikram Rao', 'mca2.teacher@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'teacher', NULL, true),
  ('Dr. Neha Kapoor', 'mca3.teacher@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'teacher', NULL, true),
  ('Prof. Arjun Desai', 'mca4.teacher@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'teacher', NULL, true),
  ('Aarav Sharma', 'mca1.student01@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA1-001', true),
  ('Diya Patel', 'mca1.student02@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA1-002', true),
  ('Rohan Verma', 'mca1.student03@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA1-003', true),
  ('Ananya Singh', 'mca1.student04@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA1-004', true),
  ('Kabir Mehta', 'mca1.student05@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA1-005', true),
  ('Ishaan Gupta', 'mca2.student01@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA2-001', true),
  ('Meera Nair', 'mca2.student02@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA2-002', true),
  ('Aditya Joshi', 'mca2.student03@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA2-003', true),
  ('Sara Khan', 'mca2.student04@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA2-004', true),
  ('Dev Malhotra', 'mca2.student05@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA2-005', true),
  ('Vivaan Shah', 'mca3.student01@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA3-001', true),
  ('Ira Iyer', 'mca3.student02@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA3-002', true),
  ('Arjun Reddy', 'mca3.student03@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA3-003', true),
  ('Kiara Bose', 'mca3.student04@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA3-004', true),
  ('Reyansh Kulkarni', 'mca3.student05@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA3-005', true),
  ('Atharv Rao', 'mca4.student01@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA4-001', true),
  ('Anika Chawla', 'mca4.student02@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA4-002', true),
  ('Krish Patel', 'mca4.student03@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA4-003', true),
  ('Myra Fernandes', 'mca4.student04@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA4-004', true),
  ('Samar Sethi', 'mca4.student05@demo.test', '$2a$12$MAtc00Zay3jn0FhZYt/uy.DbmVY/JMYJrStamAfLfCZyGAbJRwcfG', 'student', 'MCA4-005', true)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    roll_number = EXCLUDED.roll_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO classes (id, name, department, semester, academic_year, admin_id)
VALUES
  ('d4000000-0000-4000-8000-000000000001', 'MCA 1', 'Master of Computer Applications', 'Semester 1', '2026-27', (SELECT id FROM users WHERE email = 'admin@school.com')),
  ('d4000000-0000-4000-8000-000000000002', 'MCA 2', 'Master of Computer Applications', 'Semester 2', '2026-27', (SELECT id FROM users WHERE email = 'admin@school.com')),
  ('d4000000-0000-4000-8000-000000000003', 'MCA 3', 'Master of Computer Applications', 'Semester 3', '2026-27', (SELECT id FROM users WHERE email = 'admin@school.com')),
  ('d4000000-0000-4000-8000-000000000004', 'MCA 4', 'Master of Computer Applications', 'Semester 4', '2026-27', (SELECT id FROM users WHERE email = 'admin@school.com'))
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    department = EXCLUDED.department,
    semester = EXCLUDED.semester,
    academic_year = EXCLUDED.academic_year,
    admin_id = EXCLUDED.admin_id;

INSERT INTO subjects (name, code, class_id, teacher_id)
SELECT seed.name, seed.code, seed.class_id, teacher.id
FROM (VALUES
  ('Programming Fundamentals', 'MCA1-DEMO-01', 'd4000000-0000-4000-8000-000000000001'::UUID, 'mca1.teacher@demo.test'),
  ('Data Structures', 'MCA2-DEMO-01', 'd4000000-0000-4000-8000-000000000002'::UUID, 'mca2.teacher@demo.test'),
  ('Database Management Systems', 'MCA3-DEMO-01', 'd4000000-0000-4000-8000-000000000003'::UUID, 'mca3.teacher@demo.test'),
  ('Machine Learning', 'MCA4-DEMO-01', 'd4000000-0000-4000-8000-000000000004'::UUID, 'mca4.teacher@demo.test')
) AS seed(name, code, class_id, teacher_email)
JOIN users AS teacher ON teacher.email = seed.teacher_email
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    class_id = EXCLUDED.class_id,
    teacher_id = EXCLUDED.teacher_id;

INSERT INTO class_enrollments (student_id, class_id)
SELECT student.id, seed.class_id
FROM (VALUES
  ('mca1.student01@demo.test', 'd4000000-0000-4000-8000-000000000001'::UUID),
  ('mca1.student02@demo.test', 'd4000000-0000-4000-8000-000000000001'::UUID),
  ('mca1.student03@demo.test', 'd4000000-0000-4000-8000-000000000001'::UUID),
  ('mca1.student04@demo.test', 'd4000000-0000-4000-8000-000000000001'::UUID),
  ('mca1.student05@demo.test', 'd4000000-0000-4000-8000-000000000001'::UUID),
  ('mca2.student01@demo.test', 'd4000000-0000-4000-8000-000000000002'::UUID),
  ('mca2.student02@demo.test', 'd4000000-0000-4000-8000-000000000002'::UUID),
  ('mca2.student03@demo.test', 'd4000000-0000-4000-8000-000000000002'::UUID),
  ('mca2.student04@demo.test', 'd4000000-0000-4000-8000-000000000002'::UUID),
  ('mca2.student05@demo.test', 'd4000000-0000-4000-8000-000000000002'::UUID),
  ('mca3.student01@demo.test', 'd4000000-0000-4000-8000-000000000003'::UUID),
  ('mca3.student02@demo.test', 'd4000000-0000-4000-8000-000000000003'::UUID),
  ('mca3.student03@demo.test', 'd4000000-0000-4000-8000-000000000003'::UUID),
  ('mca3.student04@demo.test', 'd4000000-0000-4000-8000-000000000003'::UUID),
  ('mca3.student05@demo.test', 'd4000000-0000-4000-8000-000000000003'::UUID),
  ('mca4.student01@demo.test', 'd4000000-0000-4000-8000-000000000004'::UUID),
  ('mca4.student02@demo.test', 'd4000000-0000-4000-8000-000000000004'::UUID),
  ('mca4.student03@demo.test', 'd4000000-0000-4000-8000-000000000004'::UUID),
  ('mca4.student04@demo.test', 'd4000000-0000-4000-8000-000000000004'::UUID),
  ('mca4.student05@demo.test', 'd4000000-0000-4000-8000-000000000004'::UUID)
) AS seed(student_email, class_id)
JOIN users AS student ON student.email = seed.student_email
ON CONFLICT (student_id, class_id) DO NOTHING;
