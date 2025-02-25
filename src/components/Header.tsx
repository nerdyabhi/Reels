"use client"

import { signOut, useSession } from "next-auth/react";
import React from "react";



export default function Header() {
    const { data: session } = useSession();
    const handleSignout = async () => {
        try {
            await signOut();
        } catch (err) {

        }
    }

    return (
        <div>
            Header
            <button onClick={handleSignout}>SignOut </button>
        </div>
    )
}