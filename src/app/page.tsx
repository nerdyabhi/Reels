

import FileUpload from "@/components/FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Gallery from "../components/Gallery"
export default async function Home() {
  // Get the session on the server side
  const session = await getServerSession();

  // If there's no session, redirect to register
  if (!session) {
    redirect("/register");
  }

  


  // If there is a session, redirect to signin
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Hello, {session.user?.email || 'Dev'}!</h1>
      <form action="/api/auth/signout" method="POST">
     <FileUpload/>
    <Gallery/>
     
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Sign Out
        </button>
      </form>

    </main>
  );
}
