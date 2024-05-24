import { useState } from "react";
import { db } from "../firebase/config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

export default function useFirestore(
  collectionName,
  { orderBy = null, refetch } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, collectionName), orderBy);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setDocs(docs);
          setIsLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    getData();
  }, [collectionName, refetch]);

  return { docs, isLoading };
}
