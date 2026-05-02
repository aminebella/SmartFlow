'use client'
 
import { use } from 'react'
import '@/styles/admin/users/usersAdmin.css'
import UserDetails from '@/components/admin/usersAdmin/UserDetails'
 
export default function Page({ params }) {
  const { id } = use(params)
  return <UserDetails userId={id} />
}
 