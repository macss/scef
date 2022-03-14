import { createTheme } from "@mui/material/styles";
import { ptBR as corePTBR } from '@mui/material/locale'
import { ptBR } from '@mui/x-data-grid'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d1359'
    },
    secondary: {
      main: '#634104'
    }
  }
},
corePTBR,
ptBR
)

export default theme