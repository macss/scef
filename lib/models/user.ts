export enum UserAccessType {
  'Usuário',
  'Aprovador',
  'Admnistrador'
} 

export enum UserStatus {
  'Aguardando Aprovação',
  'Aprovado',
  'Reprovado'
}

export enum UserType {
  'Indefinido',
  'Interno',
  'Externo'
}

export default interface User {
  email: string | null
  access_type: UserAccessType
  status: UserStatus
  uid: string
  type: UserType
}