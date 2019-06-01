const typeorm = require("typeorm");
const config = require('./config.json');
const Member = require('./entities/Member');

const EntitySchema = typeorm.EntitySchema;
let conn;

async function getConnection() {
    if (!conn) {
        conn = await typeorm.createConnection({
            type: 'mysql',
            host: config.mysql.host,
            port: config.mysql.port,
            username: config.mysql.username,
            password: config.mysql.password,
            database: config.mysql.database,
            synchronize: false,
            timezone: 'Z',
            entities: [
                new EntitySchema(require("./entities/Member")),
            ],
            logging: ['error'],
        });
    }
    return conn;
}

async function getMemberByLineUserId(lineUserId) {
    const connection = await getConnection();
    const repo = connection.getRepository("Member");
    const data = await repo.findOne({ lineUserId });
    return data;
}

async function getMemberByBloodType(bloodType) {
    const connection = await getConnection();
    const repo = connection.getRepository("Member");
    const data = await repo.findOne({ bloodType });
    return data;
}

async function saveMemberBloodType(lineUserId, bloodType) {
    const connection = await getConnection();
    const repo = connection.getRepository("Member");
    let data = await repo.findOne({ lineUserId });
    if (data) {
        data.bloodType = bloodType;
    } else {
        data = {
            lineUserId,
            bloodType
        }
    }
    repo.save(data);
    return data;
}

module.exports = {
    getMemberByLineUserId,
    getMemberByBloodType,
    saveMemberBloodType,
}