import { doc, getDoc } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export enum ReadDataResultCodes {
  'SUCCESS',
  'NOT REGISTERED',
  'ERROR'
}

export default async function readData<P extends keyof Database>(path: P, id: string) {
  const docRef = doc(firestore, path, id)

  try {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        code: ReadDataResultCodes['SUCCESS'],
        data: docSnap.data() as Database[P][string]
      } as const
    } else {
      return {
        code: ReadDataResultCodes['NOT REGISTERED']
      } as const
    }
  } catch(error) {
    return {
      code: ReadDataResultCodes['ERROR']
    } as const
  }
}