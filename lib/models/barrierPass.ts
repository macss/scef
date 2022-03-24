import { FormCommon } from "./database";

export default interface BarrierPass extends FormCommon {
  destinatario: string
  veiculo: string
  placa: string
  motorista: string
  empresaMotorista: string
  local: string
  observacoes: string
  materiais: { qty: number, material: string }[]
}