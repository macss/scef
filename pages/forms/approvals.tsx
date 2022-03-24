import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import withAccessRestricion from '@lib/hocs/withAccessRestriction';
import User, { UserAccessType } from '@lib/models/user';
import fetchPendingForms, { FetchPendingFormsResultCodes } from '@lib/services/fetchPendingForms';
import readData, { ReadDataResultCodes } from '@lib/services/readData';
import BarrierPass from '@lib/models/barrierPass';
import { FormApprovalStatus } from '@lib/models/database';
import { Unsubscribe } from '@firebase/util';
import { fetchUsers } from '@lib/services/fetchUsers';

const getColumns = (users: User[]) => {
  const columns: GridColDef[] = [
    {
      field: 'form_id',
      headerName: 'Formulário',
      flex: .6,
      valueGetter: params => {
        switch (params.row.form_id) {
          case 'barrierPass':
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
      }
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
                <br />
              </Typography>
            ))}
          </div>
        )
      }
    },
    { 
      field: 'observacoes', 
      headerName: 'Observações', 
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ overflowY: 'auto', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 1 }}>
            <Typography variant="body2">
              {params.row.observacoes}
            </Typography>
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
      flex: 0.5
    },
  ];

  return columns
}

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

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p:2 }}>
        <DataGrid
          rows={pendingForms}
          columns={getColumns(users)}
          pageSize={5}
          rowsPerPageOptions={[5]}
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

export default Approvals