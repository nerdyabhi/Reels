import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();
        const videos = await video.find({}).sort({ createdAt: -1 }).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json({ data: [], message: "No videos yet" }, { status: 200 });
        }

        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch video" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorised User" },
                { status: 401 }
            )
        }

        await connectToDb();
        const body: IVideo = await req.json();

        console.log(body);


        if (!body.title || !body.description || !body.videoUrl || !body.fileType) {
            console.log("Mising info");

            return NextResponse.json(
                { error: "Missing Required Fields", body },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }
        const newVideo = await video.create(videoData);
        return NextResponse.json(newVideo);

    } catch (error:any) {
        return NextResponse.json(
            { error: "Failed to create Videos", message: error.message },
            { status: 500 }
        );
    }
}