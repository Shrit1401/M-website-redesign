export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  author: string
  body: string[]
}

// Sample posts for the News page. Swap in real articles before launch.
export const POSTS: Post[] = [
  {
    slug: 'how-to-pick-your-first-tech-course',
    title: 'How to pick your first tech course without overthinking it',
    excerpt: 'You do not need a perfect plan to start. A simple way to choose a first course and actually finish it.',
    date: '2026-09-18',
    category: 'Career',
    image: '/img/hero-1.jpg',
    author: 'Revive Skills Team',
    body: [
      'Most people who want to move into tech spend weeks comparing courses and never start one. The comparison feels productive, but it is usually a way to avoid the uncomfortable part: being a beginner again.',
      'Start with the job you want in a year, not the job you want in ten. If that is a junior web developer role, a full stack course is a better first step than a machine learning specialisation.',
      'Then pick the course whose first week you can start today. Check the curriculum, watch a preview lesson, and make sure the instructor explains things in a way that clicks for you.',
      'Finally, block the time. Two focused hours, three evenings a week, will take you further than a weekend binge followed by a month off.',
    ],
  },
  {
    slug: 'communication-skills-in-remote-teams',
    title: 'Why communication skills matter more on remote teams',
    excerpt: 'When most of your work happens in writing, clear communication becomes a technical skill.',
    date: '2026-08-27',
    category: 'Communication',
    image: '/img/team.jpg',
    author: 'Revive Skills Team',
    body: [
      'On a remote team, nobody can lean over to your desk to ask what you meant. Your messages, documents and pull request descriptions do the talking.',
      'The people who grow fastest on distributed teams write short, specific updates, ask clear questions, and summarise decisions so nobody has to scroll back through a long thread.',
      'These are learnable skills. Our Communication Skills Basic and Advanced courses cover structured writing, running effective meetings and giving feedback that lands.',
    ],
  },
  {
    slug: 'building-a-portfolio-that-gets-interviews',
    title: 'Building a portfolio that gets you interviews',
    excerpt: 'Three small, finished projects beat one huge unfinished one. Here is what hiring managers look for.',
    date: '2026-08-05',
    category: 'Development',
    image: '/img/hero-2.jpg',
    author: 'Revive Skills Team',
    body: [
      'A portfolio is proof that you can take something from idea to working product. Hiring managers skim, so make each project easy to understand in under a minute.',
      'For every project, include a live link, a short description of the problem it solves, and one or two decisions you made along the way and why.',
      'Finished beats impressive. A small app that works end to end shows more than an ambitious one that only runs on your laptop.',
    ],
  },
  {
    slug: 'learning-while-working-full-time',
    title: 'Learning new skills while working full time',
    excerpt: 'Practical habits from learners who completed a course alongside a full-time job.',
    date: '2026-07-14',
    category: 'Learning',
    image: '/img/hero-4.jpg',
    author: 'Revive Skills Team',
    body: [
      'Learning alongside a full-time job is mostly a scheduling problem. The learners who finish treat study time like a meeting they cannot move.',
      'Short sessions work. Twenty-five minutes on a single lesson, with notes, is enough to keep momentum on a busy day.',
      'Tell someone what you are working on. A friend, a manager or a study group makes it much harder to quietly drop the course.',
    ],
  },
]
