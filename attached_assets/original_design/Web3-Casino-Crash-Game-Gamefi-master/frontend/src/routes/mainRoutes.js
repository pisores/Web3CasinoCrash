import { lazy } from "react";
import Loadable from "../ui-component/loadable";

const MainLayout = Loadable(lazy(() => import('layout/MainLayout/index')));
const AppLayout = Loadable(lazy(() => import('layout/AppLayout/index')));
const Home = Loadable(lazy(() => import("views/main/home/index")));
const Bonus = Loadable(lazy(() => import("views/main/bonus/index")));
const Turtlerace = Loadable(lazy(() => import("views/main/game/turtlerace/index")));
const Scissors = Loadable(lazy(() => import("views/main/game/scissors/index")));
const Mines = Loadable(lazy(() => import("views/main/game/mines/index")));
const Games = Loadable(lazy(() => import("views/main/game/index")));
const Dice = Loadable(lazy(() => import("views/main/game/dice/index")));
const Plinko = Loadable(lazy(() => import("views/main/game/plinko/index")));
const HelpLayout = Loadable(lazy(() => import("views/main/help/Layout")));
const Help = Loadable(lazy(() => import("views/main/help/index")));
const GameHelp = Loadable(lazy(() => import("views/main/help/Games/index")));
const ScissorHelp = Loadable(lazy(() => import("views/main/help/Games/HowToPlay/Scissor")));
const MinesHelp = Loadable(lazy(() => import("views/main/help/Games/HowToPlay/Mines")));
const DiceHelp = Loadable(lazy(() => import("views/main/help/Games/HowToPlay/Dice")));
const TurtleHelp = Loadable(lazy(() => import("views/main/help/Games/HowToPlay/Turtle")));
const Affiliate = Loadable(lazy(() => import("views/main/affiliate")));
const Slot = Loadable(lazy(() => import("views/main/game/slot")));
const Crash = Loadable(lazy(() => import("views/main/game/crash")));
const Blackjack = Loadable(lazy(() => import("views/main/game/blackjack")));
const Tournament = Loadable(lazy(() => import("views/main/tournament")));
const Security = Loadable(lazy(() => import("views/main/help/Security")));
const HowToSetup = Loadable(lazy(() => import("views/main/help/Security/2FaAuth/HowToSetup")));
const AboutHelp = Loadable(lazy(() => import("views/main/help/About")));
const ChatRules = Loadable(lazy(() => import("views/main/help/About/Chat/ChatRule")));
const HowToExclude = Loadable(lazy(() => import("views/main/help/About/Account/HowToExclude")));
const HowToCreate = Loadable(lazy(() => import("views/main/help/About/Account/HowToCreate")));
const HowToLevelUp = Loadable(lazy(() => import("views/main/help/About/Levelup/HowToLevelUp")));
const WhatisFair = Loadable(lazy(() => import("views/main/help/About/ProvablyFair/WhatisFair")));
const WhatisZelo = Loadable(lazy(() => import("views/main/help/About/Zelo/WhatisZelo")));
const FaqHelp = Loadable(lazy(() => import("views/main/help/Faq")));
const HowAutoBetWork = Loadable(lazy(() => import("views/main/help/Faq/AutoBet/HowAutoBetWork")));
const HowTournamentWork = Loadable(lazy(() => import("views/main/help/Faq/Tournaments/HowTournamentWork")));
const WalletHelp = Loadable(lazy(() => import("views/main/help/Wallet")));
const SupportedNetworks = Loadable(lazy(() => import("views/main/help/Wallet/Currencies/SupportedNetworks")));
const HowToDeposit = Loadable(lazy(() => import("views/main/help/Wallet/Deposits/HowToDeposit")));
const DepositBTC = Loadable(lazy(() => import("views/main/help/Wallet/Deposits/DepositBTC")));
const ZeloWithdraw = Loadable(lazy(() => import("views/main/help/Wallet/Withdrawals/ZeloWithdraw")));
const HowToWithdraw = Loadable(lazy(() => import("views/main/help/Wallet/Withdrawals/HowToWithdraw")));
const BonusesHelp = Loadable(lazy(() => import("views/main/help/Bonuses")));
const HowBonusWork = Loadable(lazy(() => import("views/main/help/Bonuses/DepositBonus/HowBonusWork")));
const BonusTerms = Loadable(lazy(() => import("views/main/help/Bonuses/LockedBonus/Terms")));

const MainRoutes = [{
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'app',
            element: <AppLayout />,
            children: [
                {
                    path: 'home',
                    element: <Home />
                },
                {
                    path: 'bonues',
                    element: <Bonus />
                },
                {
                    path: 'tournaments',
                    element: <Tournament />
                },
                {
                    path: 'affiliate',
                    element: <Affiliate />
                },
                {
                    path: 'games',
                    element: <AppLayout />,
                    children: [
                        {
                            path: '',
                            element: <Games />
                        },
                        {
                            path: 'turtlerace',
                            element: <Turtlerace />
                        },
                        {
                            path: 'scissor',
                            element: <Scissors />
                        },
                        {
                            path: 'mines',
                            element: <Mines />
                        },
                        {
                            path: 'dice',
                            element: <Dice />
                        },
                        {
                            path: 'slot',
                            element: <Slot />
                        },
                        {
                            path: 'plinko',
                            element: <Plinko />
                        },
                        {
                            path: 'crash',
                            element: <Crash />
                        },
                        {
                            path: 'blackjack',
                            element: <Blackjack />
                        }
                    ]
                },
                {
                    path: 'help',
                    element: <HelpLayout />,
                    children: [
                        {
                            path: '',
                            element: <Help />
                        },
                        {
                            path: 'games',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <GameHelp />
                                },
                                {
                                    path: 'how-to-play',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'scissor',
                                            element: <ScissorHelp />
                                        },
                                        {
                                            path: 'dice',
                                            element: <DiceHelp />
                                        },
                                        {
                                            path: 'mines',
                                            element: <MinesHelp />
                                        },
                                        {
                                            path: 'turtle',
                                            element: <TurtleHelp />
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'security',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <Security />
                                },
                                {
                                    path: 'two-factor-authentication',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-to-set-up-2-factor-authentication',
                                            element: <HowToSetup />
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'about',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <AboutHelp />
                                },
                                {
                                    path: 'chat',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'rules',
                                            element: <ChatRules />
                                        }
                                    ]
                                },
                                {
                                    path: 'account',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-can-i-self-exclude-from-the-game',
                                            element: <HowToExclude />
                                        },
                                        {
                                            path: 'how-to-create-your-account',
                                            element: <HowToCreate />
                                        }
                                    ]
                                },
                                {
                                    path: 'level-up',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-can-i-level-up',
                                            element: <HowToLevelUp />
                                        }
                                    ]
                                },
                                {
                                    path: 'provably-fair',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'what-is-provably-fair',
                                            element: <WhatisFair />
                                        }
                                    ]
                                },
                                {
                                    path: 'zelo',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'what-is-zelo',
                                            element: <WhatisZelo />
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'faq',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <FaqHelp />
                                },
                                {
                                    path: 'autobet',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-does-autobet-work',
                                            element: <HowAutoBetWork />
                                        }
                                    ]
                                },
                                {
                                    path: 'tournaments',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-do-tournaments-work',
                                            element: <HowTournamentWork />
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'wallet',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <WalletHelp />
                                },
                                {
                                    path: 'currencies',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'what-networks-are-supported-by-the-wallet',
                                            element: <SupportedNetworks />
                                        }
                                    ]
                                },
                                {
                                    path: 'deposits',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-to-deposit-lightning-network',
                                            element: <HowToDeposit />
                                        },
                                        {
                                            path: 'how-to-deposit-btc-with-cash-app',
                                            element: <DepositBTC />
                                        }
                                    ]
                                },
                                {
                                    path: 'withdrawals',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-to-withdraw-playzelo-dollar',
                                            element: <ZeloWithdraw />
                                        },
                                        {
                                            path: 'how-to-withdrawal',
                                            element: <HowToWithdraw />
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'bonuses',
                            element: <AppLayout />,
                            children: [
                                {
                                    path: '',
                                    element: <BonusesHelp />
                                },
                                {
                                    path: 'deposit-bonus',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'how-does-the-deposit-bonus-work',
                                            element: <HowBonusWork />
                                        }
                                    ]
                                },
                                {
                                    path: 'locked-bonuses',
                                    element: <AppLayout />,
                                    children: [
                                        {
                                            path: 'terms-of-the-locked-bonuses',
                                            element: <BonusTerms />
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}];

export default MainRoutes;