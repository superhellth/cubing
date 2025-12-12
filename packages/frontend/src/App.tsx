import { Discipline } from '@cubing/shared';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/system';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import Licenses from './pages/LicenseScreen';
import StatisticsScreen from './pages/StatisticsScreen';
import TimerScreen from './pages/TimerScreen';
import DBReader from './services/dbReader';
import theme from './styles/theme';
import Sidebar from './components/navigation/Sidebar';
import { TimerSettingsProvider } from './hooks/TimerSettingsContext';

const dbReader: DBReader = DBReader.instance;

function App() {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lastSelectedDiscipline, setLastSelectedDiscipline] = useLocalStorage("selectedDiscipline", Discipline.ThreeByThree);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(lastSelectedDiscipline);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // On Startup: Check if backend is online
  useEffect(() => {
    const checkStatus = async () => {
      const status = await dbReader.checkHealth();
      setBackendOnline(status);
    };
    checkStatus();
    setHasMounted(true);

    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  if (!hasMounted) return null;

  const handleDisciplineChange = (disc: Discipline) => {
    setSelectedDiscipline(disc);
    setLastSelectedDiscipline(disc);
  };

  return (
    <ThemeProvider theme={theme}>
      <TimerSettingsProvider>
        <CssBaseline />
        {backendOnline ? (
          <Box sx={{ width: "100%", height: "100%", bgcolor: theme.palette.primary.main, display: "flex" }}>
            <Sidebar selectedDiscipline={selectedDiscipline} onDisciplineChange={handleDisciplineChange} isVisible={sidebarVisible} isMobile={isMobile} />
            <Box sx={{ height: "100%", bgcolor: "blue", width: "100%" }}>
              <Routes>
                <Route path="/" element={<TimerScreen selectedDiscipline={selectedDiscipline} updateSidebarVisibility={(visible: boolean) => setSidebarVisible(visible)} />} />
                <Route path="/stats" element={<StatisticsScreen />} />
                <Route path="/privacy-policy" element={<Licenses />} />
              </Routes>
            </Box>
          </Box>
        ) : (<h1>There seems to be something wrong</h1>)}
      </TimerSettingsProvider>
    </ThemeProvider >
  )
}

export default App
