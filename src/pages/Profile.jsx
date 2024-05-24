import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import PhotoGrid from "../components/ImageGrid";

const Profile = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const init = () => {
      setLoading(true);
      const photosRef = collection(db, "photos");
      const q = query(photosRef, where("photographerEmail", "==", user.email));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setPhotos(docs);
        setLoading(false);
      });
      return unsubscribe;
    };

    init();
  }, []);

  console.log({ photos });

  return (
    <div>
      <div>Welcome {user.email}</div>
      <PhotoGrid photos={photos} loading={loading} />
    </div>
  );
};

export default Profile;
