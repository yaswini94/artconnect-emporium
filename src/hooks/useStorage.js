import React from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuth from "./useAuth";

export default function useStorage() {
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [url, setUrl] = React.useState(null);

  const { user } = useAuth();

  const startUpload = ({
    file,
    fileName,
    caption,
    description,
    callbackFn,
  }) => {
    if (!file) return;

    const fileId = uuidv4();
    const fileExt = file.type.split("/")[1];
    const generatedFileName = `${fileId}.${fileExt}`;

    const storageRef = ref(storage, `images/${generatedFileName}`);
    const fileUploadProcess = uploadBytesResumable(storageRef, file);
    fileUploadProcess.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        setError(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(
          fileUploadProcess.snapshot.ref
        );
        setUrl(downloadURL);
        setProgress(0);

        try {
          await addDoc(collection(db, "photos"), {
            imageUrl: downloadURL,
            createdAt: serverTimestamp(),
            photographerEmail: user.email,
            fileName,
            caption,
            description,
            likeCount: 0,
          });
          callbackFn();
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    );
  };

  return { progress, url, error, startUpload };
}
