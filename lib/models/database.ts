import BarrierPass from "./barrierPass";
import User from "./user";

export enum FormApprovalStatus {
  "Aguardando Aprovação",
  "Aprovado pelo Gestor",
  "Recebido pelo Fornecedor",
  "Reprovado"
}

export type FormCommon = {
  created_at: { seconds: number, nanoseconds: number }
  form_id: string
  solicitante: string
  status: FormApprovalStatus
}

export default interface Database {
  users: Record<string, User>,
  forms: {
    barrier_pass: Record<string, BarrierPass>
  }
}