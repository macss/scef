export enum USER_ACCESS_TYPE {
  'Usuário',
  'Aprovador',
  'Admnistrador'
} 

export enum USER_STATUS {
  'Aguardando Aprovação',
  'Aprovado',
  'Reprovado'
}

export enum USER_TYPE {
  'Indefinido',
  'Interno',
  'Externo'
}

export default interface User {
  email: string | null
  access_type: USER_ACCESS_TYPE
  status: USER_STATUS
  uid: string
  type: USER_TYPE
}