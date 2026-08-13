// ─── Compiler map: subjectId → playground language id ────────────────────────
export const COMPILER_MAP = {
  'dsa':                'c',
  'digital-electronics':'c',
  'coa':                'c',
  'oop':                'cpp',
  'web-tech':           'html',
  'discrete-math':      'python',
  'dbms':               'python',
  'computer-networks':  'python',
  'concepts-ai':        'python',
  'foundations-ds':     'python',
  'stat-inference':     'python',
  'adv-math':           'python',
}

// ─── Subject definitions ──────────────────────────────────────────────────────
const mkSubject = (id, code, name, category, credits, hasQuiz = true, isLab = false, compiler = null) =>
  ({ id, code, name, category, credits, hasQuiz, isLab, compiler: compiler ?? COMPILER_MAP[id] ?? null })

// ─── CSE Sem 3 ────────────────────────────────────────────────────────────────
const CSE_SEM3 = [
  mkSubject('discrete-math',       '3CSE201', 'Discrete Mathematics',                          'BSC',    4),
  mkSubject('dsa',                 '3CSE401', 'Data Structures and Algorithms',                'PCC',    3),
  mkSubject('web-tech',            '3CSE402', 'Web Technologies',                             'PCC',    3),
  mkSubject('digital-electronics', '3ECE402', 'Digital Electronics',                          'PCC',    3),
  mkSubject('oop',                 '3CSE403', 'Object Oriented Programming',                  'PCC',    3),
  mkSubject('prof-practice',       '3CSE101', 'Professional Practice, Cyber Law & Ethics',    'HSMC',   3),
  mkSubject('dsa-lab',             '3CSE420', 'Data Structures Lab',                          'PCC',    2, false, true, 'c'),
  mkSubject('logic-lab',           '3ECE421', 'Logic Designing Lab',                          'PCC',    1, false, true, 'c'),
  mkSubject('oop-lab',             '3CSE421', 'Object Oriented Programming Lab',              'PCC',    1, false, true, 'cpp'),
  mkSubject('web-lab',             '3CSE422', 'Web Technologies Lab',                         'PCC',    1, false, true, 'html'),
  mkSubject('ncc-3-cse',           '3CSE800', 'NCC / Sports',                                 'SODECA', 0.5, false),
]

// ─── CSE Sem 4 ────────────────────────────────────────────────────────────────
const CSE_SEM4 = [
  mkSubject('adv-math',         '4ECE301', 'Advanced Engineering Mathematics',      'ESC',    3),
  mkSubject('coa',              '4CSE401', 'Computer Organization & Architecture',  'PCC',    3),
  mkSubject('dbms',             '4CSE402', 'Database Management System',            'PCC',    3),
  mkSubject('computer-networks','4CSE403', 'Computer Networks',                     'PCC',    3),
  mkSubject('concepts-ai',      '4CSE404', 'Concepts in Artificial Intelligence',   'PCC',    3),
  mkSubject('entrepreneurship', '4CSE511', 'Entrepreneurship for Engineers',        'PEC',    3),
  mkSubject('dbms-lab',         '4CSE420', 'Database Management Systems Lab',       'PCC',    1, false, true, 'python'),
  mkSubject('cn-lab',           '4CSE421', 'Computer Networks Lab',                'PCC',    1, false, true, 'python'),
  mkSubject('ai-lab',           '4CSE422', 'Artificial Intelligence Lab',           'PCC',    2, false, true, 'python'),
  mkSubject('webdev-python',    '4CSE423', 'Web Development using Python',          'PCC',    1, false, true, 'python'),
  mkSubject('ncc-4-cse',        '4CSE800', 'NCC / Sports',                         'SODECA', 0.5, false),
]

// ─── AIML Sem 3 ───────────────────────────────────────────────────────────────
const AIML_SEM3 = [
  mkSubject('discrete-math',  '3CSE201', 'Discrete Mathematics',                       'BSC',    4),
  mkSubject('dsa',            '3CSE401', 'Data Structures and Algorithms',             'PCC',    3),
  mkSubject('web-tech',       '3CSE402', 'Web Technologies',                          'PCC',    3),
  mkSubject('foundations-ds', '3AIM401', 'Foundations of Data Science',               'PCC',    3),
  mkSubject('oop',            '3CSE403', 'Object Oriented Programming',               'PCC',    3),
  mkSubject('prof-practice',  '3CSE101', 'Professional Practice, Cyber Law & Ethics', 'HSMC',   3),
  mkSubject('dsa-lab-aiml',   '3CSE420', 'Data Structures Lab',                       'PCC',    2, false, true, 'c'),
  mkSubject('ds-lab',         '3AIM420', 'Data Science Lab',                          'PCC',    1, false, true, 'python'),
  mkSubject('oop-lab-aiml',   '3CSE421', 'Object Oriented Programming Lab',           'PCC',    1, false, true, 'cpp'),
  mkSubject('web-lab-aiml',   '3CSE422', 'Web Technologies Lab',                      'PCC',    1, false, true, 'html'),
  mkSubject('ncc-3-aiml',     '3AIM800', 'NCC / Sports',                              'SODECA', 0.5, false),
]

// ─── AIML Sem 4 ───────────────────────────────────────────────────────────────
const AIML_SEM4 = [
  mkSubject('adv-math',          '4ECE301', 'Advanced Engineering Mathematics',     'ESC',    3),
  mkSubject('stat-inference',    '4AIM401', 'Statistical Inference',                'PCC',    3),
  mkSubject('dbms',              '4CSE402', 'Database Management System',           'PCC',    3),
  mkSubject('computer-networks', '4CSE403', 'Computer Networks',                    'PCC',    3),
  mkSubject('concepts-ai',       '4CSE404', 'Concepts in Artificial Intelligence',  'PCC',    3),
  mkSubject('entrepreneurship',  '4CSE511', 'Entrepreneurship for Engineers',       'PEC',    3),
  mkSubject('dbms-lab-aiml4',    '4CSE420', 'Database Management Systems Lab',      'PCC',    1, false, true, 'python'),
  mkSubject('stat-lab',          '4AIM420', 'Statistical Inference Lab',            'PCC',    1, false, true, 'python'),
  mkSubject('ai-lab-aiml4',      '4CSE422', 'Artificial Intelligence Lab',          'PCC',    2, false, true, 'python'),
  mkSubject('ncc-4-aiml',        '4AIM800', 'NCC / Sports',                        'SODECA', 0.5, false),
]

// ─── Programs export ──────────────────────────────────────────────────────────
export const programs = {
  'B.Tech CSE': {
    fullName: 'Computer Science & Engineering',
    color: '#6c47ff',
    icon: '💻',
    years: [2],
    semesters: {
      3: { label: 'Semester 3 (II Year)', subjects: CSE_SEM3 },
      4: { label: 'Semester 4 (II Year)', subjects: CSE_SEM4 },
    },
  },
  'B.Tech AIML': {
    fullName: 'Artificial Intelligence & Machine Learning',
    color: '#a855f7',
    icon: '🤖',
    years: [2],
    semesters: {
      3: { label: 'Semester 3 (II Year)', subjects: AIML_SEM3 },
      4: { label: 'Semester 4 (II Year)', subjects: AIML_SEM4 },
    },
  },
}

// ─── Flat subject name lookup ─────────────────────────────────────────────────
export const SUBJECT_NAMES = {}
Object.values(programs).forEach(p =>
  Object.values(p.semesters).forEach(s =>
    s.subjects.forEach(sub => { SUBJECT_NAMES[sub.id] = sub.name })
  )
)

// ─── Category colours ─────────────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  BSC:    { bg: '#eff6ff', color: '#2563eb' },
  PCC:    { bg: '#f5f3ff', color: '#6c47ff' },
  ESC:    { bg: '#ecfdf5', color: '#059669' },
  HSMC:   { bg: '#fff7ed', color: '#d97706' },
  PEC:    { bg: '#fef2f2', color: '#dc2626' },
  SODECA: { bg: '#f1f5f9', color: '#64748b' },
}

// ─── Compiler display names ───────────────────────────────────────────────────
export const COMPILER_LABELS = {
  c:      { label: 'C',           icon: '🔧', color: '#3b82f6' },
  cpp:    { label: 'C++',         icon: '⚙️', color: '#6c47ff' },
  html:   { label: 'HTML/CSS/JS', icon: '🌐', color: '#f59e0b' },
  python: { label: 'Python',      icon: '🐍', color: '#22c55e' },
}
