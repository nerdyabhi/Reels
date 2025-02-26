"use client";
import React, { useRef, useState } from "react";
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { set } from "mongoose";


interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: Number) => void;
    fileType?: "image" | "video"
}



export default function FileUpload({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) {
    const ikUploadRefTest = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        (async () => {
            try {
                // Generate thumbnail URL for videos
                let thumbnailUrl = '';
                if (fileType === 'video' && response.url) {
                    thumbnailUrl = `${response.url}?tr=f-auto,q-50,w-300`;
                }


                const res = await fetch("/api/videos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: "Uploaded Video",
                        description: "Auto-uploaded video",
                        videoUrl: response.url,
                        thumbnailUrl: thumbnailUrl || response.thumbnailUrl || "https://source.unsplash.com/random",
                        controls: true,
                        fileType: response.fileType,
                        transformation: {
                            width: 1080,
                            height: 1920,
                        },
                    }),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to save video.");
                }
                const savedVideo = await res.json();
                // onSuccess(savedVideo);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        })();

        console.log("Successfully Updated the db ");

    };

    const handleProgress = () => {
        setUploading(true);
        setError(null);
    };

    const handleStartUpload = () => {
        console.log("Start");
        setUploading(true);
        setError(null);
    };


    const validateFile = (file: File): boolean => {
        if (fileType === 'video') {
            if (!file.type.startsWith("video/")) {
                setError("Please Upload Video file");
                return false;
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("Video must be less than 100MB");
                return false;
            }
        } else {
            if (file.size > 100 * 1024 * 1024) {
                setError("Image must be less than 100MB");
                return false;
            }
            const validImageTypes = ["image/jpeg", "image/png", "image/webp"];

        }
        return true;
    }




    return (
        <div className="App">

            <p>Upload Your Image / video </p>
            <IKUpload
                fileName="test-upload.jpg"
                tags={["sample-tag1", "sample-tag2"]}
                customCoordinates={"10,10,10,10"}
                isPrivateFile={false}
                useUniqueFileName={true}
                responseFields={["tags"]}
                validateFile={validateFile}
                folder={"/sample-folder"}

                webhookUrl="https://www.example.com/imagekit-webhook" // replace with your webhookUrl
                overwriteFile={true}
                overwriteAITags={true}
                overwriteTags={true}
                overwriteCustomMetadata={true}

                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
                // transformation={{
                //     pre: "l-text,i-Imagekit,fs-50,l-end",
                //     post: [
                //         {
                //             type: "transformation",
                //             value: "w-100",
                //         },
                //     ],
                // }}
                // hide the default input and use the custom upload button
                ref={ikUploadRefTest}
            />
            {error && error !== "null" && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}

            {
                uploading &&
                <div className="flex items-center gap-2 text-sm ">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Uploading File...
                </div>

            }
        </div>
    );
}