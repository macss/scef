import { doc, updateDoc } from "@firebase/firestore";
import Database from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export default async function updateFormInfo<P extends keyof Database['forms'], D extends Database['forms'][P]['responses'][string]>(path: P, data: D) {
  try {
    const form = doc(firestore, `/forms/${data.form_id}/responses/${data.uid}`)
    await updateDoc(form, (data as any))
  } catch (e) {
    console.log(e)
  }
}