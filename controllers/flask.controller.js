const db = require('../src/db')

class FlaskController {
    async getFlasks(req, res) {
        let baseJewelleryQuery = 'SELECT * FROM base_flasks'
        let uniqueJewelleryQuery = 'SELECT * FROM unique_flasks'
        if (req.query.type && req.query.type!=='null') {
            baseJewelleryQuery = `
                SELECT bj.id FROM base_flasks as bj
                JOIN (SELECT bj.id, array_agg(t.tag) AS tags FROM base_flasks AS bj
                    LEFT JOIN baseflasks_tags AS bjt ON bj.id=bjt.flask_id
                    LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id) as j ON bj.id=j.id
                WHERE array_position(j.tags, '${req.query.type}')>0`
        }
        uniqueJewelleryQuery = `SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${baseJewelleryQuery}) AS bj ON uj.base_id=bj.id`
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseJewelleryQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseJewelleryQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
                uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueJewelleryQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseJewelleryQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseJewelleryQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
                uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueJewelleryQuery}) as t10 ON uj.id=t10.id
                WHERE uj.req_lvl<=${maxLvl}`
        }
        let implicits = `
            SELECT bf.id, array_agg(i.stat) as implicit FROM base_flasks as bf
            LEFT JOIN baseflasks_implicit as bfi ON bf.id=bfi.flask_id 
            LEFT JOIN implicit as i ON bfi.implicit_id=i.id
            GROUP BY bf.id`
        let buffs = `
            SELECT bf.id, array_agg(b.buff) as buffs FROM base_flasks as bf
            LEFT JOIN flasks_buffs as b ON b.flask_id=bf.id GROUP BY bf.id`
        baseJewelleryQuery = `
            SELECT bf.*, b.buffs, i.implicit FROM base_flasks as bf JOIN (${baseJewelleryQuery}) as f ON bf.id=f.id 
            JOIN (${implicits}) as i ON f.id=i.id
            JOIN (${buffs}) as b ON b.id=f.id`
        // baseJewelleryQuery = `
        //     SELECT bj.*, array_agg(i.stat) as implicit FROM base_flasks as bj JOIN (${baseJewelleryQuery}) as j ON bj.id=j.id 
        //     LEFT JOIN baseflasks_implicit as bji ON j.id=bji.flask_id LEFT JOIN implicit as i ON bji.implicit_id=i.id
        //     GROUP BY bj.id`
        // let implicitsForUniqueJewellery = `
        //     SELECT uj.id, i.implicit as implicit FROM (${uniqueJewelleryQuery}) AS uj 
        //     JOIN (SELECT bj.id, array_agg(i.stat) as implicit FROM base_flasks as bj 
        //         LEFT JOIN baseflasks_implicit as bji ON bj.id=bji.flask_id 
        //         LEFT JOIN implicit as i ON bji.implicit_id=i.id GROUP BY bj.id) AS i ON uj.base_id=i.id`
        let uniqueStats = `
            SELECT uf.id, array_agg(us.stat) as stats FROM unique_flasks as uf
            LEFT JOIN uniqueflasks_stats as ufs ON ufs.item_id=uf.id
            LEFT JOIN unique_stats as us ON ufs.stat_id=us.id GROUP BY uf.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        uniqueJewelleryQuery = `
            SELECT uf.*, bf.subtype, i.implicit, s.stats FROM unique_flasks as uf JOIN(${uniqueJewelleryQuery}) as f ON uf.id=f.id
            JOIN base_flasks as bf ON uf.base_id=bf.id
            JOIN (${buffs}) AS b ON f.id=b.id
            JOIN (${implicits}) AS i ON f.id=i.id
            JOIN (${uniqueStats}) AS s ON f.id=s.id`

        let baseFlasks = await db.query(baseJewelleryQuery)
        let uniqueFlasks = await db.query(uniqueJewelleryQuery)
        
        if(req.query.rarity==='normal') {
            console.log(baseFlasks.rows.length)
            res.status(200).json({baseFlasks: baseFlasks.rows})
        } else if(req.query.rarity==='unique') {
            console.log(uniqueFlasks.rows.length)
            res.status(200).json({uniqueFlasks: uniqueFlasks.rows})
        } else if(req.query.rarity==='any') {
            res.status(200).json({baseFlasks: baseFlasks.rows, uniqueFlasks: uniqueFlasks.rows})
        }
    }
}

// pool.query('SELECT * FROM base_weapon ORDER BY id ASC', (error, results) => {
//     if(error) {
//         throw error
//     }
//     res.status(200).json(results.rows)
// })

module.exports = new FlaskController