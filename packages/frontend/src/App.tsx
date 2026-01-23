import { Discipline } from '@cubing/shared';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/system';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/navigation/Sidebar';
import { SolveProvider } from './contexts/SolveContext';
import { TimerSettingsProvider } from './contexts/TimerSettingsContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import Licenses from './pages/LicenseScreen';
import StatisticsScreen from './pages/StatisticsScreen';
import TimerScreen from './pages/TimerScreen';
import DBReader from './services/dbReader';
import theme from './styles/theme';

const dbReader: DBReader = DBReader.instance;

function App() {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState<boolean>(true);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lastSelectedDiscipline, setLastSelectedDiscipline] = useLocalStorage("selectedDiscipline", Discipline.ThreeByThree);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(lastSelectedDiscipline);
  const [selectedSession] = useState<string>("default");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [sidebarResizing, setSidebarResizing] = useState<boolean>(false);

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

    const interval = setInterval(checkStatus, 2000);
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
        <SolveProvider selectedDiscipline={selectedDiscipline} selectedSession={selectedSession}>
          <CssBaseline />
          {backendOnline ? (
            <Box sx={{ width: "100%", height: "100%", bgcolor: theme.palette.primary.main, display: "flex" }}>
              <Sidebar selectedDiscipline={selectedDiscipline}
                onDisciplineChange={handleDisciplineChange}
                isCollapsed={sidebarIsCollapsed}
                setIsCollapsed={setSidebarIsCollapsed}
                isVisible={sidebarVisible}
                isMobile={isMobile}
                toggleResize={(b: boolean) => setSidebarResizing(b)}
              />
              <Box sx={{ height: "100%", bgcolor: "blue", width: "100%" }}>
                <Routes>
                  <Route path="/" element={
                    <TimerScreen
                      selectedDiscipline={selectedDiscipline}
                      updateSidebarVisibility={(visible: boolean) => setSidebarVisible(visible)}
                      setSidebarIsCollapsed={setSidebarIsCollapsed}
                    />} />
                  <Route path="/stats" element={<StatisticsScreen selectedDiscipline={selectedDiscipline} sidebarResizing={sidebarResizing} />} />
                  <Route path="/privacy-policy" element={<Licenses />} />
                </Routes>
              </Box>
            </Box>
          ) : (<h1>There seems to be something wrong</h1>)}
        </SolveProvider>
      </TimerSettingsProvider>
    </ThemeProvider >
  )
}

export default App
