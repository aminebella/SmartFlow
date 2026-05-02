'use client'
 
import '@/styles/admin/users/usersAdmin.css'
import UsersPage from '@/components/admin/usersAdmin/UsersPage'
 
export default function Page() {
  // The top-level page stays tiny: it only mounts the client component
  return <UsersPage role="ADMIN" />
}
 