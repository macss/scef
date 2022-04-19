import React, { useContext, useEffect, useState } from 'react';
import { FormDisplay } from '@lib/components'
import { ErrorMessage, FormDisplayProps, InputTypes } from '@lib/components/FormDisplay';
import parseMaterialsList from '@lib/utils/parseMaterialsList';
import User, { UserType } from '@lib/models/user';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { firestore } from 'config/firebaseConfig';
import addData from '@lib/services/addData';
import BarrierPass from '@lib/models/barrierPass';
import UserContext from '@lib/conxtexts/userContext';
import { FormApprovalStatus } from '@lib/models/database';

const getSuppliers = async () => {
  let suppliers: User[] = []

  const usersRef = collection(firestore, 'users')
  const q = query(usersRef, where('type', '==', UserType.Externo))

  await getDocs(q)
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        suppliers.push(doc.data() as User)
      })
    }) 

  return suppliers
}

const getInputs = async () => {
  const inputs: FormDisplayProps<InputTypes>['inputs'] = {
    'destinatario': {
      inputType: 'select',
      label: 'Destinatário',
      helperText: 'Para quem o material está sendo enviado?',
      options: (await getSuppliers()).reduce((a,c) => {
        const name = `${c.displayName} (${c.email})`
  
        if (!(name in a)) {
          a[name] = c.uid
        }
        
        return a
      }, {} as Record<string, any>)
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
      variant: 'outlined'
    }
  } as const

  return inputs
}

const BarrierPassForm = () => {
  const [inputs, setInputs] = useState<FormDisplayProps<InputTypes>['inputs']>({})
  const [errors, setErrors] = useState<Record<keyof typeof inputs, ErrorMessage>>({})
  const { user } = useContext(UserContext)

  useEffect(() => {
    getInputs().then(inputs => setInputs(inputs))
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault() 

    const form = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    const errors: Record<keyof typeof inputs, ErrorMessage> = {}

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
      addData({
        ...(data as Omit<BarrierPass, 'created_at' | 'solicitante' | 'status'>),
        solicitante: user?.uid ?? '',
        status: FormApprovalStatus['Aguardando Aprovação']
      }, 'barrier_pass').then(result => console.log(result))
  }
  
  return (
    <FormDisplay 
      title="Passe de Barreira"
      inputs={inputs}
      onSubmit={handleSubmit}
      errors={errors}
      formId="barrier_pass"
    />
  )
};

BarrierPassForm.displayName = 'Passe de Barreira'

export default BarrierPassForm;
