import React, { useState } from 'react';
import { FormDisplay } from '@lib/components'
import { Container, Grid, Paper } from '@mui/material';
import { InputTypes, FormDisplayProps } from '@lib/components/FormDisplay';

const NewForm = () => {
  const [inputs, setInputs] = useState<Record<string, any>>({
    "text-field": {
      label: 'Nome do Colaborador',
      name: 'nome',
      inputType: 'text-field'
    },
    select: {
      defaultValue: '',
      options: {
        'Primeiro': 1,
        'Segundo': 2
      },
      label: 'Escolha a posição',
      name: 'posicao',
      inputType: 'select'
    },
    button: {
      variant: 'outlined',
      type: 'submit',
      children: 'Enviar',
      inputType: 'button'
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault() 
    const form = new FormData(e.currentTarget)
    const data: Record<string, any> = {}

    for (let [inputName, value] of form.entries()) {
      data[`${inputName}`] = value
    }

    console.log(data)
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={6}>
        <Container>
          <Paper sx={{p:2, m: 0}}>
            
          </Paper>
        </Container>
      </Grid>
      <Grid item xs={6}>
        <FormDisplay
          title="Formulário teste"
          onSubmit={handleSubmit} 
          inputs={inputs}
        />  
      </Grid>
    </Grid>
  )
};

export default NewForm;
