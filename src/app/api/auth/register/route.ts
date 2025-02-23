import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";

import User from "@/models/User";


export async function POST(request: NextRequest) {

    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Both Email and Password is required" },
                { status: 400 }
            )
        }

        await connectToDb()
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already Exists , kindly login" },
                { status: 400 })
        }

        

        await User.create({
            email,
            password
        })

        return NextResponse.json({ error: "User Registered Successfully !" },
            { status: 200 })

    } catch (error) {
        return NextResponse.json({
            error: "Failed to register User"
        }, { status: 200 })
    }
}