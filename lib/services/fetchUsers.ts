import { collection, onSnapshot } from "@firebase/firestore";
import User from "@lib/models/user";
import { firestore } from "config/firebaseConfig";

export enum FetchUsersResultCodes {
  Success,
  Error
}

export async function fetchUsers(callback: (users: User[]) => void) {
  const usersRef = collection(firestore, 'users')

  try {
    const unsubscribe = onSnapshot(usersRef, querySnapshot => {
      const users: User[] = []

      querySnapshot.forEach((user) => users.push(user.data() as User))
      callback(users)
    })

    return {
      status: FetchUsersResultCodes.Success,
      unsubscribe
    }
  } catch(e) {
    return {
      status: FetchUsersResultCodes.Error
    }
  }
}