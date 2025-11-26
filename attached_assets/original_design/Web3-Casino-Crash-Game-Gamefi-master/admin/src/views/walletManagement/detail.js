import { Box, Grid, Button, Modal, Fade, CardContent, CardActions, Card, FormControl, Input, InputAdornment, IconButton } from "@mui/material";
import parser from 'query-string';
import { useEffect, useState, useContext } from "react";
import { getWalletDetail, withdrawFromAddress } from "redux/action/report";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import Config from "config/index";
import { CopyAll } from "@mui/icons-material";
import { Fee, TxScanLink, AddressScanLink, NETWORK } from "config/constant";
import { useToasts } from "react-toast-notifications";

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
		fontWeight: '800',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
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
	Ellipsis: {
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},
	ModalText: {
		fontSize: '16px'
	},
	RedLabel: {
		color: '#F00'
	}
}));

const WalletDetail = () => {
	const classes = useStyles();
	const { addToast } = useToasts();
	const { showLoading, hideLoading } = useContext(LoadingContext);

	const [totalDeposit, setTotalDeposit] = useState(0);
	const [totalWithdraw, setTotalWithdraw] = useState(0);
	const [walletDetail, setWalletDetail] = useState(undefined);

	const [modalOpen, setModalOpen] = useState(false);
	const [withdrawToAddress, setWithdrawToAddress] = useState('');
	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [withdrawFee, setWithdrawFee] = useState(0);
	const [withdrawTxId, setWithdrawTxId] = useState('');

	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

	useEffect(() => {
		initFunc();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (walletDetail) {
			let depositList = walletDetail.depositList;
			let withdrawList = walletDetail.withdrawList;
			let depositAmount = 0, withdrawAmount = 0;
			depositList.map((deposit) => (
				depositAmount += Number(deposit.amount)
			));
			setTotalDeposit(depositAmount);
			withdrawList.map((withdraw) => (
				withdrawAmount += Number(withdraw.amount)
			));
			setWithdrawFee(Fee[walletDetail?.walletDetail[0]?.currency]);
			setTotalWithdraw(withdrawAmount);
		}
	}, [walletDetail]);

	const initFunc = async () => {
		const queryData = parser.parse(window.location.search);
		if (queryData?.id) {
			showLoading();
			const requestData = {
				id: queryData.id
			};
			const response = await getWalletDetail(requestData);
			if (response.status)
				setWalletDetail(response.data);
			hideLoading();
		}
	};

	const withdrawRequest = async () => {
		showLoading();
		const requestData = {
			from: walletDetail?.walletDetail[0]?.address,
			to: withdrawToAddress,
			amount: withdrawAmount,
			fee: withdrawFee,
			coinType: walletDetail?.walletDetail[0]?.currency
		};
		const response = await withdrawFromAddress(requestData);
		if (response.status) {
			if (response?.data?.completed) {
				addToast('Withdraw successfully completed', { appearance: 'success', autoDismiss: true });
				setWithdrawTxId(response.data.txId);
				initFunc();
			}
			else {
				addToast('Error occured from withdraw', { appearance: 'warning', autoDismiss: true });
			}
		}
		else {
			addToast(response.message, { appearance: 'error', autoDismiss: true })
		}
		hideLoading();
	};

	const handleCopyText = (text) => {
		window.navigator.clipboard.writeText(text);
	}

	return (
		<Box className={classes.DetailContainer}>
			<Box className={classes.InfoContainer}>
				<Box className={classes.InfoHeaderBox}>
					Wallet Detail: {walletDetail?.walletDetail[0]?.address}
					<Box>
						<Button onClick={handleModalOpen} variant="contained">Withdraw From Address</Button>
					</Box>
				</Box>
				<Grid container m={0}>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Balance
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{walletDetail?.walletBalance} {walletDetail?.walletDetail[0]?.currency}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Currency
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{walletDetail?.walletDetail[0]?.currency}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Own User Name
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{walletDetail?.walletDetail[0]?.userName}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Creation TIme
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{walletDetail?.walletDetail[0]?.createdAt}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Total Deposit
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{totalDeposit.toFixed(8)}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Total Withdraw
									</Grid>
									<Grid item xs={8} className={clsx(classes.GridValueItem)}>
										{totalWithdraw.toFixed(8)}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
			<Box className={classes.HistoryDetailContainer}>
				<Box className={classes.InfoHeaderBox}>
					Transaction History
				</Box>
				<Box>
					<table className="table table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
						<thead>
							<tr>
								<td className={classes.TextAlignCenter}><strong>TxID</strong></td>
								<td className={classes.TextAlignCenter}><strong>Amount</strong></td>
								<td className={classes.TextAlignCenter}><strong>Currency</strong></td>
								<td className={classes.TextAlignCenter}><strong>From</strong></td>
								<td className={classes.TextAlignCenter}><strong>To</strong></td>
								<td className={classes.TextAlignCenter}><strong>Date</strong></td>
							</tr>
						</thead>
						<tbody>
							{
								walletDetail?.depositList?.map((row, index) => (
									<tr key={index}>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>
											{
												<a
													href={TxScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.txId}
													target="_blank"
													rel="noreferrer"
												>
													{row.txId}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{row.amount.toFixed(8)}</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{row.currency}</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis,)}>
											{
												<a
													href={AddressScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.from}
													target="_blank"
													rel="noreferrer"
													className={walletDetail?.walletDetail[0]?.address !== row.from ? classes.RedLabel : ''}
												>
													{row.from}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>
											{
												<a
													href={AddressScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.to}
													target="_blank"
													rel="noreferrer"
													className={walletDetail?.walletDetail[0]?.address !== row.to ? classes.RedLabel : ''}
												>
													{row.to}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{new Intl.DateTimeFormat('en-US').format(new Date(row.date))}</td>
									</tr>
								))
							}
							{
								walletDetail?.withdrawList?.map((row, index) => (
									<tr key={index}>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>
											{
												<a
													href={TxScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.txId}
													target="_blank"
													rel="noreferrer"
												>
													{row.txId}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{row.amount.toFixed(8)}</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{row.currency}</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>
											{
												<a
													href={AddressScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.from}
													target="_blank"
													rel="noreferrer"
													className={walletDetail?.walletDetail[0]?.address !== row.from ? classes.RedLabel : ''}
												>
													{row.from}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>
											{
												<a
													href={AddressScanLink[NETWORK][walletDetail?.walletDetail[0]?.currency] + row.to}
													target="_blank"
													rel="noreferrer"
													className={walletDetail?.walletDetail[0]?.address !== row.to ? classes.RedLabel : ''}
												>
													{row.to}
												</a>
											}
										</td>
										<td className={clsx(classes.TextAlignCenter, classes.Ellipsis)}>{new Intl.DateTimeFormat('en-US').format(new Date(row.date))}</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</Box>
			</Box>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<Fade in={modalOpen}>
						<Card sx={Config.customerModalStyle}>
							<CardContent>
								<FormControl variant="standard" fullWidth className="pb-3 pt-3">
									<span className={classes.ModalText}>From</span>
									<Input
										id="withdrawFromAddress"
										endAdornment={
											<InputAdornment position="end">
												<IconButton onClick={() => handleCopyText(walletDetail?.walletDetail[0]?.address)}>
													<CopyAll />
												</IconButton>
											</InputAdornment>
										}
										value={walletDetail?.walletDetail[0]?.address}
										disabled
									/>
								</FormControl>
								<FormControl variant="standard" fullWidth className="pt-3 pb-3">
									<span className={classes.ModalText}>To</span>
									<Input
										id="depositFromAddress"
										endAdornment={
											<InputAdornment position="end">
												<IconButton onClick={() => handleCopyText(withdrawToAddress)}>
													<CopyAll />
												</IconButton>
											</InputAdornment>
										}
										value={withdrawToAddress}
										onChange={(e) => setWithdrawToAddress(e.target.value)}
									/>
								</FormControl>
								<FormControl variant="standard" fullWidth className="pt-3 pb-3">
									<span className={classes.ModalText}>Amount</span>
									<Input
										id="withdrawAmount"
										type="number"
										value={withdrawAmount}
										onChange={(e) => setWithdrawAmount(e.target.value)}
									/>
								</FormControl>
								{/* <FormControl variant="standard" fullWidth className="pt-3 pb-3">
									<span className={classes.ModalText}>Fee</span>
									<Input
										id="withdrawFee"
										type="number"
										value={withdrawFee}
										onChange={(e) => setWithdrawFee(e.target.value)}
									/>
								</FormControl> */}
								<FormControl variant="standard" fullWidth className="pt-3 pb-3">
									<span className={classes.ModalText}>TxId</span>
									<Input
										id="withdrawFee"
										value={withdrawTxId}
										onChange={(e) => setWithdrawTxId(e.target.value)}
										disabled
										endAdornment={
											<InputAdornment position="end">
												<IconButton onClick={() => handleCopyText(withdrawTxId)}>
													<CopyAll />
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</CardContent>
							<CardActions className="d-flex justify-right pt-0">
								<Button onClick={handleModalClose}>Cancel</Button>
								<Button variant="contained" onClick={withdrawRequest}>Withdraw</Button>
							</CardActions>
						</Card>
					</Fade>
				</Box>
			</Modal>
		</Box>
	);
};

export default WalletDetail;