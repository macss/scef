import { collection, doc, DocumentReference, serverTimestamp, setDoc } from "@firebase/firestore";
import Database, { FormCommon } from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export enum AddDataResultCodes {
  OK,
  ERROR
}

type FormPaths = keyof Database['forms']
type DatabaseKeys = Exclude<keyof Database, 'forms'>
type DataType<P> = P extends FormPaths ? Omit<Database['forms'][P]['responses'][string], 'created_at'> : P extends DatabaseKeys ? Database[P][string] : never

export default async function addData<P extends (DatabaseKeys | FormPaths)>(data: DataType<P>, path: P) {
  let newDataRef: DocumentReference

  const newPath = 'form_id' in data ? `/forms/${path}/responses` : path

  newDataRef = (data as any).uid ? doc(firestore, newPath, (data as any).uid) : doc(collection(firestore, newPath))

  console.log(data)

  try {
    await setDoc(newDataRef, { 
      ...data,
      created_at: serverTimestamp(),
      uid: (data as any).uid ?? newDataRef.id
    })
    
    return {
      status: AddDataResultCodes.OK
    }
  } catch (error) {
    return {
      status: AddDataResultCodes.ERROR,
      error
    }
  }
}