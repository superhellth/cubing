import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Divider, Table, TableBody, TableCell, tableCellClasses, TableRow, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import useImprovementStats from '../../hooks/useImprovementStats';
import { GraphCard } from "../GraphCard";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { keyToLabels } from '@cubing/shared';

const displayed = ["avg5", "avg12", "avg100", "avg1000"];

const DevelopmentCard = ({ solves }: any) => {
    const theme = useTheme();
    const trends = useImprovementStats(solves);

    return (
        <GraphCard title={"Improvement speed"} icon={<AutoAwesomeIcon />}>
            <Typography sx={{ color: theme.palette.text.primary, fontSize: "2rem", p: 0, }}>{-1 * trends.duration.slope}
                <Box
                    component="span"
                    sx={{
                        fontSize: '0.4em',
                        // verticalAlign: 'top',
                        ml: 0.5,
                        color: theme.palette.text.secondary,
                        fontWeight: 'medium'
                    }}
                >
                    ms/solve
                </Box>
            </Typography>
            <Divider />
            <Table size='small' sx={{
                padding: 2,
                // height: "100%",
                [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                    padding: "0 4px",
                    paddingTop: "1rem",
                    // height: "inherit"
                },
            }}>
                <TableBody>
                    {displayed.map((key: string) => {
                        const trend = trends[key as keyof typeof trends];
                        return (
                            <TableRow>
                                <TableCell>{keyToLabels[key as keyof typeof keyToLabels]}</TableCell>
                                <TableCell sx={{ color: trend.absoluteChange < 0 ? theme.palette.success.main : theme.palette.error.main }}>
                                    {(trend.absoluteChange / 1000).toFixed(2)}s
                                </TableCell>
                                <TableCell
                                    sx={{ color: trend.relativeChange < 0 ? theme.palette.success.main : theme.palette.error.main }}
                                >
                                    {(-1 * trend.relativeChange * 100).toFixed(2)}%
                                </TableCell>
                                <TableCell sx={{ color: trend.relativeChange < 0 ? theme.palette.success.main : theme.palette.error.main }}>
                                    {trend.relativeChange > 0 ? (
                                        <TrendingDownIcon fontSize="small" />
                                    ) : (
                                        <TrendingUpIcon fontSize="small" />
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </GraphCard>
    );
}

export default DevelopmentCard;