import { onAuthStateChanged, signOut, Unsubscribe, User as UserData } from '@firebase/auth';
import { Link } from '@lib/components';
import { UserStatus } from '@lib/models/user';
import readData from '@lib/services/readData';
import { Check, ExitToApp, ExpandLess, Inbox, Mail, Menu, ViewList } from '@mui/icons-material';
import { 
  AppBar, 
  Avatar, 
  Box, 
  Collapse, 
  Container, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography 
} from '@mui/material';
import { auth } from 'config/firebaseConfig';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import User from '@lib/models/user'
import routes from 'routes';
import UserContext from '@lib/conxtexts/userContext';
import listenToData, { ListenToDataResultCodes } from '@lib/services/listenToData';

const drawerWidth = 240;

const MainLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [formsOpen, setFormsOpen] = useState(true)
  const [user, setUser] = useState<User>()
  const [userData, setUserData] = useState<UserData>()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleDrawerToggle = () => setMobileOpen(v => !v)
  const handleFormsToggle = () => setFormsOpen(v => !v)

  /**
   * Checks if there is a user logged in
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false)
        router.push('/login')
      } else {
        setUserData(user)
      }
    })

    return unsubscribe
  }, [router])

  /**
   * Fetchs user permissions in db
   */
  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {}
    if (userData)
      listenToData('users', userData.uid, (userInfo) => {
        setUser(userInfo)
        setLoading(false)
      }).then(result => {
        if (result.code === ListenToDataResultCodes.SUCCESS)
          unsubscribe = result.unsubscribe
      })

    return unsubscribe
  }, [userData])

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SCEF
        </Typography>
      </Toolbar>
      <Divider />
      {user?.status == UserStatus.Aprovado && <><List>
        <ListItemButton component={Link} href="/forms/approvals">
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          <ListItemText primary="Aprovações"/>
        </ListItemButton>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItemButton key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <Inbox /> : <Mail />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleFormsToggle}>
          <ListItemIcon>
            <ViewList />
          </ListItemIcon>
          <ListItemText primary="Formulários" />
          <ExpandLess 
            sx={{
              transform: formsOpen ? 'rotate(-0deg)' : 'rotate(180deg)',
              transition: theme => theme.transitions.create('transform', {
                duration: theme.transitions.duration.standard
              })
            }} 
          />
        </ListItemButton>
        <Collapse in={formsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {routes.sort((a,b) => a.slug.localeCompare(b.slug)).map(route => (
              <ListItemButton sx={{ pl: 4 }} key={route.slug} component={Link} href={`/forms/${route.slug}`}>
                <ListItemText primary={route.component.displayName} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List></>}
    </div>
  );

  if (loading) {
    return (
      <Container>
        Carregando...
      </Container>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          transition: theme => theme.transitions.create('width', {
            duration: theme.transitions.duration.standard
          })
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            Sistema de Controle e Emissão de Formulários
          </Typography>   
          <Avatar 
            alt={userData?.displayName ?? 'Anonymous'}
            src={userData?.photoURL ?? ''}
          />       
          <IconButton onClick={() => signOut(auth)} color="inherit">
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          alignItems: 'flex-start', 
          transition: theme => theme.transitions.create('width', {
            duration: theme.transitions.duration.standard
          }) 
      }}
      >
        <Toolbar />
        <UserContext.Provider value={{ user: userData }}>
          {user?.status === UserStatus.Aprovado ? children :
          <div>
            Seu acesso ao sistema ainda não foi liberado, entre em contato com um administrador para liberar o acesso.
          </div>
          }
        </UserContext.Provider>
      </Box>
    </Box>
  );
}

export default MainLayout