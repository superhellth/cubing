import { Discipline } from '@cubing/shared';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/navigation/Sidebar';
import { useLocalStorage } from './hooks/useLocalStorage';
import Licenses from './pages/LicenseScreen';
import StatisticsScreen from './pages/StatisticsScreen';
import TimerScreen from './pages/TimerScreen';
import DBReader from './services/dbReader';
import theme from './styles/theme';

const dbReader: DBReader = DBReader.instance;

// function useWindowWidth() {
//   const [width, setWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return width;
// }

function App() {
  // const width = useWindowWidth();
  // const isMobile = width <= 768;
  const [lastSelectedDiscipline, setLastSelectedDiscipline] = useLocalStorage("selectedDiscipline", Discipline.ThreeByThree);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(lastSelectedDiscipline);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  // On Startup: Check if backend is online
  useEffect(() => {
    const checkStatus = async () => {
      const status = await dbReader.checkHealth();
      setBackendOnline(status);
    };
    checkStatus();

    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleDisciplineChange = (disc: Discipline) => {
    setSelectedDiscipline(disc);
    setLastSelectedDiscipline(disc);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {backendOnline ? (

        <Box sx={{
          width: "100%", height: "100%", bgcolor: "primary.main", display: "flex", gridAutoFlow: 'column', gridTemplateRows: '100%'
        }}>
          <Sidebar selectedDiscipline={selectedDiscipline} onDisciplineChange={handleDisciplineChange} isVisible={sidebarVisible} />
          <Box sx={{ height: "100%", bgcolor: "blue", width: "100%" }}>
            <Routes>
              <Route path="/" element={<TimerScreen selectedDiscipline={selectedDiscipline} updateSidebarVisibility={(visible: boolean) => setSidebarVisible(visible)} />} />
              <Route path="/stats" element={<StatisticsScreen />} />
              <Route path="/licenses" element={<Licenses />} />
            </Routes>
          </Box>
        </Box>
      ) : (<h1>There seems to be something wrong</h1>)}
    </ThemeProvider >
  )
}

export default App
