import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  // orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [allBookmarks, setAllBookmarks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      const bookmarksRef = collection(db, "bookmarks");
      const q = query(bookmarksRef, where("bookmarkerEmail", "==", user.email));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setBookmarks(docs);
      });

      return unsubscribe;
    };

    init();
  }, []);

  useEffect(() => {
    const fetchPhoto = async (bookmarkDoc) => {
      const docRef = doc(db, "photos", bookmarkDoc.photoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const _combined = { ...data, ...bookmarkDoc };
        console.log("Document data:", _combined);
        setAllBookmarks([...allBookmarks, _combined]);
      } else {
        console.log("No such document!");
      }
    };

    if (bookmarks?.length > 0) {
      bookmarks?.forEach((_bookmarkDoc) => {
        fetchPhoto(_bookmarkDoc);
      });
    } else {
      setAllBookmarks([]);
    }
  }, [bookmarks]);

  console.log(allBookmarks);
  const removeBookmark = async (bookmark) => {
    const bookmarkId = bookmark.id;
    deleteDoc(doc(db, "bookmarks", bookmarkId));
  };

  return (
    <div>
      <p>Bookmark List ({allBookmarks?.length})</p>
      {allBookmarks?.map((bookmark) => (
        <div key={bookmark.id}>
          <Link to={`/photos/${bookmark.photoId}`}>
            <img
              style={{
                width: "64px",
              }}
              src={bookmark.imageUrl}
              alt={bookmark.fileName}
            />
            <p>Photo Name: {bookmark.fileName}</p>
            <p>by - {bookmark.photographerEmail}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeBookmark(bookmark);
              }}
            >
              Remove Bookmark
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookmarksList;
