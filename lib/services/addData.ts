import { collection, doc, setDoc } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export enum AddDataResultCodes {
  OK,
  ERROR
}

export default async function addData<P extends keyof Database>(data: Database[P][string], path: P) {
  const newDataRef = (data as any).uid ? doc(firestore, path, (data as any).uid) : doc(collection(firestore, path))
  try {
    await setDoc(newDataRef, data)
    
    return {
      status: AddDataResultCodes.OK
    }
  } catch (error) {
    return {
      status: AddDataResultCodes.ERROR
    }
  }
}