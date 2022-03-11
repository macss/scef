import { doc, onSnapshot } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export enum ListenToDataResultCodes {
  'SUCCESS',
  'ERROR'
}

export default async function listenToData<P extends keyof Database>(path: P, id: string, callback: (data: Database[P][string]) => void) {
  const docRef = doc(firestore, path, id)

  try {
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      callback(querySnapshot.data() as Database[P][string])
    })

    return {
      code: ListenToDataResultCodes['SUCCESS'],
      unsubscribe
    } as const
  } catch(error) {
    return {
      code: ListenToDataResultCodes['ERROR']
    } as const
  }
}