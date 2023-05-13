const db = require('../src/db')

class StatsController {
    async getStats(req, res) {
        let statsQuery = `
            SELECT * FROM (
                SELECT DISTINCT ON (stat_order) * FROM (
                    SELECT ia.*, so_count.count FROM items_affixes AS ia 
                    JOIN (
                        SELECT stat_order, count(id) FROM items_affixes GROUP BY stat_order
                    ) AS so_count ON ia.stat_order=so_count.stat_order 
                    WHERE (type='Suffix' OR type='Prefix') ORDER BY count DESC
                ) AS pre_dist ORDER BY stat_order
            ) AS dist ORDER BY count DESC`
        
        if (req.query.stat && req.query.stat!=='null') {
            statsQuery = `SELECT ai.* FROM items_affixes as ai JOIN (${statsQuery}) as s ON ai.stat_order=s.stat_order 
            WHERE ai.stat LIKE '%${req.query.stat}%' AND (ai.type='Suffix' OR ai.type='Prefix')`
        }

        //statsQuery = `SELECT * FROM (${statsQuery}) as s LIMIT 100`
        
        let stats = await db.query(statsQuery)
        
        res.status(200).json({stats: stats.rows})
    }
    async getSimilarStats(req, res) {
        let similarStatsQuery = `SELECT * FROM items_affixes WHERE stat_order=${parseFloat(req.params.stat_order)} ORDER BY stat`
        
        let similarStats = await db.query(similarStatsQuery)
        
        res.status(200).json({similarStats: similarStats.rows})
    }
}

// pool.query('SELECT * FROM base_weapon ORDER BY id ASC', (error, results) => {
//     if(error) {
//         throw error
//     }
//     res.status(200).json(results.rows)
// })

module.exports = new StatsController