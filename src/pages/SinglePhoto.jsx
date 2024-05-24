import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import Comments from "../components/Comments";
import Likes from "../components/Likes";
import Bookmark from "../components/Bookmark";

const SinglePhoto = () => {
  let { photoId } = useParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const fetchPhoto = async () => {
      const photoRef = doc(db, "photos", photoId);
      unsubscribe = onSnapshot(photoRef, (doc) => {
        const _data = doc.data();
        setPhoto(_data);
      });
    };

    fetchPhoto();

    return unsubscribe;
  }, [photoId]);

  return (
    <>
      {photo ? (
        <div className="single-photo-wrapper">
          <div className="single-photo-block">
            <img
              src={photo.imageUrl}
              alt={`${photo.name}`}
              className="single-photo-image"
            />
          </div>
          <div className="photo-stats-block">
            <Bookmark photoId={photoId} />
            <div class="divider" />
            <Likes photoId={photoId} count={photo.likeCount} />
          </div>
          <div className="photo-info-block">
            <p>Name: {photo.fileName}</p>
            <p>Caption: {photo.caption || "No caption added"}</p>
            <p>Description: {photo.description || "No description added"}</p>
          </div>
          <Comments photoId={photoId} />
        </div>
      ) : null}
    </>
  );
};

export default SinglePhoto;
