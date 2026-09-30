import type { Course, DB, Enrollment, Lesson, LessonType, Order, Review, Section, User } from './types'

export const DEMO_PASSWORD = 'demo123'

export const CATEGORIES = [
  'Communication',
  'Development',
  'Data Science',
  'Business',
  'Music & Arts',
  'Engineering',
  'Health Science',
  'Law & Justice',
]

const users: User[] = [
  { id: 'u-admin', avatar: '/img/p-maya.jpg', name: 'Maya Rao', email: 'admin@revive.dev', password: DEMO_PASSWORD, role: 'admin', status: 'active', joined: '2024-01-04', headline: 'Platform Operations' },
  { id: 'u-t1', avatar: '/img/p-daniel.jpg', name: 'Daniel Reyes', email: 'tutor@revive.dev', password: DEMO_PASSWORD, role: 'tutor', status: 'active', joined: '2024-02-11', headline: 'Senior Software Engineer · 12 yrs', bio: 'Daniel has shipped products at two unicorns and has taught more than 18,000 developers how to build for the web. He loves clean architecture and cleaner explanations.' },
  { id: 'u-t2', avatar: '/img/p-priya.jpg', name: 'Claire Donovan', email: 'claire@revive.dev', password: DEMO_PASSWORD, role: 'tutor', status: 'active', joined: '2024-03-02', headline: 'Communication Coach & TEDx Speaker', bio: 'Claire coaches executives and first-time managers on clear, confident communication. Former broadcast journalist.' },
  { id: 'u-t3', avatar: '/img/p-lucas.jpg', name: 'Lucas Ferreira', email: 'lucas@revive.dev', password: DEMO_PASSWORD, role: 'tutor', status: 'active', joined: '2024-04-18', headline: 'Data Scientist · ex-Fintech', bio: 'Lucas builds forecasting models by day and teaches the math behind them by night, with an emphasis on intuition first.' },
  { id: 'u-t4', avatar: '/img/p-aisha.jpg', name: 'Aisha Bello', email: 'aisha@revive.dev', password: DEMO_PASSWORD, role: 'tutor', status: 'active', joined: '2024-05-07', headline: 'Composer & Music Producer', bio: 'Aisha scores short films and has produced for independent artists across three continents.' },
  { id: 'u-s1', avatar: '/img/p-alex.jpg', name: 'Alex Morgan', email: 'student@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'active', joined: '2025-01-15', headline: 'Aspiring full-stack developer' },
  { id: 'u-s2', avatar: '/img/p-jordan.jpg', name: 'Jordan Lee', email: 'jordan@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'active', joined: '2025-02-20' },
  { id: 'u-s3', avatar: '/img/p-sam.jpg', name: 'Sam Patel', email: 'sam@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'active', joined: '2025-03-09' },
  { id: 'u-s4', avatar: '/img/p-riley.jpg', name: 'Riley Chen', email: 'riley@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'suspended', joined: '2025-04-01' },
  { id: 'u-s5', avatar: '/img/p-taylor.jpg', name: 'Taylor Brooks', email: 'taylor@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'active', joined: '2025-06-22' },
  { id: 'u-s6', avatar: '/img/p-casey.jpg', name: 'Casey Nguyen', email: 'casey@revive.dev', password: DEMO_PASSWORD, role: 'student', status: 'active', joined: '2025-08-30' },
]

type LessonDef = [title: string, minutes: number, type?: LessonType, preview?: boolean]

function build(courseId: string, sections: [string, LessonDef[]][]): Section[] {
  return sections.map(([title, lessons], si) => ({
    id: `${courseId}-s${si + 1}`,
    title,
    lessons: lessons.map(([t, minutes, type = 'video', preview], li): Lesson => ({
      id: `${courseId}-s${si + 1}-l${li + 1}`,
      title: t,
      minutes,
      type,
      preview,
    })),
  }))
}

const courses: Course[] = [
  {
    id: 'fullstack-web', image: '/img/c-fullstack.jpg', title: 'Full Stack Web Development', subtitle: 'From HTML to deployed React + Node apps — the complete, job-ready path.',
    category: 'Development', level: 'All levels', price: 2500, rating: 4.9, reviews: 1284, students: 9120, tutorId: 'u-t1', status: 'published', hue: 145, bestseller: true, updated: '2026-08-12',
    description: 'A structured, project-based journey through modern web development. You will build and deploy five real applications, learn how teams actually ship software, and finish with a portfolio that speaks for itself.',
    outcomes: ['Build responsive interfaces with HTML, CSS and modern JavaScript', 'Create single-page apps with React and TypeScript', 'Design REST APIs with Node.js and a relational database', 'Deploy, monitor and iterate on production apps', 'Work with Git, code review and CI like a professional team'],
    requirements: ['A computer with internet access', 'No prior programming experience required'],
    curriculum: build('fullstack-web', [
      ['Getting started', [['Welcome & how this course works', 6, 'video', true], ['Setting up your dev environment', 14, 'video', true], ['How the web works', 18]]],
      ['HTML & CSS foundations', [['Semantic HTML', 22], ['Layouts with Flexbox & Grid', 31], ['Responsive design', 26], ['Checkpoint quiz', 10, 'quiz']]],
      ['JavaScript essentials', [['Values, types & functions', 28], ['Working with the DOM', 34], ['Async JavaScript & fetch', 30], ['Cheat sheet', 8, 'reading']]],
      ['React & TypeScript', [['Components & props', 25], ['State, effects & data flow', 33], ['Routing & forms', 29], ['Project: Task board', 45]]],
      ['Back end & deployment', [['Node & Express APIs', 36], ['Databases & SQL', 40], ['Auth basics', 27], ['Ship it: deploying to the cloud', 24], ['Final assessment', 20, 'quiz']]],
    ]),
  },
  {
    id: 'comm-basic', image: '/img/c-comm-basic.jpg', title: 'Communication Skills — Basic', subtitle: 'Speak clearly, listen actively and write messages people actually read.',
    category: 'Communication', level: 'Beginner', price: 250, rating: 4.8, reviews: 642, students: 5230, tutorId: 'u-t2', status: 'published', hue: 28, bestseller: true, updated: '2026-07-02',
    description: 'The fundamentals of effective workplace communication in four focused hours. Practical frameworks, short exercises and real scenarios you can use the very next day.',
    outcomes: ['Structure what you say with simple frameworks', 'Listen actively and ask better questions', 'Write concise emails and messages', 'Handle small talk and introductions with confidence'],
    requirements: ['None — just a willingness to practise'],
    curriculum: build('comm-basic', [
      ['Foundations', [['Why communication is a skill', 8, 'video', true], ['The sender–receiver model', 12]]],
      ['Speaking', [['The PREP framework', 18], ['Voice, pace & pauses', 16], ['Practice: 60-second intro', 10, 'reading']]],
      ['Listening & writing', [['Active listening', 20], ['Writing for busy readers', 22], ['Quick quiz', 8, 'quiz']]],
    ]),
  },
  {
    id: 'comm-advanced', image: '/img/c-comm-adv.jpg', title: 'Communication Skills — Advanced', subtitle: 'Persuade, present and navigate difficult conversations with composure.',
    category: 'Communication', level: 'Advanced', price: 400, rating: 4.9, reviews: 318, students: 2140, tutorId: 'u-t2', status: 'published', hue: 12, updated: '2026-06-18',
    description: 'Level up from clear to compelling. Learn storytelling for presentations, stakeholder influence, negotiation basics and how to stay calm in high-stakes conversations.',
    outcomes: ['Tell stories that make data memorable', 'Present to executives with confidence', 'Navigate conflict and difficult feedback', 'Negotiate outcomes that work for both sides'],
    requirements: ['Communication Skills — Basic or equivalent experience'],
    curriculum: build('comm-advanced', [
      ['Influence', [['The psychology of persuasion', 16, 'video', true], ['Mapping stakeholders', 14]]],
      ['Presenting', [['Story structure for talks', 22], ['Designing slides that support you', 18], ['Handling Q&A', 15]]],
      ['Hard conversations', [['Giving & receiving feedback', 20], ['De-escalation techniques', 19], ['Negotiation essentials', 24], ['Capstone reflection', 10, 'reading']]],
    ]),
  },
  {
    id: 'python-data', image: '/img/c-python.jpg', title: 'Python for Data Analysis', subtitle: 'Clean, explore and visualise data with pandas — no math degree required.',
    category: 'Data Science', level: 'Beginner', price: 480, rating: 4.7, reviews: 905, students: 6410, tutorId: 'u-t3', status: 'published', hue: 205, bestseller: true, updated: '2026-09-01',
    description: 'Go from spreadsheet user to confident analyst. Using real datasets you will learn pandas, charting and the habits that make analysis reproducible.',
    outcomes: ['Load and clean messy datasets', 'Aggregate and reshape data with pandas', 'Build clear charts with matplotlib', 'Communicate findings in a notebook report'],
    requirements: ['Basic computer skills', 'Curiosity about data'],
    curriculum: build('python-data', [
      ['Python crash course', [['Why Python for data', 7, 'video', true], ['Variables, lists & dicts', 24], ['Functions & loops', 22]]],
      ['pandas', [['DataFrames 101', 28], ['Cleaning messy data', 32], ['Group-by & pivots', 30]]],
      ['Visualisation & reporting', [['Charts that tell the truth', 26], ['Notebook storytelling', 18], ['Final project brief', 6, 'reading']]],
    ]),
  },
  {
    id: 'ml-foundations', image: '/img/c-ml.jpg', title: 'Machine Learning Foundations', subtitle: 'Understand and build the models behind modern AI, intuition first.',
    category: 'Data Science', level: 'Intermediate', price: 890, rating: 4.8, reviews: 411, students: 3020, tutorId: 'u-t3', status: 'published', hue: 250, updated: '2026-08-20',
    description: 'Regression, classification, trees, evaluation and a gentle introduction to neural networks — explained visually and implemented from scratch before we reach for libraries.',
    outcomes: ['Explain how common ML models learn', 'Train and evaluate models with scikit-learn', 'Avoid overfitting and data leakage', 'Frame business problems as ML problems'],
    requirements: ['Python for Data Analysis or equivalent'],
    curriculum: build('ml-foundations', [
      ['Thinking in models', [['What “learning” means', 12, 'video', true], ['Train, validate, test', 18]]],
      ['Core algorithms', [['Linear & logistic regression', 34], ['Decision trees & forests', 30], ['Clustering', 26]]],
      ['Going further', [['Metrics that matter', 22], ['Intro to neural networks', 36], ['Quiz', 12, 'quiz']]],
    ]),
  },
  {
    id: 'startup-finance', image: '/img/c-finance.jpg', title: 'Business Finance for Founders', subtitle: 'Read the numbers, build a model and talk to investors with confidence.',
    category: 'Business', level: 'Beginner', price: 350, rating: 4.6, reviews: 207, students: 1580, tutorId: 'u-t1', status: 'published', hue: 45, updated: '2026-05-10',
    description: 'Everything a non-finance founder needs: P&L, cash flow, unit economics and a simple three-statement model you will build yourself.',
    outcomes: ['Read a P&L, balance sheet and cash-flow statement', 'Calculate unit economics and runway', 'Build a simple financial model', 'Prepare for investor conversations'],
    requirements: ['Spreadsheet basics'],
    curriculum: build('startup-finance', [
      ['The three statements', [['Why founders need finance', 9, 'video', true], ['Profit & loss', 20], ['Cash is king', 18]]],
      ['Modelling', [['Unit economics', 22], ['Building your model', 35], ['Template walkthrough', 10, 'reading']]],
    ]),
  },
  {
    id: 'music-production', image: '/img/c-music.jpg', title: 'Music Production Essentials', subtitle: 'Write, record and mix your first tracks in any DAW.',
    category: 'Music & Arts', level: 'Beginner', price: 420, rating: 4.8, reviews: 530, students: 4100, tutorId: 'u-t4', status: 'published', hue: 320, bestseller: true, updated: '2026-07-28',
    description: 'A hands-on introduction to making music at home. Rhythm, harmony, sound design and mixing — finished tracks from week one.',
    outcomes: ['Navigate any DAW with confidence', 'Program drums and write chord progressions', 'Record and edit vocals', 'Mix a balanced, polished track'],
    requirements: ['A computer and headphones', 'Any DAW (free options covered)'],
    curriculum: build('music-production', [
      ['Your studio', [['Setting up on a budget', 11, 'video', true], ['DAW tour', 16]]],
      ['Writing', [['Rhythm & drums', 24], ['Chords & melody', 28]]],
      ['Mixing', [['EQ & compression', 30], ['Space: reverb & delay', 22], ['Finishing your track', 18]]],
    ]),
  },
  {
    id: 'ux-design', image: '/img/c-ux.jpg', title: 'UI/UX Design Bootcamp', subtitle: 'Research, wireframe and prototype products people love to use.',
    category: 'Music & Arts', level: 'All levels', price: 640, rating: 4.7, reviews: 388, students: 2760, tutorId: 'u-t4', status: 'published', hue: 285, updated: '2026-06-30',
    description: 'Learn the complete product design process, from user interviews through high-fidelity prototypes and hand-off to developers.',
    outcomes: ['Run lightweight user research', 'Create wireframes and user flows', 'Design polished interfaces with a system', 'Prototype and test interactions'],
    requirements: ['No design experience needed'],
    curriculum: build('ux-design', [
      ['Design thinking', [['What UX really is', 10, 'video', true], ['Research on a budget', 22]]],
      ['Designing', [['Wireframes & flows', 26], ['Visual design basics', 30], ['Design systems', 24]]],
      ['Testing', [['Prototyping', 20], ['Usability testing', 18]]],
    ]),
  },
  {
    id: 'cad-engineering', image: '/img/c-cad.jpg', title: 'CAD for Mechanical Engineering', subtitle: 'Model, assemble and document parts ready for manufacturing.',
    category: 'Engineering', level: 'Intermediate', price: 720, rating: 4.6, reviews: 164, students: 980, tutorId: 'u-t1', status: 'published', hue: 185, updated: '2026-04-22',
    description: 'Parametric modelling, assemblies and technical drawings with an emphasis on design-for-manufacture.',
    outcomes: ['Create parametric 3D parts', 'Build assemblies with constraints', 'Produce production-ready drawings', 'Apply design-for-manufacture principles'],
    requirements: ['Basic engineering drawing knowledge helpful'],
    curriculum: build('cad-engineering', [
      ['Modelling', [['Sketches & constraints', 18, 'video', true], ['Features & patterns', 26]]],
      ['Assemblies & drawings', [['Mates and motion', 24], ['Technical drawings', 22]]],
    ]),
  },
  {
    id: 'medical-terminology', image: '/img/c-med.jpg', title: 'Medical Terminology', subtitle: 'Decode the language of healthcare — a must for any health career.',
    category: 'Health Science', level: 'Beginner', price: 300, rating: 4.8, reviews: 276, students: 2210, tutorId: 'u-t2', status: 'published', hue: 350, updated: '2026-03-15',
    description: 'Learn word roots, prefixes and suffixes, then apply them body system by body system with memorable examples and quizzes.',
    outcomes: ['Break down unfamiliar medical terms', 'Use correct terminology by body system', 'Read clinical notes with confidence', 'Prepare for allied-health programmes'],
    requirements: ['None'],
    curriculum: build('medical-terminology', [
      ['Word building', [['Roots, prefixes & suffixes', 16, 'video', true], ['Plurals & pronunciation', 12]]],
      ['Body systems', [['Cardiovascular', 20], ['Respiratory', 18], ['Musculoskeletal', 20], ['Review quiz', 12, 'quiz']]],
    ]),
  },
  {
    id: 'paralegal', image: '/img/c-law.jpg', title: 'Paralegal Fundamentals', subtitle: 'Legal research, writing and case management for the modern law office.',
    category: 'Law & Justice', level: 'Beginner', price: 560, rating: 4.5, reviews: 132, students: 870, tutorId: 'u-t3', status: 'published', hue: 220, updated: '2026-02-26',
    description: 'A practical introduction to the paralegal role: the court system, legal research, drafting and ethics.',
    outcomes: ['Understand court structure and procedure', 'Perform efficient legal research', 'Draft common legal documents', 'Apply professional ethics'],
    requirements: ['None'],
    curriculum: build('paralegal', [
      ['The legal system', [['Courts & jurisdiction', 18, 'video', true], ['Civil vs criminal', 14]]],
      ['Skills', [['Legal research', 26], ['Drafting documents', 24], ['Ethics for paralegals', 16, 'reading']]],
    ]),
  },
  {
    id: 'react-advanced', image: '/img/c-react.jpg', title: 'Advanced React Patterns', subtitle: 'Performance, architecture and testing for large React codebases.',
    category: 'Development', level: 'Advanced', price: 780, rating: 4.9, reviews: 0, students: 0, tutorId: 'u-t1', status: 'pending', hue: 160, updated: '2026-09-24',
    description: 'For developers who already ship React: compound components, state machines, rendering performance and test strategy.',
    outcomes: ['Design flexible component APIs', 'Profile and fix rendering bottlenecks', 'Model complex UI state', 'Test with confidence'],
    requirements: ['Solid React experience'],
    curriculum: build('react-advanced', [
      ['Patterns', [['Compound components', 22, 'video', true], ['Headless UI', 20]]],
      ['Performance', [['Profiling', 24], ['Memoisation done right', 18]]],
    ]),
  },
  {
    id: 'public-speaking', image: '/img/teach.jpg', title: 'Public Speaking Masterclass', subtitle: 'Own the room — from nerves to standing ovations.',
    category: 'Communication', level: 'Intermediate', price: 380, rating: 0, reviews: 0, students: 0, tutorId: 'u-t2', status: 'pending', hue: 5, updated: '2026-09-27',
    description: 'Techniques used by professional speakers to prepare, rehearse and deliver talks that land.',
    outcomes: ['Manage speaking anxiety', 'Structure memorable talks', 'Use body language deliberately'],
    requirements: ['None'],
    curriculum: build('public-speaking', [['Preparation', [['Beating nerves', 14, 'video', true], ['Rehearsal routines', 18]]]]),
  },
]

const enrollments: Enrollment[] = [
  { userId: 'u-s1', courseId: 'fullstack-web', completed: ['fullstack-web-s1-l1', 'fullstack-web-s1-l2', 'fullstack-web-s1-l3', 'fullstack-web-s2-l1', 'fullstack-web-s2-l2', 'fullstack-web-s2-l3', 'fullstack-web-s2-l4', 'fullstack-web-s3-l1'], enrolledAt: '2026-06-02', lastLessonId: 'fullstack-web-s3-l2' },
  { userId: 'u-s1', courseId: 'comm-basic', completed: ['comm-basic-s1-l1', 'comm-basic-s1-l2', 'comm-basic-s2-l1', 'comm-basic-s2-l2', 'comm-basic-s2-l3', 'comm-basic-s3-l1', 'comm-basic-s3-l2', 'comm-basic-s3-l3'], enrolledAt: '2026-04-11' },
  { userId: 'u-s1', courseId: 'python-data', completed: ['python-data-s1-l1'], enrolledAt: '2026-09-10', lastLessonId: 'python-data-s1-l2' },
  { userId: 'u-s2', courseId: 'fullstack-web', completed: [], enrolledAt: '2026-08-19' },
  { userId: 'u-s2', courseId: 'music-production', completed: ['music-production-s1-l1'], enrolledAt: '2026-07-03' },
  { userId: 'u-s3', courseId: 'comm-advanced', completed: [], enrolledAt: '2026-09-02' },
  { userId: 'u-s3', courseId: 'startup-finance', completed: [], enrolledAt: '2026-05-14' },
  { userId: 'u-s5', courseId: 'fullstack-web', completed: [], enrolledAt: '2026-09-21' },
  { userId: 'u-s6', courseId: 'ml-foundations', completed: [], enrolledAt: '2026-09-25' },
]

const orders: Order[] = [
  { id: 'ORD-10421', userId: 'u-s1', courseIds: ['comm-basic'], total: 250, date: '2026-04-11', status: 'paid' },
  { id: 'ORD-10588', userId: 'u-s1', courseIds: ['fullstack-web'], total: 2500, date: '2026-06-02', status: 'paid' },
  { id: 'ORD-10612', userId: 'u-s3', courseIds: ['startup-finance'], total: 350, date: '2026-05-14', status: 'paid' },
  { id: 'ORD-10703', userId: 'u-s2', courseIds: ['music-production'], total: 420, date: '2026-07-03', status: 'paid' },
  { id: 'ORD-10811', userId: 'u-s2', courseIds: ['fullstack-web'], total: 2500, date: '2026-08-19', status: 'paid' },
  { id: 'ORD-10844', userId: 'u-s3', courseIds: ['comm-advanced'], total: 400, date: '2026-09-02', status: 'paid' },
  { id: 'ORD-10867', userId: 'u-s1', courseIds: ['python-data'], total: 480, date: '2026-09-10', status: 'paid' },
  { id: 'ORD-10902', userId: 'u-s5', courseIds: ['fullstack-web'], total: 2500, date: '2026-09-21', status: 'paid' },
  { id: 'ORD-10915', userId: 'u-s6', courseIds: ['ml-foundations'], total: 890, date: '2026-09-25', status: 'paid' },
  { id: 'ORD-10920', userId: 'u-s4', courseIds: ['comm-basic'], total: 250, date: '2026-09-26', status: 'refunded' },
]

const reviews: Review[] = [
  { id: 'r1', courseId: 'fullstack-web', userId: 'u-s2', rating: 5, text: 'The best structured web course I have taken. The projects made everything click and I landed my first junior role three months later.', date: '2026-08-30' },
  { id: 'r2', courseId: 'fullstack-web', userId: 'u-s5', rating: 5, text: 'Daniel explains complicated things without ever making you feel slow. Worth every minute.', date: '2026-09-24' },
  { id: 'r3', courseId: 'comm-basic', userId: 'u-s1', rating: 5, text: 'Short, practical and immediately useful. My stand-ups are so much tighter now.', date: '2026-05-01' },
  { id: 'r4', courseId: 'comm-advanced', userId: 'u-s3', rating: 4, text: 'The difficult-conversations module alone was worth it.', date: '2026-09-12' },
  { id: 'r5', courseId: 'music-production', userId: 'u-s2', rating: 5, text: 'Finished my first track in the first week. Aisha is a fantastic teacher.', date: '2026-07-20' },
  { id: 'r6', courseId: 'python-data', userId: 'u-s6', rating: 5, text: 'Finally pandas makes sense. Loved the real-world datasets.', date: '2026-09-15' },
]

export function createSeed(): DB {
  return {
    users,
    courses,
    enrollments,
    orders,
    reviews,
    carts: { 'u-s1': ['ml-foundations'] },
    wishlists: { 'u-s1': ['ux-design', 'music-production'] },
    categories: CATEGORIES,
  }
}
