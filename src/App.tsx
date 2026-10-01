import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AccountPage } from './components/AccountForm'
import { Toaster } from './components/ui'
import DashboardLayout, { RequireRole } from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import { AdminCategories, AdminCourses, AdminOverview, AdminPayments, AdminSettings, AdminUsers } from './pages/admin/Admin'
import { Login, Signup } from './pages/public/Auth'
import CourseDetail from './pages/public/CourseDetail'
import Courses from './pages/public/Courses'
import Home from './pages/public/Home'
import { About, Cart, CheckoutSuccess, Contact, JoinUs, MakePayment, NotFound } from './pages/public/Misc'
import { News, NewsPost } from './pages/public/News'
import Player from './pages/student/Player'
import { MyLearning, Orders, StudentOverview, Wishlist } from './pages/student/Student'
import CourseEditor from './pages/tutor/CourseEditor'
import { TutorCourses, TutorEarnings, TutorOverview, TutorStudents } from './pages/tutor/Tutor'
import { StoreProvider } from './store/store'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="about-us" element={<About />} />
            <Route path="join-us" element={<JoinUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="news" element={<News />} />
            <Route path="news/:slug" element={<NewsPost />} />
            <Route path="make-a-payment" element={<MakePayment />} />
            <Route path="about" element={<Navigate to="/about-us" replace />} />
            <Route path="teach" element={<Navigate to="/join-us" replace />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout/success" element={<RequireRole role="student"><CheckoutSuccess /></RequireRole>} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="learn/:id" element={<RequireRole role="student"><Player /></RequireRole>} />

          <Route path="dashboard" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentOverview />} />
            <Route path="learning" element={<MyLearning />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="orders" element={<Orders />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          <Route path="tutor" element={<DashboardLayout role="tutor" />}>
            <Route index element={<TutorOverview />} />
            <Route path="courses" element={<TutorCourses />} />
            <Route path="courses/new" element={<CourseEditor key="new" />} />
            <Route path="courses/:id/edit" element={<CourseEditor />} />
            <Route path="students" element={<TutorStudents />} />
            <Route path="earnings" element={<TutorEarnings />} />
            <Route path="account" element={<AccountPage title="Instructor profile" />} />
          </Route>

          <Route path="admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </StoreProvider>
  )
}
