const slotController = require('../controller/SlotController');
const { v4: uuidv4 } = require('uuid');
const socketManager = require('../manager/SocketManager');
const { generateSlotHash } = require('../../helper/mainHelper');
const { PATTERN_RULE, PAYOUT_RULE, SLOT_TYPES } = require('../constant');

const ITEM_COUNT = 11;
const ROW_COUNT = 3;
const COL_COUNT = 5;
const FREESPIN_COUNT = 5;

exports.getSlotResult = async (data, socket) => {
    try {
        const { userId, betAmount, coinType, lines } = data;
        const seedData = await slotController.getSeedData(userId);
        const roundNumber = uuidv4();
        const fairResult = slotFairResult(seedData.serverSeedData.seed, seedData.clientSeedData.seed, roundNumber, lines);
        let rewardData = calcRoundResultFromFairData(fairResult, lines);

        let payout = 0;
        let freeSpinPosition = rewardData.findIndex((item) => item[0] === 'freespin');
        if (freeSpinPosition >= 0) {
            rewardData = [[...rewardData[freeSpinPosition]]];
            if (rewardData[0][0] === 'freespin') {
                rewardData[0][3] = [];
                for (let j = 0; j < FREESPIN_COUNT; j++) {
                    let freeFairResult = slotFairResult(seedData.serverSeedData.seed, seedData.clientSeedData.seed, roundNumber + j, lines, true);
                    let freeRewardData = calcRoundResultFromFairData(freeFairResult, lines);
                    rewardData[0][3].push({ freeFairResult, freeRewardData });
                    freeRewardData.map((item) => payout += item[0]);
                }
            }
        }
        else {
            for (let i = 0; i < rewardData.length; i++) {
                payout += rewardData[i][0];
            }
        }

        const roundResult = payout > 0 ? 'win' : 'lost';

        const response = await slotController.saveSlotRound({
            serverSeed: seedData.serverSeedData.seed,
            clientSeed: seedData.clientSeedData.seed,
            roundNumber,
            userId,
            betAmount,
            lines,
            rewardData,
            roundResult,
            payout
        });
        if (response.status) {
            socketManager.sendBetResult({ ...response, fairResult, rewardData }, socket);
            socketManager.sendBetHistory({
                userId: userId,
                gameType: 'slot',
                roundNumber: roundNumber,
                betAmount: betAmount,
                coinType: coinType,
                payout: payout,
                roundResult: roundResult,
                roundState: true
            });
        }
        else {
            socketManager.sendBetResult(response, socket);
        }
    }
    catch (err) {
        console.error({ title: 'Slot Round => getSlotResult', message: err.message });
    }
}

const slotFairResult = (serverSeed, clientSeed, roundNumber, lines, free = false) => {
    const hash = generateSlotHash(serverSeed, clientSeed, roundNumber, lines);
    const decs = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    let diVal = free ? ITEM_COUNT - 1 : ITEM_COUNT;
    for (let i = 0; i < decs.length; i++) {
        for (let j = 0; j < decs[i].length; j++) {
            decs[i][j] = parseInt(hash.substr(i * COL_COUNT + j, 1), 16) % diVal;
            // if (i === 0 && !free) decs[i][j] = SLOT_TYPES.SLOT_SCATTER;
        }
    }
    return decs;
}

const calcRoundResultFromFairData = (fairResult, lines) => {
    let reward = [];
    let rewardIndex;
    const patternCount = lines;
    for (let i = 0; i < patternCount; i++) {
        let result1 = fairResult[PATTERN_RULE[i][0][0]][PATTERN_RULE[i][0][1]];
        let result2 = fairResult[PATTERN_RULE[i][1][0]][PATTERN_RULE[i][1][1]];
        let result3 = fairResult[PATTERN_RULE[i][2][0]][PATTERN_RULE[i][2][1]];
        let result4 = fairResult[PATTERN_RULE[i][3][0]][PATTERN_RULE[i][3][1]];
        let result5 = fairResult[PATTERN_RULE[i][4][0]][PATTERN_RULE[i][4][1]];

        let result;
        if (result1 === SLOT_TYPES.SLOT_WILD) {
            if (result2 === SLOT_TYPES.SLOT_WILD)
                result = result2;
            else {
                if (result3 === SLOT_TYPES.SLOT_WILD)
                    result = result3;
                else {
                    if (result4 === SLOT_TYPES.SLOT_WILD)
                        result = result4;
                    else
                        result = result5;
                }
            }
        }
        else
            result = result1;

        if (result === SLOT_TYPES.SLOT_WILD) continue;

        if (checkSame(result, result1) && checkSame(result, result2) && checkSame(result, result3) && checkSame(result, result4) && checkSame(result, result5)) {
            if (result === SLOT_TYPES.SLOT_SCATTER) {
                rewardIndex = reward.length;
                reward[rewardIndex] = [];
                reward[rewardIndex][0] = 'freespin';
                reward[rewardIndex][1] = [];
                reward[rewardIndex][1][0] = [PATTERN_RULE[i][0][1], PATTERN_RULE[i][0][0]];
                reward[rewardIndex][1][1] = [PATTERN_RULE[i][1][1], PATTERN_RULE[i][1][0]];
                reward[rewardIndex][1][2] = [PATTERN_RULE[i][2][1], PATTERN_RULE[i][2][0]];
                reward[rewardIndex][1][3] = [PATTERN_RULE[i][3][1], PATTERN_RULE[i][3][0]];
                reward[rewardIndex][1][4] = [PATTERN_RULE[i][4][1], PATTERN_RULE[i][4][0]];
                reward[rewardIndex][2] = i;
                continue;
            }

            rewardIndex = reward.length;
            reward[rewardIndex] = [];
            reward[rewardIndex][0] = PAYOUT_RULE[result][4];
            reward[rewardIndex][1] = [];
            reward[rewardIndex][1][0] = [PATTERN_RULE[i][0][1], PATTERN_RULE[i][0][0]];
            reward[rewardIndex][1][1] = [PATTERN_RULE[i][1][1], PATTERN_RULE[i][1][0]];
            reward[rewardIndex][1][2] = [PATTERN_RULE[i][2][1], PATTERN_RULE[i][2][0]];
            reward[rewardIndex][1][3] = [PATTERN_RULE[i][3][1], PATTERN_RULE[i][3][0]];
            reward[rewardIndex][1][4] = [PATTERN_RULE[i][4][1], PATTERN_RULE[i][4][0]];
            reward[rewardIndex][2] = i;
            continue;
        }

        if (checkSame(result, result1) && checkSame(result, result2) && checkSame(result, result3) && checkSame(result, result4)) {
            if (result === SLOT_TYPES.SLOT_SCATTER)
                continue;

            rewardIndex = reward.length;
            reward[rewardIndex] = [];
            reward[rewardIndex][0] = PAYOUT_RULE[result][3];
            reward[rewardIndex][1] = [];
            reward[rewardIndex][1][0] = [PATTERN_RULE[i][0][1], PATTERN_RULE[i][0][0]];
            reward[rewardIndex][1][1] = [PATTERN_RULE[i][1][1], PATTERN_RULE[i][1][0]];
            reward[rewardIndex][1][2] = [PATTERN_RULE[i][2][1], PATTERN_RULE[i][2][0]];
            reward[rewardIndex][1][3] = [PATTERN_RULE[i][3][1], PATTERN_RULE[i][3][0]];
            reward[rewardIndex][2] = i;
            continue;
        }

        if (checkSame(result, result1) && checkSame(result, result2) && checkSame(result, result3)) {
            if (result === SLOT_TYPES.SLOT_SCATTER)
                continue;

            rewardIndex = reward.length;
            reward[rewardIndex] = [];
            reward[rewardIndex][0] = PAYOUT_RULE[result][2];
            reward[rewardIndex][1] = [];
            reward[rewardIndex][1][0] = [PATTERN_RULE[i][0][1], PATTERN_RULE[i][0][0]];
            reward[rewardIndex][1][1] = [PATTERN_RULE[i][1][1], PATTERN_RULE[i][1][0]];
            reward[rewardIndex][1][2] = [PATTERN_RULE[i][2][1], PATTERN_RULE[i][2][0]];
            reward[rewardIndex][2] = i;
            continue;
        }

        if (checkSame(result, result1) && checkSame(result, result2)) {
            if (result === SLOT_TYPES.SLOT_SCATTER)
                continue;

            if (PAYOUT_RULE[result][1] === 0)
                continue;

            rewardIndex = reward.length;
            reward[rewardIndex] = [];
            reward[rewardIndex][0] = PAYOUT_RULE[result][1];
            reward[rewardIndex][1] = [];
            reward[rewardIndex][1][0] = [PATTERN_RULE[i][0][1], PATTERN_RULE[i][0][0]];
            reward[rewardIndex][1][1] = [PATTERN_RULE[i][1][1], PATTERN_RULE[i][1][0]];
            reward[rewardIndex][2] = i;
            continue;
        }
    }
    return reward;
}

const checkSame = (base, target) => {
    if (base === target)
        return true;

    if (target === SLOT_TYPES.SLOT_WILD)
        return true;

    return false;
}