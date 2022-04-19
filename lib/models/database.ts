import BarrierPass from "./barrierPass";
import User from "./user";

export enum FormApprovalStatus {
  "Aguardando Aprovação",
  "Aprovado pelo Gestor",
  "Recebido pelo Fornecedor",
  "Reprovado"
}

type Historico = {
  userId: string,
  date: {
    seconds: number,
    nanoseconds: number
  }
}

export type FormCommon = {
  created_at: { seconds: number, nanoseconds: number }
  form_id: keyof Database['forms']
  solicitante: string
  status: FormApprovalStatus
  historico?: {
    'aprovacao_gestor'?: Historico,
    'recebimento_prestador'?: Historico,
    'cancelamento'?: Historico
  }
  uid: string
}

export default interface Database {
  users: Record<string, User>,
  forms: {
    barrier_pass: {
      responses: Record<string, BarrierPass>
    }
  }
}