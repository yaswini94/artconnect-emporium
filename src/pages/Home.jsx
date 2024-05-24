import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useStorage from "../hooks/useStorage";
import useFirestore from "../hooks/useFirestore";
import { orderBy } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import PhotoGrid from "../components/ImageGrid";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileNameRef = useRef(null);
  const captionRef = useRef(null);
  const descriptionRef = useRef(null);
  const { progress, startUpload, error } = useStorage();
  const { docs: photos = [] } = useFirestore("photos", {
    orderBy: orderBy("createdAt", "desc"),
  });

  const getSelectedFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = event.target.files[0];
    setSelectedFile(file);
  };

  async function uploadPhoto(event) {
    event.preventDefault();

    try {
      setUploading(true);
      await startUpload({
        file: selectedFile,
        fileName: fileNameRef.current.value,
        caption: captionRef.current.value,
        description: descriptionRef.current.value,
        callbackFn: () => {
          fileNameRef.current.value = null;
          captionRef.current.value = null;
          descriptionRef.current.value = null;
          setSelectedFile(null);
        },
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <form>
        <label>
          <input type="file" onChange={getSelectedFile} />
          <span>+</span>
        </label>
        {(error || selectedFile) && (
          <div className="output">
            {error && <div className="error">{error}</div>}
            {selectedFile && <div>{selectedFile.name}</div>}
            {selectedFile && <ProgressBar progress={progress} />}
          </div>
        )}
      </form>

      <form onSubmit={uploadPhoto}>
        <div className="input-block" id="fileName">
          <div className="input-label">File Name</div>
          <input type="text" ref={fileNameRef} required />
        </div>
        <div className="input-block" id="caption">
          <div className="input-label">Caption</div>
          <input type="text" ref={captionRef} required />
        </div>
        <div className="input-block" id="description">
          <div className="input-label">Description</div>
          <textarea
            ref={descriptionRef}
            required
            placeholder="Photo description"
          />
        </div>
        <div className="btn-block">
          <button type="submit" className="btn-primary uppercase">
            Add Photo
          </button>
        </div>
      </form>
      <PhotoGrid photos={photos} />
    </div>
  );
}
