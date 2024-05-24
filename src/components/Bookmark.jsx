import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import useAuth from "../hooks/useAuth";

const Bookmark = ({ photoId }) => {
  const [bookmark, setBookmark] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      const bookmarksRef = collection(db, "bookmarks");
      const q = query(
        bookmarksRef,
        where("photoId", "==", photoId),
        where("bookmarkerEmail", "==", user.email)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        console.log({ docs });
        setBookmark(docs?.length > 0 ? docs[0] : null);
      });

      return unsubscribe;
    };

    init();
  }, [photoId]);

  const handleBookmark = async () => {
    if (bookmark?.id) {
      const bookmarkId = bookmark.id;
      deleteDoc(doc(db, "bookmarks", bookmarkId));
    } else {
      addDoc(collection(db, "bookmarks"), {
        photoId,
        bookmarkerEmail: user.email,
        createdAt: serverTimestamp(),
      });
    }

    // return unsubscribe;
  };

  return (
    <p onClick={handleBookmark}>
      {bookmark ? "Remove Bookmark" : "Bookmark"}
    </p>
  );
};

Bookmark.propTypes = {
  photoId: PropTypes.string.isRequired,
};

export default Bookmark;
