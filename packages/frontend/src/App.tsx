import AlarmFilledIcon from '@mui/icons-material/Alarm';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';
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
import Slide from '@mui/material/Slide';

function App() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const [mouseInArea, setMouseInArea] = useState<boolean>();
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(Discipline.ThreeByThree);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const eventsAndDisciplines = [["333", Discipline.ThreeByThree], ["333oh", Discipline.OneHanded], ["333bf", Discipline.ThreeBlind], ["333fm", Discipline.FewestMoves],
  ["444", Discipline.FourByFour], ["555", Discipline.FiveByFive], ["666", Discipline.SixBySix], ["777", Discipline.SevenBySeven], ["clock", Discipline.Clock]];

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
    <Button sx={{ color: "text.primary", "&:hover": { color: "info.main" } }} onClick={() => { setOpenDrawer(false); setSelectedDiscipline(disc); navigate("/") }}>
      <i className={`cubing-icon event-${name}`} style={{ fontSize: size }} />
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: "100%", height: "100%", margin: "0 auto", bgcolor: "secondary.main", display: "flex" }}>
        <Box sx={{ width: "100px", bgcolor: "secondary.main", zIndex: 5, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
          <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Button sx={{
              color: currentPath === "/" ? "info.main" : "text.primary"
            }} onClick={() => { navigate("/") }}>
              <AlarmFilledIcon sx={{ fontSize: 40 }} />
            </Button>
          </Box>
          <Button sx={{
            color: currentPath === "/algs" ? "info.main" : "text.primary"
          }} onClick={() => navigate("/algs")}>
            <QueryStatsOutlinedIcon sx={{ fontSize: 40 }} />
          </Button>
        </Box>
        <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
        <Slide in={openDrawer} direction='right' >
          <Box sx={{ display: "flex", flexDirection: "row", zIndex: 1, height: "100%", bgcolor: "secondary.main", position: "absolute", left: "100px" }}>
            <Box sx={{ width: "100px", height: "100vh", bgcolor: "primary.main", display: "flex", flexDirection: "column", justifyContent: "space-around" }}
              onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
              {eventsAndDisciplines.map(([event, disc], index) =>
                <DisciplineButton key={event} name={event} size={40} disc={disc as Discipline} />
              )}
            </Box>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
          </Box>
        </Slide >
        <Box sx={{ flex: 20, height: "100%", bgcolor: "blue" }}>
          <Routes>
            <Route path="/" element={<TimerScreen selectedDiscipline={selectedDiscipline} />} />
            <Route path="/algs" element={<AlgorithmScreen />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider >
  )
}

export default App
