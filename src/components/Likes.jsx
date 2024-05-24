import useFirestore from "../hooks/useFirestore";
import PropTypes from "prop-types";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";

const Likes = ({ photoId, count = 0 }) => {
  const [selfLike, setSelfLike] = useState(null);
  const { user } = useAuth();
  const LIKE_COLLECTION = `photos/${photoId}/likes`;

  const { docs: likes = [] } = useFirestore(LIKE_COLLECTION);

  useEffect(() => {
    if (likes.length > 0) {
      const like = likes.find((like) => like.likedBy === user.email);
      setSelfLike(like);
    } else {
      setSelfLike(null);
    }
  }, [likes]);

  const toggleLikeOnPhoto = async () => {
    console.log("toggleLikeOnPhoto");
    try {
      if (selfLike?.id) {
        await deleteDoc(doc(db, LIKE_COLLECTION, selfLike.id));
      } else {
        await addDoc(collection(db, LIKE_COLLECTION), {
          likedAt: serverTimestamp(),
          likedBy: user.email,
        });
      }
      await updateDoc(doc(db, "photos", photoId), {
        likeCount: selfLike?.id ? likes?.length - 1 : likes?.length + 1,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <p className="like-wrapper" onClick={toggleLikeOnPhoto}>
      <span>{selfLike?.id ? `Unlike` : 'Like'}</span>
      <span> ({count})</span>
    </p>
  );
};

Likes.propTypes = {
  photoId: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
};

export default Likes;
