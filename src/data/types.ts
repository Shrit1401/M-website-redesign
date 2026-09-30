export type Role = 'student' | 'tutor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  status: 'active' | 'suspended'
  joined: string
  headline?: string
  bio?: string
  avatar?: string
}

export type LessonType = 'video' | 'reading' | 'quiz'

export interface Lesson {
  id: string
  title: string
  minutes: number
  type: LessonType
  preview?: boolean
}

export interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

export type CourseStatus = 'published' | 'pending' | 'draft' | 'rejected'
export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'All levels'

export interface Course {
  id: string
  title: string
  subtitle: string
  category: string
  level: Level
  price: number
  rating: number
  reviews: number
  students: number
  tutorId: string
  status: CourseStatus
  hue: number
  image?: string
  description: string
  outcomes: string[]
  requirements: string[]
  curriculum: Section[]
  updated: string
  bestseller?: boolean
}

export interface Enrollment {
  userId: string
  courseId: string
  completed: string[]
  enrolledAt: string
  lastLessonId?: string
}

export interface Order {
  id: string
  userId: string
  courseIds: string[]
  total: number
  date: string
  status: 'paid' | 'refunded'
}

export interface Review {
  id: string
  courseId: string
  userId: string
  rating: number
  text: string
  date: string
}

export interface DB {
  users: User[]
  courses: Course[]
  enrollments: Enrollment[]
  orders: Order[]
  reviews: Review[]
  carts: Record<string, string[]>
  wishlists: Record<string, string[]>
  categories: string[]
}
