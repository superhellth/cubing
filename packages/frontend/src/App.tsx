import AlarmFilledIcon from '@mui/icons-material/Alarm';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import theme from '../theme';
import './App.css';
import AlgorithmScreen from './modules/algorithms/AlgorithmScreen';
import TimerScreen from './modules/timer/TimerScreen';
import { Discipline } from '@cubing/shared';

function App() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const [mouseInArea, setMouseInArea] = useState<boolean>();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(Discipline.ThreeByThree);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const onMouseLeave = () => {
    setMouseInArea(false);
  }
  const onMouseEnter = () => {
    setMouseInArea(true);
    setOpenDrawer(true);
  }

  useEffect(() => {
    if (mouseInArea) return;

    const timer = setTimeout(() => {
      setOpenDrawer(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [mouseInArea]);

  const DisciplineButton = ({ name, size, disc }: { name: string, size: number, disc: Discipline }) => (
    <Button sx={{ color: "text.primary" }} onClick={() => { setSelectedDiscipline(disc); navigate("/") }}>
      <i className={`cubing-icon event-${name}`} style={{ fontSize: size }} />
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: "100%", height: "100%", margin: "0 auto", bgcolor: "secondary.main", display: "flex" }}>
        <Box sx={{ width: "100px", bgcolor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
          <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Button sx={{
              color: currentPath === "/" ? "primary.main" : "text.primary"
            }} onClick={() => { navigate("/") }}>
              <AlarmFilledIcon sx={{ fontSize: 40 }} />
            </Button>
          </Box>
          <Button sx={{
            color: currentPath === "/algs" ? "primary.main" : "text.primary"
          }} onClick={() => navigate("/algs")}>
            <QueryStatsOutlinedIcon sx={{ fontSize: 40 }} />
          </Button>
        </Box>
        <Divider orientation="vertical" sx={{ bgcolor: "secondary.main" }} flexItem component="div" />
        <Collapse in={openDrawer} orientation='horizontal' sx={{ height: "100%", bgcolor: "secondary.main" }} >
          <Box sx={{ width: "100px", height: "100vh", bgcolor: "secondary.main", display: "flex", flexDirection: "column", justifyContent: "space-around" }}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {[["333", Discipline.ThreeByThree], ["333oh", Discipline.OneHanded], ["333bf", Discipline.ThreeBlind], ["333fm", Discipline.FewestMoves]]
              .map(([event, disc], index) =>
                <DisciplineButton key={event} name={event} size={40} disc={disc as Discipline} />
              )}
          </Box>
          <Divider orientation="vertical" sx={{ bgcolor: "primary.main" }} flexItem component="div" />
        </Collapse>
        <Box sx={{ flex: 20, height: "100%", bgcolor: "blue" }}>
          <Routes>
            <Route path="/" element={<TimerScreen selDis={selectedDiscipline} />} />
            <Route path="/algs" element={<AlgorithmScreen />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider >
  )
}

export default App
