import { collection, onSnapshot, query, where } from "@firebase/firestore";
import User, { UserStatus } from "@lib/models/user";
import { firestore } from "config/firebaseConfig";

export enum FetchUnapprovedUsersResultCodes {
  Success,
  Error
}

export async function fetchUnapprovedUsers(callback: (users: User[]) => void) {
  const usersRef = collection(firestore, 'users')

  const q = query(usersRef, where('status', '!=', UserStatus.Aprovado))

  try {
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const users: User[] = []

      querySnapshot.forEach((user) => users.push(user.data() as User))
      callback(users)
    })


    return {
      status: FetchUnapprovedUsersResultCodes.Success,
      unsubscribe
    }
  } catch(e) {
    return {
      status: FetchUnapprovedUsersResultCodes.Error
    }
  }
}