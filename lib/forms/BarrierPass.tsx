import React, { useState } from 'react';
import { FormDisplay } from '@lib/components'
import { ErrorMessage, FormDisplayProps, InputTypes } from '@lib/components/FormDisplay';
import parseMaterialsList from '@lib/utils/parseMaterialsList';

const inputs: FormDisplayProps<InputTypes>['inputs'] = {
  'destinatario': {
    inputType: 'text-field',
    label: 'Destinatário',
    helperText: 'Para quem o documento está sendo enviado?',
  },
  'veiculo': {
    inputType: 'text-field',
    label: 'Veículo',
    helperText: 'Qual veículo está transportando o material?',
  },
  'placa': {
    inputType: 'text-field',
    label: 'Placa',
    helperText: 'Qual a placa do veículo transportando o material? [ABC-1234 ou ABC-1B34]',
    inputProps: {
      pattern: '[A-Z]{3}-\\d[A-Z|\\d]\\d\\d'
    }
  },
  'motorista': {
    inputType: 'text-field',
    label: 'Nome do motorista',
    helperText: 'Quem está transportando o material?'
  },
  'empresaMotorista': {
    inputType: 'text-field',
    label: 'Empresa do motorista',
    helperText: 'Para qual empresa o motorista trabalha?'
  },
  'local': {
    inputType: 'text-field',
    label: 'Local de entrega',
    helperText: 'Qual o destino do material?'
  },
  'materiais': {
    inputType: 'text-field',
    label: 'Lista de Materiais',
    placeholder: '1x Parafuso XXXXXX \n1x Correia XXXXXXX',
    helperText: 'Lista de materiais no formato [1x Material ou 1 Material]',
    multiline: true
  },
  'observacoes': {
    inputType: 'text-field',
    label: 'Observações',
    required: false,
    multiline: true
  },
  'enviar': {
    inputType: 'button',
    children: 'Enviar',
    type: 'submit',
    variant: 'contained'
  }
} as const

const BarrierPass = () => {
  const [errors, setErrors] = useState<Record<keyof typeof inputs, ErrorMessage>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault() 

    const form = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    let errors: Record<keyof typeof inputs, ErrorMessage> = {}

    for (let [inputName, value] of form.entries()) {
      data[`${inputName}`] = value
      if (inputName === 'materiais') {
        try {
          data[`${inputName}`] = parseMaterialsList(value as string)
        } catch(e) {
          errors[`${inputName}`] = {
            active: true,
            message: (e as any).message as string
          }
        }
      }        
    }
  
    setErrors(errors)

    if (Object.keys(errors).length === 0)
      console.log(data)
  }
  
  return (
    <FormDisplay 
      title="Passe de Barreira"
      inputs={inputs}
      onSubmit={handleSubmit}
      errors={errors}
    />
  )
};

BarrierPass.displayName = 'Passe de Barreira'

export default BarrierPass;
