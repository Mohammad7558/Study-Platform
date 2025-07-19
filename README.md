# 🎓 Collaborative Study Platform

A powerful MERN Stack-based web application built for seamless online collaboration between **Students**, **Tutors**, and **Admins**. The system includes full **role-based access control**, session management, study material sharing, and more.

---

## 🔴 Live Site

🌐 **Live URL:** [https://your-live-url.com](https://your-live-url.com)

🧪 **Admin Test Credentials:**
- Email: `admin@gmail.com`
- Password: `123456`

---

## 👤 User Roles & Functionalities

### 🔑 Admin Capabilities

Admins have full control over the entire system. They can:

1. 🔍 View all registered users (students & tutors)
2. 🛠️ Change user roles (make someone a student, tutor, or admin)
3. 📋 Manage all study sessions:
   - Approve ✅ / Reject ❌ sessions
   - Provide feedback 💬 on rejected sessions
   - Edit/update ✏️ or delete 🗑️ any session
   - Make a session **free** or **paid**
4. 📚 Manage all study materials:
   - View all materials
   - Edit or delete them anytime

---

### 🧑‍🏫 Tutor Capabilities

Tutors can:

1. ➕ Create study sessions
2. 📄 View their own sessions with status: Pending, Approved, or Rejected
3. 📤 Upload study materials
4. 👀 View all materials they uploaded
5. ❗ See feedback on rejected sessions and **request approval again**

---

### 🎓 Student Capabilities

Students can:

1. 📅 View and manage all their **booked sessions**
2. 📝 Create personal **study notes**
3. ✏️ Edit or 🗑️ delete their own notes
4. 📥 Download study materials uploaded by tutors

---

## 📦 Features

- ✅ **Role-based Dashboard** (separate dashboards for Admin, Tutor, and Student)
- ✅ **JWT-based Authentication** using Firebase and HttpOnly Cookies
- ✅ **Stripe Payment Integration** for paid sessions
- ✅ **Secure File Uploads** with ImgBB API
- ✅ **Pagination** on all large data pages
- ✅ **Filtering** on all data tables (sessions, users, materials, etc.)
- ✅ Fully **Responsive Design** for all devices

---

## 🛠️ Tech Stack

### 🔹 Frontend

- React.js
- React Router DOM
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- React Hook Form
- Firebase Authentication
- Axios

### 🔸 Backend

- Node.js
- Express.js
- MongoDB
- JWT (with cookie-based auth)
- CORS & Cookie Parser

---

## 📁 Folder Structure (Client-side)

```bash
/src
  /components      # Reusable components
  /pages           # Page-specific components
  /routes          # Route config
  /hooks           # Custom React hooks
  /ui              # Shadcn-based UI elements
