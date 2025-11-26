const cron = require('node-cron');
const mongoose = require('mongoose');
const models = require('../models/index');

exports.tournamentProc = () => {
    let tournamentCheckProc = cron.schedule('1 0 0 * * *', () => {
        runCheckFuc();
    });
    tournamentCheckProc.start();
}

const runCheckFuc = async () => {
    const availableTournaments = await models.tournamentListModel.aggregate([
        {
            $match: {
                finished: false,
                endDate: {
                    $lte: new Date()
                }
            }
        },
        {
            $lookup: {
                from: 'tournamentusers',
                foreignField: 'tournamentId',
                localField: '_id',
                as: 'users'
            }
        }
    ]);

    let bulkOptions = [];
    availableTournaments.map((item) => {
        let option = {
            updateOne: {
                filter: { _id: item._id },
                update: { finished: true }
            }
        }
        bulkOptions.push(option);
    });
    await models.tournamentListModel.bulkWrite(bulkOptions);

    bulkOptions = [];
    availableTournaments.users.map((item) => {
    });
}