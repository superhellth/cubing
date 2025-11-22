import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import { ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import theme from '../theme';
import './App.css';
import Licenses from './Licenses';
import AlgorithmScreen from './modules/algorithms/AlgorithmScreen';
import TimerScreen from './modules/timer/TimerScreen';
import { useLocalStorage } from './modules/utils/timer_utils';
import DBReader from './modules/api/db_reader';

const dbReader: DBReader = new DBReader();

function App() {
  const [lastSelectedDiscipline, setLastSelectedDiscipline] = useLocalStorage("selectedDiscipline", Discipline.ThreeByThree);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [mouseInArea, setMouseInArea] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(lastSelectedDiscipline);
  const ignoreMouseRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  //, ["333fm", Discipline.FewestMoves]
  const eventsAndDisciplines = [["222", Discipline.TwoByTwo], ["333", Discipline.ThreeByThree], ["444", Discipline.FourByFour], ["555", Discipline.FiveByFive],
  ["666", Discipline.SixBySix], ["777", Discipline.SevenBySeven], ["333oh", Discipline.OneHanded],
  ["333bf", Discipline.ThreeBlind], ["444bf", Discipline.FourBlind], ["555bf", Discipline.FiveBlind],
  ["clock", Discipline.Clock], ["pyram", Discipline.Pyraminx], ["minx", Discipline.Megaminx], ["skewb", Discipline.Skewb], ["sq1", Discipline.Square1]];

  const onMouseLeave = () => {
    ignoreMouseRef.current = false;
    setMouseInArea(false);
  }
  const onMouseEnter = () => {
    if (ignoreMouseRef.current) return;
    setMouseInArea(true);
    setOpenDrawer(true);
  }

  useEffect(() => {
    const checkStatus = async () => {
      const status = await dbReader.checkHealth();
      setBackendOnline(status);
    };
    checkStatus();

    const interval = setInterval(checkStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mouseInArea) return;

    const timer = setTimeout(() => {
      setOpenDrawer(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [mouseInArea]);

  const DisciplineButton = ({ name, size, disc }: { name: string, size: number, disc: Discipline }) => (
    <Tooltip title={disc} placement='right' sx={{ bgcolor: "red" }} arrow slotProps={{
      tooltip: { sx: { bgcolor: 'secondary.main', fontSize: '1rem', border: '1px solid info.main' } }, arrow: { sx: { color: 'secondary.main' } }
    }}>
      <Button sx={{ color: selectedDiscipline === disc && currentPath === "/" ? "info.light" : "text.primary", "&:hover": { color: "info.dark" } }}
        onClick={() => {
          ignoreMouseRef.current = true;
          navigate("/");
          setOpenDrawer(false);
          setMouseInArea(false);
          setSelectedDiscipline(disc);
          setLastSelectedDiscipline(disc);
        }}>
        <i className={`cubing-icon event-${name}`} style={{ fontSize: size }} />
      </Button>
    </Tooltip>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {backendOnline ? (
        <Box sx={{ width: "100%", height: "100%", margin: "0 auto", bgcolor: "secondary.main", display: "flex" }}>
          <Box sx={{ width: "100px", bgcolor: "secondary.main", zIndex: 5, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
            <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
              <Button sx={{
                color: currentPath === "/" ? "info.light" : "text.primary", "&:hover": { color: "info.dark" }
              }} onClick={() => { navigate("/"); setOpenDrawer(false); setMouseInArea(false); }}>
                <AlarmFilledIcon sx={{ fontSize: 40 }} />
              </Button>
            </Box>
            <Button sx={{
              color: currentPath === "/algs" ? "info.light" : "text.primary", "&:hover": { color: "info.dark" }
            }} onClick={() => { navigate("/algs"); setMouseInArea(false); setOpenDrawer(false); }}>
              <QueryStatsOutlinedIcon sx={{ fontSize: 40 }} />
            </Button>
            <Button onClick={() => navigate("/licenses")} sx={{
              color: currentPath === "/licenses" ? "info.light" : "text.primary", "&:hover": { color: "info.dark" }
            }}>
              <InfoOutlinedIcon sx={{ fontSize: 30 }} />
            </Button>
          </Box>
          <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
          <Slide in={openDrawer} direction='right' >
            <Box sx={{ display: "flex", flexDirection: "row", zIndex: 1, height: "100%", bgcolor: "secondary.main", position: "absolute", left: "100px" }}>
              <Box sx={{
                overflowY: "auto", scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }, width: "100px", height: "100vh",
                bgcolor: "primary.main", display: "flex", flexDirection: "column", justifyContent: "space-around"
              }}
                onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {eventsAndDisciplines.map(([event, disc]) =>
                  <DisciplineButton key={event} name={event} size={40} disc={disc as Discipline} />
                )}
              </Box>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50px',
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
                pointerEvents: 'none'
              }} />
              <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            </Box>
          </Slide >

          <Box sx={{ flex: 20, height: "100%", bgcolor: "blue" }}>
            <Routes>
              <Route path="/" element={<TimerScreen selectedDiscipline={selectedDiscipline} />} />
              <Route path="/algs" element={<AlgorithmScreen />} />
              <Route path="/licenses" element={<Licenses />} />
            </Routes>
          </Box>
        </Box>
      ) : (<h1>There seems to be something wrong</h1>)}
    </ThemeProvider >
  )
}

export default App
