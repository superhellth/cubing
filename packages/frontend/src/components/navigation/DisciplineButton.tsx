import type { Discipline } from "@cubing/shared";
import { Button, styled, Tooltip, type ButtonProps } from "@mui/material";

interface StyledDisciplineButtonProps extends ButtonProps {
    isSelected?: boolean;
}


const StyledDisciplineButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'isSelected', })<StyledDisciplineButtonProps>(({ theme, isSelected }) => ({
    color: isSelected ? theme.palette.info.light : theme.palette.text.primary,
    '&:hover': {
        color: theme.palette.info.dark,
    },
}));

interface DisciplineButtonProps {
    name: string;
    size: number | string;
    disc: Discipline;
    isSelected: boolean;
    onClick: (disc: Discipline) => void;
    tooltipDisabled: boolean;
}

const DisciplineButton = ({ name, size, disc, isSelected, onClick, tooltipDisabled }: DisciplineButtonProps) => (
    <Tooltip title={disc} placement='right' arrow>
        <StyledDisciplineButton isSelected={isSelected} onClick={() => onClick(disc)}>
            <i className={`cubing-icon event-${name}`} style={{ fontSize: size }} />
        </StyledDisciplineButton>
    </Tooltip>
);

export default DisciplineButton;