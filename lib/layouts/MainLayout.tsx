import { Link } from '@lib/components';
import { ExpandLess, Inbox, Mail, Menu, ViewList } from '@mui/icons-material';
import { 
  AppBar, 
  Box, 
  Collapse, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography 
} from '@mui/material';
import React, { useState } from 'react'
import routes from 'routes';

const drawerWidth = 240;

const MainLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [formsOpen, setFormsOpen] = useState(false)

  const handleDrawerToggle = () => setMobileOpen(v => !v)
  const handleFormsToggle = () => setFormsOpen(v => !v)


  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SCEF
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <Inbox /> : <Mail />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleFormsToggle}>
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
        </ListItem>
        <Collapse in={formsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {routes.sort((a,b) => a.slug.localeCompare(b.slug)).map(route => (
              <ListItem button sx={{ pl: 4 }} key={route.slug} component={Link} href={`/forms/${route.slug}`}>
                <ListItemText primary={route.component.displayName} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );

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
          <Typography variant="h6" noWrap component="div">
            Sistema de Controle e Emissão de Formulários
          </Typography>
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
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout