import { AccountBalanceWallet, AutoAwesome, Ballot, BedroomBaby, Casino, ContentCut, CurrencyBitcoin, DashboardRounded, EmojiEvents, Engineering, Gamepad, GroupRounded, Language, MilitaryTech, Paid, PermContactCalendarSharp, Pin, PlaylistAddCheck, RequestQuote, SettingsSuggest, ShutterSpeed, SmartToy, Stars, Timeline, Vrpano, Workspaces } from "@mui/icons-material";
import { ReactComponent as BombIcon } from "assets/icons/bombicon.svg";

const menuItems = [
    {
        url: '/dashboard',
        icon: <DashboardRounded />,
        text: 'Dashboard',
        headerTitle: 'Dashboard'
    },
    {
        url: '/fair-system',
        icon: <Pin />,
        text: 'Fair System',
        headerTitle: 'Fair System'
    },
    {
        icon: <Language />,
        text: 'Site Mangement',
        child: [
            {
                url: '/site-setting/banner-setting',
                icon: <Vrpano />,
                text: 'Banner Management'
            }
        ]
    },
    {
        icon: <GroupRounded />,
        text: 'Player Management',
        child: [
            {
                url: '/player/player-list',
                icon: <PermContactCalendarSharp />,
                text: 'Player List'
            },
            {
                url: '/player/level-setting',
                icon: <Engineering />,
                text: 'Level Setting'
            }
        ]
    },
    {
        icon: <Paid />,
        text: 'Payment Management',
        child: [
            {
                url: '/payment/currencies',
                icon: <CurrencyBitcoin />,
                text: 'Currency List'
            },
            {
                url: '/payment/wallet-management',
                icon: <AccountBalanceWallet />,
                text: 'Wallet Management'
            }
        ]
    },
    {
        icon: <Gamepad />,
        text: 'Game Management',
        child: [
            {
                url: '/games/games-list',
                icon: <PlaylistAddCheck />,
                text: 'Game List'
            },
            {
                url: '/games/turtle-management',
                icon: <BedroomBaby />,
                text: 'TurtleRace Management'
            },
            {
                url: '/games/scissors-management',
                icon: <ContentCut />,
                text: 'SPR Management'
            },
            {
                url: '/games/mines-management',
                icon: <BombIcon />,
                text: 'Mines Management'
            },
            {
                url: '/games/dice-management',
                icon: <Casino />,
                text: 'Dice Management'
            },
            {
                url: '/games/plinko-management',
                icon: <Workspaces />,
                text: 'Plinko Management'
            },
            {
                url: '/games/slot-management',
                icon: <SmartToy />,
                text: 'Slot Management'
            },
            {
                url: '/games/crash-management',
                icon: <Timeline />,
                text: 'Crash Management'
            }
        ]
    },
    {
        icon: <Stars />,
        text: 'Promotion & Reward',
        child: [
            {
                url: '/promotion/reward-setting',
                icon: <SettingsSuggest />,
                text: 'Reward Setting'
            },
            {
                url: '/promotion/reward-given',
                icon: <EmojiEvents />,
                text: 'Reward Management'
            },
            {
                url: '/promotion/freespin-setting',
                icon: <AutoAwesome />,
                text: 'FreeSpin Setting'
            },
            {
                url: '/promotion/freespin-given',
                icon: <ShutterSpeed />,
                text: 'FreeSpin Management'
            },
            {
                url: '/promotion/unlock-setting',
                icon: <RequestQuote />,
                text: 'Unlock Setting'
            }
        ]
    },
    {
        icon: <MilitaryTech />,
        text: 'Tournament',
        child: [
            {
                url: '/tournament/tournament-list',
                icon: <Ballot />,
                text: 'Tournament List'
            }
        ]
    },
    {
        url: '/change-password',
        icon: null,
        text: 'Profile',
        headerTitle: 'Change Password'
    },
    {
        url: '/setting',
        icon: null,
        text: 'Setting',
        headerTitle: 'Setting'
    },
    {
        url: '/wallet-detail',
        icon: null,
        text: 'Wallet Detail',
        headerTitle: 'Wallet Detail'
    },
    {
        url: '/player-detail',
        icon: null,
        text: 'Player Detail',
        headerTitle: 'Player Detail'
    },
    {
        url: '/turtle-detail',
        icon: null,
        text: 'Turtle Detail',
        headerTitle: 'Turtle Detail'
    }
]

export default menuItems;