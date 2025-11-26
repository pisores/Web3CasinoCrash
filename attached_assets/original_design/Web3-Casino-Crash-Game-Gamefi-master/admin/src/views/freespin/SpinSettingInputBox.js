import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    LineBox: {
        display: 'flex',
        width: '100%',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '20px'
    },
    InputBox: {
        width: '30%'
    },
}));

const SpinSettingInputBox = ({
    startLevel,
    endLevel,
    count,
    handleSettingData,
    index,
    handleSaveData,
    handleDeleteData,
    editable
}) => {
    const classes = useStyles();

    const handleInputData = (key, value) => {
        handleSettingData(index, key, value);
    };

    const handleSave = () => {
        handleSaveData(index);
    };

    const handleDelete = () => {
        handleDeleteData(index);
    };

    const handleCancel = () => {
        handleInputData('editable', false);
    };

    const handleEdit = () => {
        handleInputData('editable', true);
    };

    return (
        <Box className={classes.LineBox}>
            <TextField
                onChange={(e) => handleInputData('startLevel', e.target.value)}
                className={classes.InputBox}
                variant="outlined"
                label="Start Level"
                type="number"
                value={startLevel}
                disabled={!editable}
            />
            <TextField
                onChange={(e) => handleInputData('endLevel', e.target.value)}
                className={classes.InputBox}
                variant="outlined"
                label="End Level"
                type="number"
                value={endLevel}
                disabled={!editable}
            />
            <TextField
                onChange={(e) => handleInputData('count', e.target.value)}
                className={classes.InputBox}
                variant="outlined"
                label="Count"
                type="number"
                value={count}
                disabled={!editable}
            />
            {
                editable ?
                    <>
                        <Button variant="contained" onClick={handleSave}><Save />Save</Button>
                        <Button variant="contained" color="error" onClick={handleCancel}><Cancel /> Cancel</Button>
                    </>
                    :
                    <>
                        <Button variant="contained" onClick={handleEdit}><Edit /> Edit</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}><Delete /> Delete</Button>
                    </>
            }
        </Box>
    )
}

export default SpinSettingInputBox;