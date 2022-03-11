import { doc, getDoc } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export default async function readData<P extends keyof Database>(path: P, id: string) {
  const docRef = doc(firestore, path, id)

  try {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        code: 'SUCCESS',
        data: docSnap.data() as Database[P][string]
      } as const
    } else {
      return {
        code: 'NOT REGISTERED'
      } as const
    }
  } catch(error) {
    return {
      code: 'ERROR'
    } as const
  }
}