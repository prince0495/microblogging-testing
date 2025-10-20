'use client'
import HomeWrapper from '@/components/HomeWrapper'
import ProfilePage from '@/components/ProfilePage';
import { useUserStore } from '@/lib/store'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {
    const user = useUserStore(state=>state.user);
    const [account, setAccount] = useState(null);
    if(!user || !user?.id) {
        return (
            <div>
                You must login to view profile
            </div>
        )
    }

    useEffect(() => {
        const getAccountDetails = async() => {
            const res = await axios.get(`/api/user/profile?userId=${user.id}`);
            if(res.data?.account) {
                console.log(res.data.account);
                setAccount(res.data.account);
            }
            else {
                console.log(res.data);
            }
        }
        getAccountDetails();
    }, [])

  return (
    <HomeWrapper>
        <ProfilePage account={account} userId={user.id} />
    </HomeWrapper>
  )
}

export default page
