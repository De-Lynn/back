const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'diplom',
    password: 'P!sfuckmen0w',
    port: 5432,
})

const getWeapon = (req, res) => {
    pool.query('SELECT * FROM base_weapon ORDER BY id ASC', (error, results) => {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getWeaponById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM base_weapon WHERE id=$1', [id], (error, results) => {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getWeaponByType = (req, res) => {
    const type = req.query.type
    pool.query('SELECT * FROM base_weapon WHERE type=$1 OR subtype=$1', [type], (error, results) => {
        if(error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

// module.exports = {
//     getWeapon,
//     getWeaponById,
//     getWeaponByType,
// }

module.exports = pool