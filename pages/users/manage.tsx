import React, { useContext, useEffect, useState } from 'react'
import withAccessRestricion from '@lib/hocs/withAccessRestriction'
import User, { UserAccessType, UserStatus, UserType } from '@lib/models/user'
import { fetchUsers, FetchUsersResultCodes } from '@lib/services/fetchUsers'
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Check, Close, Restore } from '@mui/icons-material'
import { Unsubscribe } from '@firebase/util'
import updateUserData from '@lib/services/updateUserData'
import UserContext from '@lib/conxtexts/userContext'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

interface ManageUsersPageProps {
  loading: boolean
}


const ManageUsersPage = ({ loading }: ManageUsersPageProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User>()
  const { user: loggedUser } = useContext(UserContext)

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {};
    fetchUsers((users) => {
      setAllUsers(users)
    }).then(result => {
      if (result.status === FetchUsersResultCodes.Success)
        unsubscribe = result.unsubscribe as Unsubscribe
    })

    return unsubscribe
  }, [])

  const openAcceptDialog = (user: User) => {
    setOpen(true);
    setCurrentUser(user)
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(undefined)
  };

  const handleAcceptFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const data: Record<string, any> = {}

    for (let [inputName, value] of form.entries()) {
      data[`${inputName}`] = Number(value)
    }

    updateUserData({
      ...(currentUser as User),
      status: UserStatus.Aprovado,
      ...data
    })

    handleClose()
  }
    
  const rejectUser = (user: User) => {
    updateUserData({
      ...user,
      status: UserStatus.Reprovado,
      access_type: UserAccessType.Usuário,
      type: UserType.Indefinido
    })
  }
  
  const restoreUser = (user: User) => {
    updateUserData({
      ...user,
      status: UserStatus['Aguardando Aprovação'],
      access_type: UserAccessType.Usuário,
      type: UserType.Indefinido
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'displayName',
      headerName: 'Nome',
      flex: 0.4
    },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 0.4
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.4,
      valueGetter: (params) => (
        `${UserStatus[params.row.status]}`
      )
    },
    {
      field: 'access_type',
      headerName: 'Permissões de Usuário',
      flex: 0.4,
      valueGetter: params => `${UserAccessType[params.row.access_type]}`
    },
    {
      field: 'type',
      headerName: 'Tipo de Usuário',
      flex: 0.4,
      valueGetter: params => `${UserType[params.row.type]}`
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.1,
      renderCell: (params) => {
        switch (params.row.status) {
          case UserStatus['Aprovado']:
            return (
              <Tooltip title="Reprovar">
                <IconButton color="error" onClick={() => rejectUser(params.row)}>
                  <Close />
                </IconButton>
              </Tooltip>
            )
          case UserStatus['Aguardando Aprovação']:
            return (
              <>
                <Tooltip title="Aprovar">
                  <IconButton color="success" onClick={() => openAcceptDialog(params.row)}>
                    <Check />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reprovar">
                  <IconButton color="error" onClick={() => rejectUser(params.row)}>
                    <Close />
                  </IconButton>
                </Tooltip>
              </>
            )
          case UserStatus['Reprovado']:
            return (
              <Tooltip title="Restaurar">
                <IconButton color="warning" onClick={() => restoreUser(params.row)}>
                  <Restore />
                </IconButton>
              </Tooltip>
            )
          default:
            return (<></>)
        }
      }
    }
  ]
  
  if (loading) {
    return (
      <div>Carregando...</div>
    )
  }
  
  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Usuários Cadastrados
        </Typography>
        <DataGrid 
          rows={allUsers.filter(user => user.email !== loggedUser?.email)}
          columns={columns}
          getRowId={row => row.uid}
          autoHeight
        />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Para aprovar este usuário selecione o tipo de usuário e as suas permissões
          </DialogContentText>
          <form onSubmit={handleAcceptFormSubmit} id="accept-user-form">
          <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-type-label">Tipo de Usuário</InputLabel>
              <Select
                labelId="user-type-label"
                id="user-type"
                name="type"
                label="Tipo de Usuário"
                required
                defaultValue={UserType.Interno}
              >                
                {
                  Object.entries(UserType).map(([value, label], id) => {
                    if (isNaN(Number(value)) ||  Number(value) === 0)
                      return
                    return (
                      <MenuItem value={value} key={value}>{label}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="access-type-label">Permissões do Usuário</InputLabel>
              <Select
                labelId="access-type-label"
                id="access-type"
                name="access_type"
                label="Permissões do Usuário"
                defaultValue={currentUser?.access_type}
                required
              >
                {
                  Object.entries(UserAccessType).map(([value, label], id) => {
                    if (isNaN(Number(value)))
                      return
                    return (
                      <MenuItem value={value} key={value}>{label}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" form="accept-user-form">Confirmar</Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}

ManageUsersPage.displayName = 'Gestão de Usuários'
ManageUsersPage.accessLevel = UserAccessType.Administrador

const ManageUsersWithAccessRestriction = withAccessRestricion(ManageUsersPage)
ManageUsersWithAccessRestriction.displayName = ManageUsersPage.displayName

export default ManageUsersWithAccessRestriction