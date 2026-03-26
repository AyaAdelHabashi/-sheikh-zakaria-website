import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";

export function useFirestoreCollection(
  collectionName: string,
  setDeleteModal: (data: { id: string; name: string } | null) => void,
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionName);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [collectionName]);
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ id, name });
  };
  return { data, loading, handleDeleteClick };
}
