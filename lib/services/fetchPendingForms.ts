import { collectionGroup, DocumentData, onSnapshot, query, where } from "@firebase/firestore";
import { FormApprovalStatus } from "@lib/models/database";
import { firestore } from "config/firebaseConfig";

export enum FetchPendingFormsResultCodes {
  Success,
  Error
}

export default async function fetchPendingForms(callback: (forms: any[]) => void) {
  const pendingFormsRef = query(collectionGroup(firestore, 'responses'), where('status', '==', FormApprovalStatus["Aguardando Aprovação"]))

  try {
    const unsubscribe = onSnapshot(pendingFormsRef, querySnapshot => {
      const pendingForms: any[] = []

      querySnapshot.forEach((doc) => pendingForms.push(doc.data()))

      callback(pendingForms)
    })
  
    return {
      status: FetchPendingFormsResultCodes.Success,
      unsubscribe
    }
  } catch(e) {
    return {
      status: FetchPendingFormsResultCodes.Error
    }
  }
}