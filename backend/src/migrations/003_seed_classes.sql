-- ─── Seed: Classes, Subjects, Enrollments ────────────────────────────────────
-- Resolve seeded users by their stable email addresses instead of environment-specific IDs.

-- ─── Classes ─────────────────────────────────────────────────────────────────
INSERT INTO classes (id, name, department, semester, academic_year, admin_id)
VALUES
  (
    'aaaaaaaa-0001-4000-a000-000000000001',
    'Computer Science - A',
    'Computer Science',
    'Semester 5',
    '2024-25',
    (SELECT id FROM users WHERE email = 'admin@test.com')
  ),
  (
    'aaaaaaaa-0002-4000-a000-000000000002',
    'Information Technology - B',
    'Information Technology',
    'Semester 3',
    '2024-25',
    (SELECT id FROM users WHERE email = 'admin@test.com')
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Subjects ────────────────────────────────────────────────────────────────
INSERT INTO subjects (id, name, code, class_id, teacher_id)
VALUES
  (
    'bbbbbbbb-0001-4000-b000-000000000001',
    'Data Structures & Algorithms',
    'CS501',
    'aaaaaaaa-0001-4000-a000-000000000001',
    (SELECT id FROM users WHERE email = 'teacher@test.com')
  ),
  (
    'bbbbbbbb-0002-4000-b000-000000000002',
    'Operating Systems',
    'CS502',
    'aaaaaaaa-0001-4000-a000-000000000001',
    (SELECT id FROM users WHERE email = 'teacher@test.com')
  ),
  (
    'bbbbbbbb-0003-4000-b000-000000000003',
    'Database Management Systems',
    'CS503',
    'aaaaaaaa-0001-4000-a000-000000000001',
    (SELECT id FROM users WHERE email = 'teacher@test.com')
  ),
  (
    'bbbbbbbb-0004-4000-b000-000000000004',
    'Web Technologies',
    'IT301',
    'aaaaaaaa-0002-4000-a000-000000000002',
    (SELECT id FROM users WHERE email = 'teacher@test.com')
  ),
  (
    'bbbbbbbb-0005-4000-b000-000000000005',
    'Computer Networks',
    'IT302',
    'aaaaaaaa-0002-4000-a000-000000000002',
    (SELECT id FROM users WHERE email = 'teacher@test.com')
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Enroll student in both classes ──────────────────────────────────────────
INSERT INTO class_enrollments (student_id, class_id)
VALUES
  (
    (SELECT id FROM users WHERE email = 'student@test.com'),
    'aaaaaaaa-0001-4000-a000-000000000001'
  ),
  (
    (SELECT id FROM users WHERE email = 'student@test.com'),
    'aaaaaaaa-0002-4000-a000-000000000002'
  )
ON CONFLICT (student_id, class_id) DO NOTHING;
