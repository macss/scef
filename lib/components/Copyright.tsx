import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="mailto:macsoares1@gmail.com">
        Marco Antônio Chaves Soares
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default Copyright