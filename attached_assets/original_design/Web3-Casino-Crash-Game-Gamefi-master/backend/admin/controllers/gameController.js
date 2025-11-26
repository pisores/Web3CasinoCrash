const models = require('../../models/index');

exports.insertGame = async (req, res) => {
    try {
        const { gameName, gameLink, available } = req.body;
        if (!gameName || !gameLink) return res.json({ status: false, message: 'Invalid Request' });

        const data = await models.gameListModel.findOne({ gameName });
        if (data) return res.json({ status: false, message: 'Same game is already exist!' });

        await new models.gameListModel({ gameName, gameLink, available }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'AdminController => insertGame', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.removeGame = async (req, res) => {
    try {
        const { gameId } = req.body;
        if (!gameId) return res.json({ status: false, message: 'Invalid Request' });

        await models.gameListModel.findOneAndDelete({ _id: gameId });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'AdminController => removeGame', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateGame = async (req, res) => {
    try {
        const { _id, gameLink, available, gameName } = req.body;
        if (!_id) return res.json({ status: false, message: 'Invalid Request' });

        await models.gameListModel.findOneAndUpdate({ _id: _id }, { gameLink, available, gameName });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'AdminController => updateGame', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.readGame = async (req, res) => {
    try {
        const response = await models.gameListModel.find();
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'AdminController => readGame', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}