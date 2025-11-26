import { Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as ReplyIcon } from "assets/icons/Reply.svg";
import { useState } from "react";

const useStyles = makeStyles(() => ({
    ChatItemWidget: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '10px'
    },
    ChatDetailBox: {
        position: 'relative',
        display: 'flex',
        gap: '8px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        "&>span": {
            fontFamily: "'Cera Pro'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "15px",
            lineHeight: "19px",
            color: "#FFFFFF"
        },
        "&>pre": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "137.7%",
            color: "#95959C",
            margin: '0px',
            width: "245px",
            wordWrap: "break-word"
        }
    },
    ReplyIconBox: {
        position: 'absolute',
        right: '15px',
        top: '0px',
        cursor: 'pointer'
    }
}));

const ChatItem = ({ avatar, name, text, handleReply }) => {
    const classes = useStyles();
    const [isMouseOver, setIsMouseOver] = useState(false);

    return (
        <Box className={classes.ChatItemWidget} onMouseEnter={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>
            <Avatar src={`/assets/images/avatar/${avatar}`} alt="avatar" sx={{ width: 50, height: 50 }} />
            <Box className={classes.ChatDetailBox}>
                {
                    isMouseOver && <Box className={classes.ReplyIconBox} onClick={() => handleReply(name)}><ReplyIcon /></Box>
                }
                <span>{name}</span>
                <pre className='Wrap-Pre'>{text}</pre>
            </Box>
        </Box>
    );
};

export default ChatItem;