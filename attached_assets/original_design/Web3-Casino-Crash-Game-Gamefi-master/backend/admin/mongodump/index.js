const cron = require('node-cron');
const { spawn } = require('child_process');
const fs = require('fs');

exports.dbDumpProc = () => {
    let mongoDumpProc = cron.schedule('59 23 * * *', () => {
        runBackupCmd();
    });
    mongoDumpProc.start();
}

const runBackupCmd = () => {
    let fileName = `backup-${new Date().getTime()}`;
    if (!fs.existsSync(`./db/backup/${fileName}`)) {
        fs.mkdirSync(`./db/backup/${fileName}`, { recursive: true });
    }
    let backupProcess = spawn('mongodump', [
        '--db=PlayZelo',
        `--out=./db/backup/${fileName}/`
    ]);

    backupProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    backupProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    backupProcess.on('close', (code) => {
        console.log(`mongodump process exited with code ${code}`);
    });
}