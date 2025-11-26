import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    CardLayout: {
        width: '100%',
        height: 145,
        borderRadius: 8,
        backgroundColor: '#424253',
        marginBottom: 14,
        cursor: 'pointer'
    },
    InformationBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px 15px 19px'
    },
    NameBox: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    CardIcon: {
        width: 50,
        height: 50
    },
    CardNameText: {
        fontFamily: 'Cera Pro',
        fontWeight: 700,
        fontSize: 17,
        lineHeight: '21px',
        color: '#FFF'
    },
    ProgressBox: {
        background: '#2C2C3A',
        width: 93,
        height: 27,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6
    },
    BalanceBox: {
        width: 166,
        height: 43,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: '#2C2C3A',
        borderRadius: 8
    },
    CardCurrencyIcon: {
        width: 32,
        height: 32
    },
    CardAmount: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: '23px',
        textTransform: 'uppercase',
        color: '#FFF'
    },
    PeriodBox: {
        width: '100%',
        height: 64,
        background: '#2C2C3A',
        borderRadius: '0px 0px 10px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 15px 0px 18px'
    },
    PeriodText: {
        fontFamily: 'Cera Pro',
        fontWeight: 700,
        fontSize: 17,
        lineHeight: '21px',
        color: '#FFF'
    }
}));

const TournamentCard = (props) => {
    const classes = useStyles();

    const handleClick = () => {
        props.onClick(props.index);
    };

    const getPeriod = (startDate, endDate) => {
        const date1 = new Date(endDate);
        const date2 = new Date(startDate);

        // Calculate the difference in milliseconds
        const diffInMs = date1.getTime() - date2.getTime();

        // Convert the difference to days
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays;
    };

    const calcProgress = (startDate) => {
        if (new Date(startDate).getTime > new Date().getTime()) return 'Upcoming';
        else return 'In progress'
    };

    return (
        <Box className={classes.CardLayout} onClick={handleClick}>
            <Box className={classes.InformationBox}>
                <Box className={classes.NameBox}>
                    <img className={classes.CardIcon} src={`/assets/images/tournament/01.png`} alt="icon" />
                    <Box>
                        <span className={classes.CardNameText}>{props.name}</span>
                        <Box className={classes.ProgressBox} style={calcProgress(props.startDate) === 'In progress' ? { color: '#6FE482' } : { color: '#FED847' }}>
                            {
                                calcProgress(props.startDate)
                            }
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.BalanceBox}>
                    <img className={classes.CardCurrencyIcon} src={`/assets/images/coins/${props.prizePoolCoinType.toLowerCase()}.png`} alt={props.prizePoolCoinType} />
                    <span className={classes.CardAmount}>{Number(props.prizePoolAmount).toFixed(2)}</span>
                </Box>
            </Box>
            <Box className={classes.PeriodBox}>
                <span className={classes.PeriodText}>{`in ${getPeriod(props.startDate, props.endDate)} days`}</span>
            </Box>
        </Box>
    );
};

export default TournamentCard;