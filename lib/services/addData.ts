import { collection, doc, setDoc } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export default async function addData<P extends keyof Database>(data: Database[P][string], path: P) {
  const newDataRef = (data as any).uid ? doc(firestore, path, (data as any).uid) : doc(collection(firestore, path))
  try {
    await setDoc(newDataRef, data)
    
    return {
      status: 'ok'
    }
  } catch (error) {
    return {
      status: 'error'
    }
  }
}