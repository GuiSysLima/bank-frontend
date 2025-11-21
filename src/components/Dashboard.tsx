import React, { useState, useEffect , useMemo} from 'react';
import api from '../api';
import keycloak from '../keycloak';
import { useUser } from '../contexts/UserContext';
import { AccountType } from '../model/enums/AccountType';

import{
  AppBar, Toolbar, Typography, Button, Container, Card, CardContent,
  CardActions, IconButton, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress
} from '@mui/material';

import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Account {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
}

export const Dashboard: React.FC = () => {
const { user } = useUser();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState<AccountType>(AccountType.CHECKING_ACCOUNT);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/accounts')
      .then(response => {
        setAccounts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar suas contas.");
        setLoading(false);
      });
  }, []);

  const totalBalance = useMemo(() => {
      return accounts.reduce((acc, curr) => acc + curr.balance, 0);
    }, [accounts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleCreateAccount = async () => {
    setError(null);
    setCreateLoading(true);
    try {
      const response = await api.post('/accounts', { accountType: newAccountType });
      setAccounts([...accounts, response.data]);
      setOpenModal(false);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar conta.");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* --- BARRA SUPERIOR (NAVBAR) --- */}
      <AppBar position="static">
        <Toolbar>
          <AccountBalanceIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            UFAPE Bank
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Olá, {user?.name}
          </Typography>
          <Button color="inherit" onClick={() => keycloak.logout()} startIcon={<LogoutIcon />}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        
        {/* --- RESUMO DO SALDO --- */}
        <Card sx={{ mb: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Saldo Total Consolidado
            </Typography>
            <Typography variant="h3" component="div" fontWeight="bold">
              {formatCurrency(totalBalance)}
            </Typography>
          </CardContent>
        </Card>

        {/* --- TÍTULO E BOTÃO DE NOVA CONTA --- */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" color="text.secondary">
            Minhas Contas
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenModal(true)}
          >
            Nova Conta
          </Button>
        </Box>

        {/* --- LISTA DE CONTAS (GRID) --- */}
        <Grid container spacing={3}>
          {accounts.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">Você ainda não possui contas. Clique em "Nova Conta" para começar.</Alert>
            </Grid>
          ) : (
            accounts.map((account) => (
              <Grid size={{ xs: 12, md: 6 }} key={account.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                      <Typography color="text.secondary" gutterBottom>
                        {account.accountType === AccountType.CHECKING_ACCOUNT ? 'Conta Corrente' : 'Conta Poupança'}
                      </Typography>
                    </Box>
                    <Typography variant="h5" component="div">
                      {formatCurrency(account.balance)}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Nº: {account.accountNumber}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Ver Extrato</Button>
                    <Button size="small" color="success">Depositar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

      </Container>

      {/* --- MODAL DE CRIAR CONTA --- */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Abrir Nova Conta</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Tipo de Conta</InputLabel>
            <Select
              value={newAccountType}
              label="Tipo de Conta"
              onChange={(e) => setNewAccountType(e.target.value as AccountType)}
            >
              <MenuItem value={AccountType.CHECKING_ACCOUNT}>Conta Corrente</MenuItem>
              <MenuItem value={AccountType.SAVINGS_ACCOUNT}>Conta Poupança</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleCreateAccount} variant="contained" disabled={createLoading}>
            {createLoading ? 'Criando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};