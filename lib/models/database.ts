import User from "./user";

export default interface Database {
  users: Record<string, User>
}