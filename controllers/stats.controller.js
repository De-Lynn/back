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
            statsQuery = `
                SELECT * FROM (
                    SELECT ia.type, ia.stat, ia.stat_order FROM items_affixes as ia 
                    UNION SELECT fa.type, fa.stat, fa.stat_order FROM flasks_affixes as fa
                ) as a 
                WHERE a.stat LIKE '%${req.query.stat}%' AND (a.type='Suffix' OR a.type='Prefix')`
                //JOIN (${statsQuery}) as s ON a.stat_order=s.stat_order
                // WHERE ia.stat LIKE '%${req.query.stat}%' AND (ia.type='Suffix' OR ia.type='Prefix')
                // UNION SELECT fa.stat, fa.stat_order FROM flasks_affixes as fa JOIN (${statsQuery}) as s ON fa.stat_order=s.stat_order 
                // WHERE fa.stat LIKE '%${req.query.stat}%' AND (fa.type='Suffix' OR fa.type='Prefix')`
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