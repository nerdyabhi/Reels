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
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                setError("Please Upload a valid file (JPEG , PNG , WEBP)");
                return false;
            }
        }
        return true;
    }




    return (
        <div className="App">
            <h1>ImageKit Next.js quick start</h1>
            <p>Upload an image with advanced options</p>
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
                transformation={{
                    pre: "l-text,i-Imagekit,fs-50,l-end",
                    post: [
                        {
                            type: "transformation",
                            value: "w-100",
                        },
                    ],
                }}
                style={{ display: 'none' }} // hide the default input and use the custom upload button
                ref={ikUploadRefTest}
            />

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