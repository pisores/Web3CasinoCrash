import { Box, Grid, MenuItem, Select } from "@mui/material";
import parser from 'query-string';
import { useEffect, useState, useContext } from "react";
import { getPlayerDetail } from "redux/action/report";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";

const useStyles = makeStyles(() => ({
	DetailContainer: {
		width: '100%',
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
		gap: '20px'
	},
	InfoContainer: {
		width: '100%',
		borderTop: '3px solid #d2d6de',
		background: '#FFF',
		padding: '10px'
	},
	InfoHeaderBox: {
		width: '100%',
		padding: '10px',
		fontSize: '18px',
		fontWeight: '800'
	},
	GridKeyItem: {
		padding: '8px',
		fontSize: '14px',
		color: '#000',
		fontWeight: '600',
		backgroundColor: '#f9f9f9',
		borderRight: '1px solid #dee2e6'
	},
	GridValueItem: {
		padding: '8px',
		fontSize: '14px',
		color: '#000',
		fontWeight: '200',
		borderLeft: 'none'
	},
	MainGrid: {
		border: '1px solid #dee2e6',
		"&>$RowGrid:last-child": {
			borderBottom: 'none'
		}
	},
	RowGrid: {
		borderBottom: '1px solid #dee2e6'
	},
	HistoryDetailContainer: {
		width: '100%',
		borderTop: '3px solid #00a65a',
		background: '#FFF',
		padding: '10px'
	},
	TextAlignCenter: {
		textAlign: 'center'
	},
	TextAlignRight: {
		textAlign: 'right'
	},
	TextAlignLeft: {
		textAlign: 'left'
	},
	CustomSelect: {
		background: 'transparent',
		"&>.MuiSelect-select": {
			background: 'transparent',
			fontSize: '14px',
			fontWeight: '700',
			padding: '0px 10px',
			height: '30px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-start',
			gap: '5px',
			minWidth: '100px'
		}
	},
	CustomMenuItem: {
		display: 'flex',
		gap: '5px',
		fontSize: '14px',
		fontWeight: '700',
		height: '30px',
		padding: '10px 16px'
	},
	CurrencyIcon: {
		width: '20px',
		height: '20px'
	},
}));

const PlayerDetail = () => {
	const classes = useStyles();
	const [playerDetail, setPlayerDetail] = useState(null);
	const { showLoading, hideLoading } = useContext(LoadingContext);

	useEffect(() => {
		initFunc();
		// eslint-disable-next-line
	}, []);

	const initFunc = async () => {
		const queryData = parser.parse(window.location.search);
		if (queryData?.id) {
			showLoading();
			const requestData = {
				id: queryData.id
			};
			const response = await getPlayerDetail(requestData);
			if (response.status)
				setPlayerDetail(response.data);
			hideLoading();
		}
	};

	return (
		<Box className={classes.DetailContainer}>
			<Box className={classes.InfoContainer}>
				<Box className={classes.InfoHeaderBox}>
					Player Detail: {playerDetail?.userData?._id}
				</Box>
				<Grid container m={0}>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Player Name
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{playerDetail?.userData?.userNickName}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Balance
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										<Select
											labelId="currencyType"
											id="currencyType"
											value={0}
											className={classes.CustomSelect}
										>
											{
												playerDetail?.userData?.balance.data.map((balance, index) => {
                                                    return (
                                                        <MenuItem key={index} value={index} className={classes.CustomMenuItem} >
                                                            {/* <img className={classes.CurrencyIcon} src={key !== 'ZELO' ? `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${key.toLowerCase()}.svg` : 'https://img.icons8.com/arcade/64/null/cheap-2.png'} alt='icon' /> */}
                                                            <img src={`/assets/images/coins/${balance.coinType.toLowerCase()}.png`} className={classes.CurrencyIcon} alt="icon" />
                                                            <span>{balance.coinType} {balance.type === 'native' ? '' : `(${balance.type})`} : {balance.balance}</span>
                                                        </MenuItem>
                                                    );
                                                })
											}
										</Select>
									</Grid>
								</Grid>
							</Grid>
							{
								playerDetail?.userData?.loginType === "Wallet" &&
								<Grid item xs={12} className={classes.RowGrid}>
									<Grid container m={0}>
										<Grid item xs={4} className={classes.GridKeyItem}>
											Wallet Address
										</Grid>
										<Grid item xs={8} className={classes.GridValueItem}>
											{playerDetail?.userData?.userName}
										</Grid>
									</Grid>
								</Grid>
							}
						</Grid>
					</Grid>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Login Type
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{playerDetail?.userData?.loginType}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Player Email
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{playerDetail?.userData?.userEmail}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Register Date
									</Grid>
									<Grid item xs={8} className={clsx(classes.GridValueItem)}>
										{playerDetail !== null ? new Intl.DateTimeFormat('en-US').format(new Date(playerDetail?.userData?.createdAt)) : ''}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
			<Box className={classes.HistoryDetailContainer}>
				<Box className={classes.InfoHeaderBox}>
					Player History
				</Box>
				<Box>
					<table className="table table-bordered table-hover">
						<thead>
							<tr>
								<td className={classes.TextAlignCenter}><strong>Game Type</strong></td>
								<td className={classes.TextAlignCenter}><strong>Round Number</strong></td>
								<td className={classes.TextAlignCenter}><strong>Bet Amount</strong></td>
								<td className={classes.TextAlignCenter}><strong>Coin Type</strong></td>
								<td className={classes.TextAlignCenter}><strong>Payout</strong></td>
								<td className={classes.TextAlignCenter}><strong>Result</strong></td>
								<td className={classes.TextAlignCenter}><strong>Round Date</strong></td>
								<td className={classes.TextAlignCenter}><strong>Profit</strong></td>
							</tr>
						</thead>
						<tbody>
							{
								playerDetail?.historyData?.map((row, index) => (
									<tr key={index}>
										<td className={classes.TextAlignCenter} style={{ textTransform: 'uppercase' }}>{row.gameType}</td>
										<td className={classes.TextAlignCenter}>{row.roundNumber}</td>
										<td className={classes.TextAlignCenter}>{row.betAmount.toFixed(2)}</td>
										<td className={classes.TextAlignCenter}>{row.coinType.coinType}</td>
										<td className={classes.TextAlignCenter}>{row.payout}</td>
										<td className={classes.TextAlignCenter}>
											{
												row.roundResult === 'win' || row.roundResult === 'payout' || row.roundResult === 'finish' || row.roundResult === 'draw' ? 'Win' : 'Lost'
											}
										</td>
										<td className={classes.TextAlignCenter}>{new Intl.DateTimeFormat('en-US').format(new Date(row.date))}</td>
										<td className={classes.TextAlignCenter}>
											{
												(row.roundResult === 'win' || row.roundResult === 'payout') ? (row.betAmount * row.payout).toFixed(2)
													: row.roundResult === 'draw' || row.roundResult === 'finish' ? row.betAmount.toFixed(2) : `-${row.betAmount.toFixed(2)}`
											}
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</Box>
			</Box>
		</Box>
	);
};

export default PlayerDetail;