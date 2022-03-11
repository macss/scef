import { User } from '@firebase/auth';
import React from "react";

const UserContext = React.createContext<{
  user: User | undefined
}>({
  user: undefined
})

export default UserContext