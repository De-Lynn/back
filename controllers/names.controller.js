const db = require('../src/db')

class NamesController {
    async getNames(req, res) {
        let namesQuery = `
            SELECT * FROM (
                SELECT id, name FROM base_weapon 
                UNION SELECT id, name FROM base_armour
                UNION SELECT id, name FROM base_jewellery
                UNION SELECT id, name FROM base_flasks
                UNION SELECT id, name FROM base_jewels
                UNION SELECT id, name FROM unique_weapon
                UNION SELECT id, name FROM unique_armour
                UNION SELECT id, name FROM unique_jewellery
                UNION SELECT id, name FROM unique_flasks
                UNION SELECT id, name FROM unique_jewels
            ) as n WHERE n.name LIKE '%${req.query.name}%' ORDER BY n.id`
        
        let names = await db.query(namesQuery)
        
        res.status(200).json({names: names.rows})
    }
}

// pool.query('SELECT * FROM base_weapon ORDER BY id ASC', (error, results) => {
//     if(error) {
//         throw error
//     }
//     res.status(200).json(results.rows)
// })

module.exports = new NamesController