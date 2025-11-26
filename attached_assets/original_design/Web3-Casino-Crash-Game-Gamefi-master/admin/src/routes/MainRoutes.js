import { lazy } from "react";
import Loadable from '../ui-component/Loadable';
import MainLayout from '../layout/MainLayout/index';

const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const PlayerManagement = Loadable(lazy(() => import('views/playerManagement')));
const PlayerDetail = Loadable(lazy(() => import('views/playerManagement/detail')));
const TurtleManagement = Loadable(lazy(() => import('views/turtleManagement')));
const TurtleDetail = Loadable(lazy(() => import('views/turtleManagement/detail')));
const WalletManagement = Loadable(lazy(() => import('views/walletManagement')));
const WalletDetail = Loadable(lazy(() => import('views/walletManagement/detail')));
const ScissorsManagement = Loadable(lazy(() => import('views/scissorsManagement')));
const ChangePassword = Loadable(lazy(() => import('views/auth/changePassword')));
const FairManagement = Loadable(lazy(() => import('views/fairManagement')));
const MinesManagement = Loadable(lazy(() => import('views/minesManagement')));
const RewardSetting = Loadable(lazy(() => import('views/reward/RewardSetting')));
const RewardManagement = Loadable(lazy(() => import('views/reward/RewardManagement')));
const FreeSpinSetting = Loadable(lazy(() => import('views/freespin/FreeSpinSetting')));
const FreeSpinManagement = Loadable(lazy(() => import('views/freespin/FreeSpinManagement')));
const UnlockSetting = Loadable(lazy(() => import('views/unlock/index')));
const DiceManagement = Loadable(lazy(() => import('views/diceManagement')));
const PlinkoManagement = Loadable(lazy(() => import('views/plinkoManagement')));
const GameList = Loadable(lazy(() => import('views/gameList')));
const CurrencyManagement = Loadable(lazy(() => import('views/currency')));
const LevelSetting = Loadable(lazy(() => import('views/levelSetting')));
const BannerManagement = Loadable(lazy(() => import('views/banner')));
const TournamentList = Loadable(lazy(() => import('views/tournament')));
const CrashManagement = Loadable(lazy(() => import('views/crashManagement')));
const CrashDetail = Loadable(lazy(() => import('views/crashManagement/detail')));
const SlotManagement = Loadable(lazy(() => import('views/slotManagement')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/change-password',
            element: <ChangePassword />
        },
        {
            path: '/fair-system',
            element: <FairManagement />
        },
        {
            path: '/promotion',
            children: [
                {
                    path: '/reward-setting',
                    element: <RewardSetting />
                },
                {
                    path: '/reward-given',
                    element: <RewardManagement />
                },
                {
                    path: '/freespin-setting',
                    element: <FreeSpinSetting />
                },
                {
                    path: '/freespin-given',
                    element: <FreeSpinManagement />
                },
                {
                    path: '/unlock-setting',
                    element: <UnlockSetting />
                }
            ]
        },
        {
            path: '/games',
            children: [
                {
                    path: '/turtle-management',
                    element: <TurtleManagement />
                },
                {
                    path: '/scissors-management',
                    element: <ScissorsManagement />
                },
                {
                    path: '/mines-management',
                    element: <MinesManagement />
                },
                {
                    path: '/dice-management',
                    element: <DiceManagement />
                },
                {
                    path: '/plinko-management',
                    element: <PlinkoManagement />
                },
                {
                    path: '/turtle-detail',
                    element: <TurtleDetail />
                },
                {
                    path: '/games-list',
                    element: <GameList />
                },
                {
                    path: '/crash-management',
                    element: <CrashManagement />
                },
                {
                    path: '/crash-detail',
                    element: <CrashDetail />
                },
                {
                    path: '/slot-management',
                    element: <SlotManagement />
                }
            ]
        },
        {
            path: '/payment',
            children: [
                {
                    path: '/currencies',
                    element: <CurrencyManagement />
                },
                {
                    path: '/wallet-management',
                    element: <WalletManagement />
                },
                {
                    path: '/wallet-detail',
                    element: <WalletDetail />
                },
            ]
        },
        {
            path: '/player',
            children: [
                {
                    path: '/player-list',
                    element: <PlayerManagement />
                },
                {
                    path: '/player-detail',
                    element: <PlayerDetail />
                },
                {
                    path: '/level-setting',
                    element: <LevelSetting />
                }
            ]
        },
        {
            path: '/site-setting',
            children: [
                {
                    path: '/banner-setting',
                    element: <BannerManagement />
                }
            ]
        },
        {
            path: '/tournament',
            children: [
                {
                    path: '/tournament-list',
                    element: <TournamentList />
                }
            ]
        }
    ]
};

export default MainRoutes;