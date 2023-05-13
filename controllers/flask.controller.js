const db = require('../src/db')

class FlaskController {
    async getFlasks(req, res) {
        let baseFlasksQuery = 'SELECT * FROM base_flasks'
        let uniqueFlasksQuery = 'SELECT * FROM unique_flasks'
        if (req.query.type && req.query.type!=='null') {
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj
                JOIN (SELECT bj.id, array_agg(t.tag) AS tags FROM base_flasks AS bj
                    LEFT JOIN baseflasks_tags AS bjt ON bj.id=bjt.flask_id
                    LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id) as j ON bj.id=j.id
                WHERE array_position(j.tags, '${req.query.type}')>0`
        }
        uniqueFlasksQuery = `SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${baseFlasksQuery}) AS bj ON uj.base_id=bj.id`
        if(req.query.name && req.query.name!='null') {
            baseFlasksQuery = `SELECT bf.id FROM base_flasks as bf JOIN (${baseFlasksQuery}) as t1 ON bf.id=t1.id 
                WHERE bf.name LIKE '%${req.query.name}%'`
            uniqueFlasksQuery = `
                SELECT uf.id, uf.base_id FROM unique_flasks as uf JOIN (${uniqueFlasksQuery}) as t1 ON uf.id=t1.id 
                WHERE uf.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
            uniqueFlasksQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueFlasksQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
            uniqueFlasksQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueFlasksQuery}) as t10 ON uj.id=t10.id
                WHERE uj.req_lvl<=${maxLvl}`
        }
        let implicits = `
            SELECT bf.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_flasks as bf
            LEFT JOIN baseflasks_implicit as bfi ON bf.id=bfi.flask_id 
            LEFT JOIN implicit as i ON bfi.implicit_id=i.id
            GROUP BY bf.id`
        let buffs = `
            SELECT bf.id, array_agg(b.buff) as buffs, array_agg(b.stat_order) as buff_order FROM base_flasks as bf
            LEFT JOIN flasks_buffs as b ON b.flask_id=bf.id GROUP BY bf.id`
        baseFlasksQuery = `
            SELECT bf.*, b.buffs, b.buff_order, i.implicit, i.impl_order FROM base_flasks as bf JOIN (${baseFlasksQuery}) as f ON bf.id=f.id 
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
            SELECT uf.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_flasks as uf
            LEFT JOIN uniqueflasks_stats as ufs ON ufs.item_id=uf.id
            LEFT JOIN unique_stats as us ON ufs.stat_id=us.id GROUP BY uf.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        uniqueFlasksQuery = `
            SELECT uf.*, bf.subtype, b.buff, b.buff_order, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_flasks as uf 
            JOIN(${uniqueFlasksQuery}) as f ON uf.id=f.id
            JOIN base_flasks as bf ON f.base_id=bf.id
            JOIN (${buffs}) AS b ON f.base_id=b.id
            JOIN (${implicits}) AS i ON f.base_id=i.id
            JOIN (${uniqueStats}) AS s ON f.id=s.id`
        if (req.query.stat_order && req.query.stat_order!=='null') {
            baseFlasksQuery = `
                SELECT bf.* FROM (${baseFlasksQuery}) as bf 
                WHERE array_position(bf.impl_order, '${req.query.stat_order}')>0 OR array_position(bf.impl_order, '${req.query.stat_order}')>0`
            uniqueWeaponsQuery = `
                SELECT uw.* FROM (${uniqueWeaponsQuery}) as uw 
                WHERE array_position(uw.impl_order, '${req.query.stat_order}')>0 OR array_position(uw.stat_order, '${req.query.stat_order}')>0
                OR array_position(uw.buff_order, '${req.query.stat_order}')>0`
        }
        let baseFlasks = await db.query(baseFlasksQuery)
        let uniqueFlasks = await db.query(uniqueFlasksQuery)
        
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