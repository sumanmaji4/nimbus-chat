'use client'
import React, { FC } from 'react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  try {
    await signOut()
  } catch (error) {
    //
    toast.error('kaisa laga mera mazak, 😂')
  }
  return <div>'kaisa laga mera mazak, 😂'</div>
}

export default page
