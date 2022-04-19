import React, { useEffect, useState } from 'react'
import { Box, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import withAccessRestricion from '@lib/hocs/withAccessRestriction';
import User, { UserAccessType, UserType } from '@lib/models/user';
import fetchPendingForms from '@lib/services/fetchPendingForms';
import BarrierPass from '@lib/models/barrierPass';
import Database, { FormApprovalStatus, FormCommon } from '@lib/models/database';
import { Unsubscribe } from '@firebase/util';
import { fetchUsers } from '@lib/services/fetchUsers';
import { Info, Check, Close } from '@mui/icons-material';
import { auth } from 'config/firebaseConfig';
import updateFormInfo from '@lib/services/updateFormInfo';
import { serverTimestamp } from '@firebase/firestore';

const Approvals = () => {
  const [pendingForms, setPendingForms] = useState<any[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}

    fetchPendingForms((forms) => setPendingForms(forms))
      .then(result => {
        unsubscribe = result.unsubscribe ?? unsubscribe
      })

    return unsubscribe
  }, [])

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}

    fetchUsers(users => setUsers(users))
      .then(result => {
        unsubscribe = result.unsubscribe ?? unsubscribe
      })

    return unsubscribe
  })

  const handleApprove = <P extends keyof Database['forms'], F extends Database['forms'][P]['responses'][string]>(form: F) => {
    const currentUser = users.find(user => user.uid === auth.currentUser?.uid)

    // Checa se o usuário está logado e qual o nível de acesso do usuário
    if (currentUser && (currentUser.access_type === UserAccessType['Aprovador'] || currentUser.access_type === UserAccessType['Administrador'])) {
      // Checa se o estado é aguardando aprovação e se o usuário é próprio, caso seja, envia para aprovação do fornecedor
      if (form.status === FormApprovalStatus['Aguardando Aprovação'] && currentUser.type === UserType['Interno']) {
        updateFormInfo(form.form_id, {
          ...(form as Database['forms'][typeof form.form_id]['responses'][string]),
          status: FormApprovalStatus['Aprovado pelo Gestor'],
          historico: {
            ...form['historico'],
            'aprovacao_gestor': {
              userId: currentUser.uid,
              date: (serverTimestamp() as any)
            }
          }
        })
      }

      if (form.status === FormApprovalStatus['Aprovado pelo Gestor'] && currentUser.type === UserType['Externo']) {
        updateFormInfo(form.form_id, {
          ...(form as Database['forms'][typeof form.form_id]['responses'][string]),
          status: FormApprovalStatus['Recebido pelo Fornecedor'],
          historico: {
            ...form['historico'],
            'recebimento_prestador': {
              userId: currentUser.uid,
              date: (serverTimestamp() as any)
            }
          }
        })
      }

    }
  }

  const handleReject = <P extends keyof Database['forms'], F extends Database['forms'][P]['responses'][string]>(form: F) => {
    const currentUser = users.find(user => user.uid === auth.currentUser?.uid)

    if ( currentUser && (currentUser.access_type === UserAccessType['Aprovador'] || currentUser.access_type === UserAccessType['Administrador'])) {
      updateFormInfo(form.form_id, {
        ...(form as Database['forms'][typeof form.form_id]['responses'][string]),
        status: FormApprovalStatus['Reprovado'],
        historico: {
          ...form['historico'],
          'cancelamento': {
            userId: currentUser.uid,
            date: (serverTimestamp() as any)
          }
        }
      })
    }
  }

  const getColumns = (users: User[]) => {
    const columns: GridColDef[] = [
      {
        field: 'form_id',
        headerName: 'Formulário',
        flex: .6,
        valueGetter: params => {
          switch (params.row.form_id) {
            case 'barrier_pass':
              return 'Passe de Barreira'
            default:
              return 'Formulário Desconhecido'
          }
        }
      },
      {
        field: 'created_at',
        headerName: 'Data de Criação',
        flex: .6,
        valueGetter: params => (new Date(params.row.created_at.seconds * 1000)).toLocaleString()
      },
      { 
        field: 'destinatario', 
        headerName: 'Destinatário', 
        flex: 1,
        renderCell: (params) => {
          const { displayName: name, email } = users.find(user => user.uid === params.row.destinatario) || { displayName: '', email: '' }
          return (
            <div style={{ overflowY: 'auto', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Typography variant="body2">
                {name}
              </Typography>
              <Typography variant="body2"> 
                {email}
              </Typography>
            </div>
          )
        }
      },
      { 
        field: 'solicitante', 
        headerName: 'Solicitante', 
        flex: 1,
        valueGetter: (params) => {
          const { displayName: name } = users.find(user => user.uid === params.row.solicitante) || { displayName: '' }
          return name
        },
        renderCell: (params) => (
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, width: '100%'}}>
            <Typography variant="body2" sx={{flexGrow: 1}}>
              {params.value}
            </Typography>
            {
              params.row.observacoes && <Tooltip title={params.row.observacoes}>
                <Info />
              </Tooltip>
            }
          </Box>
        )
      },
      { 
        field: 'materiais', 
        headerName: 'Materiais', 
        flex: 0.8,
        renderCell: (params) => {
          return (
            <div style={{ overflowY: 'auto', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 1 }}>
              {params.row.materiais.map((lista: BarrierPass['materiais'][number], idx: number) => (
                <Typography key={idx} variant="body2">
                  {`${lista.qty}x ${lista.material}`}
                </Typography>
              ))}
            </div>
          )
        }
      },
      { 
        field: 'status', 
        headerName: 'Status', 
        flex: 1,
        valueGetter: (params) => FormApprovalStatus[params.row.status]
      },
      { 
        field: 'uid', 
        headerName: 'Ações', 
        flex: 0.5,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <Tooltip title="Aprovar">
              <IconButton color="success" onClick={() => handleApprove(params.row)}>
                <Check />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reprovar">
              <IconButton color="error" onClick={() => handleReject(params.row)}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    ];
  
    return columns
  }

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p:2 }}>
        <DataGrid
          rows={pendingForms}
          columns={getColumns(users)}
          pageSize={50}
          disableSelectionOnClick
          autoHeight
          getRowId={row => row.uid}
        />
      </Paper>
    </Container>
  )
}

Approvals.displayName = 'Aprovações'
Approvals.accessLevel = UserAccessType['Aprovador']

const ApprovalsWithAccessRestriction = withAccessRestricion(Approvals)
ApprovalsWithAccessRestriction.displayName = Approvals.displayName

export default ApprovalsWithAccessRestriction