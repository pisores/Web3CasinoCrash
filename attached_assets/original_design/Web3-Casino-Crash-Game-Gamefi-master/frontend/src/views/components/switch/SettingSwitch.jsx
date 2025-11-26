import { styled } from "@mui/styles";
import { Switch } from "@mui/material";

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#2C2C3A !important',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#6FE482',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        color: '#2C2C3A',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: '#1F1E25',
        boxSizing: 'border-box',
    },
}));

const SettingSwitch = ({ check, setCheck, disabled }) => {
    return (
        <AntSwitch checked={check} onChange={(e) => setCheck(e.target.checked)} disabled={disabled} />
    );
};

export default SettingSwitch;