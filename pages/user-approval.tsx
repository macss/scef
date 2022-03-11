import React, { useEffect, useState } from 'react'
import withAccessRestricion from '@lib/hocs/withAccessRestriction'
import User, { UserAccessType, UserStatus, UserType } from '@lib/models/user'
import { fetchUnapprovedUsers, FetchUnapprovedUsersResultCodes } from '@lib/services/fetchUnapprovedUsers'
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Check, Close, Restore } from '@mui/icons-material'
import { Unsubscribe } from '@firebase/util'
import updateUserData from '@lib/services/updateUserData'

interface UserApprovalPageProps {
  loading: boolean
}

const UserApprovalPage = ({ loading }: UserApprovalPageProps) => {
  const [unapprovedUsers, setUnapprovedUsers] = useState<User[]>()
  const [open, setOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {};
    fetchUnapprovedUsers((users) => {
      setUnapprovedUsers(users)
    }).then(result => {
      if (result.status === FetchUnapprovedUsersResultCodes.Success)
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
      status: UserStatus.Reprovado
    })
  }
  
  const restoreUser = (user: User) => {
    updateUserData({
      ...user,
      status: UserStatus['Aguardando Aprovação']
    })
  }
  
  if (loading) {
    return (
      <div>Carregando...</div>
    )
  }
  
  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5">
          Usuários Pendentes
        </Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              unapprovedUsers?.filter(user => user.status === UserStatus['Aguardando Aprovação']).map((user, idx) => (
                <TableRow key={user.uid}>
                  <TableCell component="th" scope="row">
                    {idx+1}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{UserStatus[user.status]}</TableCell>
                  <TableCell>
                    <Tooltip title="Aprovar">
                      <IconButton color="success" onClick={() => openAcceptDialog(user)}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reprovar">
                      <IconButton color="error" onClick={() => rejectUser(user)}>
                        <Close />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <Typography variant="h5" sx={{mt: 4}}>
          Usuários Reprovados
        </Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              unapprovedUsers?.filter(user => user.status === UserStatus['Reprovado']).map((user, idx) => (
                <TableRow key={user.uid}>
                  <TableCell component="th" scope="row">
                    {idx+1}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{UserStatus[user.status]}</TableCell>
                  <TableCell>
                    <Tooltip title="Restaurar">
                      <IconButton color="warning" onClick={() => restoreUser(user)}>
                        <Restore />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <Divider />
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

UserApprovalPage.displayName = 'Aprovar Usuários'
UserApprovalPage.accessLevel = UserAccessType.Admnistrador

const UserApprovalWithAccessRestriction = withAccessRestricion(UserApprovalPage)
UserApprovalWithAccessRestriction.displayName = UserApprovalPage.displayName

export default UserApprovalWithAccessRestriction