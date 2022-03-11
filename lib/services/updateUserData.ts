import User from "@lib/models/user";
import addData, { AddDataResultCodes } from "./addData";

export default async function updateUserData(user: User) {
  try {
    const result = await addData(user, 'users')
    return {
      status: result.status
    }
  } catch (error) {
    return {
      status: AddDataResultCodes.ERROR
    }
  }
}