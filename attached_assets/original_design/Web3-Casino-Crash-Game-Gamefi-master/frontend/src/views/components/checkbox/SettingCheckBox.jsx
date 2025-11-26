import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function SettingCheckBox({ check, setCheck, label, checkKey }) {
    return (
        <FormGroup sx={{ width: '100%' }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={check}
                        onChange={(e) => setCheck(e.target.checked, checkKey)}
                        sx={{
                            color: '#6FE482',
                            '&.Mui-checked': {
                                color: '#6FE482',
                            }
                        }}
                    />
                }
                label={label}
                sx={{
                    color: '#FFF',
                    fontFamily: 'Cera Pro',
                    fontSize: '16px'
                }}
            />
        </FormGroup>
    );
}