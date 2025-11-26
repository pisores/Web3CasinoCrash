import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as MenuTopIcon } from "assets/icons/MenuTop.svg";
import { ReactComponent as SendMessageIcon } from "assets/icons/SendMessage.svg";
import { ReactComponent as EmojiIcon } from "assets/icons/EmojiIcon.svg";
import clsx from "clsx";
import { useSelector } from "react-redux";
import ChatItem from "./chatItem";
import Config from "config/index";
import { useEffect, useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const useStyles = makeStyles(() => ({
    ChatWidgetBox: {
        width: '351px',
        height: 'calc(100vh - 120px)',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: '10px 0px 0px 10px',
        padding: '4px 0px 0px 0px'
    },
    ChatContainer: {
        width: '351px',
        height: 'calc(100%)',
        borderRadius: '10px 0px 0px 10px',
        background: '#2C2C3A',
        border: '1px solid #4F4F5C',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '20px 20px 38px 21px',
        gap: '23px'
    },
    TopIconBox: {
        position: 'absolute',
        top: '-16px',
        right: '175px'
    },
    ChatDataBox: {
        width: '100%',
        height: 'calc(100% - 214px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        overflow: 'auto'
    },
    ChatInputBox: {
        width: '100%',
        height: '184px',
        background: "#3D3D4E",
        borderRadius: "8px",
        position: 'relative'
    },
    ChatInput: {
        width: '100%',
        height: '100%',
        borderRadius: "8px",
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#95959C',
        padding: '14px 17px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        resize: 'none'
    },
    MessageSendButton: {
        width: '50px',
        minWidth: '50px',
        height: '47px',
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        border: "1px solid #363646",
        borderRadius: "8px",
        padding: '0px',
        position: 'absolute',
        right: '10px',
        bottom: '8px'
    },
    EmojiButton: {
        width: '50px',
        minWidth: '50px',
        height: '47px',
        borderRadius: "8px",
        padding: '0px',
        position: 'absolute',
        right: '60px',
        bottom: '8px'
    },
    EmojiBox: {
        position: 'absolute',
        bottom: '60px',
        right: '7px'
    }
}));

const ChatWidget = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const authData = useSelector((state) => state.authentication);

    const chatListRef = useRef();
    const emojiButtonRef = useRef();

    const [chatList, setChatList] = useState([]);
    const [newChat, setNewChat] = useState({});

    const [chatText, setChatText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
        Config?.Root?.chatSocket?.emit('getChatData', (response) => {
            if (!response.status) {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
                return;
            }
            setChatList([...response.data.reverse()]);
        });

        Config?.Root?.chatSocket?.off('newChatResponse');
        Config?.Root?.chatSocket?.on('newChatResponse', (response) => {
            if (response.status)
                setChatText('');
            else
                addToast(response.message, { appearance: 'error', autoDismiss: true });
        });

        Config?.Root?.chatSocket?.off('receiveNewChat');
        Config?.Root?.chatSocket?.on('receiveNewChat', (response) => {
            setNewChat({ ...response[0] });
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setChatList((oldList) => [...oldList, newChat]);
    }, [newChat]);

    useEffect(() => {
        if (chatList.length > 0) {
            chatListRef.current.scrollTo({
                top: chatListRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        // eslint-disable-next-line
    }, [chatList]);

    useEffect(() => {
        if (authData?.isAuth) {
            Config?.Root?.chatSocket.emit('reconnect', { userId: authData.userData._id }, (response) => {
            });
        }
        // eslint-disable-next-line
    }, [authData]);

    const handleNewChat = () => {
        if (!authData?.isAuth) {
            addToast('Please login and try again', { appearance: 'warning', autoDismiss: true });
            return;
        }
        if (chatText === '') return;
        const request = {
            userId: authData?.userData?._id,
            text: chatText,
            type: 'text'
        };
        Config?.Root?.chatSocket?.emit('sendNewChat', request);
    };

    const handleEmojiInput = (e) => {
        setShowEmoji(!showEmoji);
    };

    const handleEmojiSelect = (e) => {
        setChatText(chatText + e.native);
    };

    const handleEmojiOutside = (e) => {
        if (!emojiButtonRef.current.contains(e.target))
            setShowEmoji(false);
    };

    const handleReply = (name) => {
        let text = chatText;
        if (text === '') {
            text = `@${name} `;
        }
        else {
            text += ` @${name}`;
        }
        setChatText(text);
    };

    return (
        <Box className={classes.ChatWidgetBox}>
            <Box className={classes.ChatContainer}>
                <Box className={classes.TopIconBox}>
                    <MenuTopIcon />
                </Box>
                <Box className={clsx(classes.ChatDataBox, 'CustomScroll')} ref={chatListRef}>
                    {
                        chatList.map((item, index) => {
                            return (
                                <ChatItem key={index} {...item} handleReply={handleReply} />
                            )
                        })
                    }
                </Box>
                <Box className={classes.ChatInputBox}>
                    <textarea
                        className={clsx(classes.ChatInput, 'CustomScroll')}
                        placeholder="to write a message ..."
                        value={chatText}
                        onChange={(e) => setChatText(e.target.value)}
                    />
                    <Button className={classes.MessageSendButton} onClick={handleNewChat}>
                        <SendMessageIcon />
                    </Button>
                    <Button ref={emojiButtonRef} className={classes.EmojiButton} onClick={handleEmojiInput}>
                        <EmojiIcon />
                    </Button>
                    {
                        showEmoji &&
                        <Box className={classes.EmojiBox}>
                            <Picker data={data} theme="dark" onEmojiSelect={handleEmojiSelect} previewPosition="none" onClickOutside={handleEmojiOutside} />
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default ChatWidget;