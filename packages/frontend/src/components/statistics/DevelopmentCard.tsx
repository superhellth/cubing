import { Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, Typography } from "@mui/material";
import { GraphCard } from "../GraphCard";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DevelopmentCard = () => {
    return (
        <GraphCard title={"Your Development"} icon={<AutoAwesomeIcon />}>
            <Table size='small' sx={{
                // height: "100%",
                [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                    padding: "0 0",
                    paddingTop: "1rem",
                    // height: "inherit"
                },
                [`& .${tableCellClasses.head}`]: {
                    padding: "0 1rem",
                    height: "auto",
                    // lineHeight: "2",
                }
            }}>
                <TableBody>
                    <TableRow>
                        <TableCell>PB:</TableCell>
                        <TableCell>-12</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Ao5:</TableCell>
                        <TableCell>-12</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Ao12:</TableCell>
                        <TableCell>-12</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </GraphCard>
    );
}

export default DevelopmentCard;