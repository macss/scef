import React, { useEffect, useState } from 'react';
import { 
  Select, 
  SelectProps, 
  MenuItem,
  Button, 
  ButtonTypeMap,
  ExtendButtonBase, 
  Checkbox, 
  CheckboxProps, 
  TextField, 
  TextFieldProps, 
  Radio, 
  RadioProps, 
  Container, 
  Typography, 
  FormControl, 
  InputLabel,
  Paper
} from '@mui/material'
import Head from 'next/head';

import { SxProps, Theme } from '@mui/material/styles';

export type InputTypes = 'select' | 'button' | 'text-field' // | 'checkbox' | 'radio' |

type InputPropsMapping = {
  'select': SelectProps & {
    options: Record<string, any>
  },
  'button': ExtendButtonBase<ButtonTypeMap<{}, 'button'>>,
  //'checkbox': CheckboxProps,
  //'radio': RadioProps,
  'text-field': TextFieldProps,
}

type FormProps = React.ClassAttributes<HTMLFormElement> & React.FormHTMLAttributes<HTMLFormElement>
export type ErrorMessage = { active: boolean, message: string }

export interface FormDisplayProps<T extends InputTypes> extends FormProps {
  title: string
  inputs: Record<string, InputPropsMapping[T] & { inputType: T }>
  errors?: Record<keyof FormDisplayProps<T>["inputs"], ErrorMessage> 
}

const FormDisplay = <T extends InputTypes>(props: FormDisplayProps<T>) => {
  const { inputs, title, errors, ...rest } = props
  const [formInputs, setFormInputs] = useState<React.ReactNode[]>()

  useEffect(() => {
    const newInputs = Object.entries(inputs).map(([inputName, {inputType, ...inputProps}], key) => {
      const commonProps: { sx?: SxProps<Theme> } & Record<any, any> = {
        fullWidth: true,
        sx: {
          my: 1,
        },
        required: true
      }
      const helperText = (errors && errors[inputName]) ? errors[inputName].message : (inputProps as any).helperText ?? ''

      switch (inputType) {
        case 'select':
          const { options, ...rest } = inputProps as unknown as InputPropsMapping['select']
          const id = `select-${key}-label`

          return (
            <FormControl {...commonProps}>
              <InputLabel id={id}>{rest?.label}</InputLabel>
              <Select {...rest} key={key} labelId={id} name={inputName}>
                {
                  Object.entries(options).map(([name, value]) => 
                    <MenuItem key={name} value={value}>{name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          )
        case 'button':
          return (
            <Button 
              {...commonProps} 
              {...inputProps} 
              key={key} 
            />
          )
        case 'text-field':
          <TextField 
                {...commonProps} 
                {...inputProps} 
                key={key} 
                name={inputName} 
                error={(errors && errors[inputName]) ? true : undefined} 
                helperText={helperText}
              />
        default:
          break;
      }
    })

    setFormInputs(newInputs)
  }, [inputs, errors])

  return (
    <Container>
      <Head>
        <title>{`${title} - SCEF - Sistema de Controle e Emissão de Formulários`}</title>
      </Head>
      <Paper sx={{
        p: 2
      }}>
        <form onSubmit={e => e.preventDefault()} {...rest}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              mt:2,
              mx: 2,
              textAlign: 'center'
            }}
            >
            {title}
          </Typography>
          {formInputs?.map((input, key) => (
            <React.Fragment key={key}>
              {input}
            </React.Fragment>
          ))}
        </form>
      </Paper>
    </Container>
  )
};

export default FormDisplay;
