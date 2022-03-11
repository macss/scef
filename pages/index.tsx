import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import type { NextPage } from 'next'
import { Link, Copyright } from '@lib/components'
import { useContext } from 'react';
import UserContext from '@lib/conxtexts/userContext';

const Home: NextPage = () => {
  const { user } = useContext(UserContext)

  return (
    <Container maxWidth="lg">
      Bem vindo { user?.displayName },
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <Copyright />
      </Box>
    </Container>
  );
};

Home.displayName = 'Página Inicial'

export default Home
