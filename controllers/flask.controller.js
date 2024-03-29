const db = require('../src/db')

class FlaskController {
    async getFlasks(req, res) {
        let baseFlasksQuery = 'SELECT * FROM base_flasks'
        let rareFlasksQuery = `
            SELECT DISTINCT ON (bf.type, bf.subtype) bf.type, bf.subtype, tag.tags FROM (
                SELECT bf.id, array_agg(t.tag) AS tags FROM base_flasks AS bf 
                LEFT JOIN baseflasks_tags AS bft ON bf.id=bft.flask_id
                LEFT JOIN tags AS t ON bft.tag_id=t.id group by bf.id
            ) as tag JOIN base_flasks as bf ON bf.id=tag.id`
        let uniqueFlasksQuery = 'SELECT * FROM unique_flasks'
        if (req.query.type && req.query.type!=='null') {
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj
                JOIN (SELECT bj.id, array_agg(t.tag) AS tags FROM base_flasks AS bj
                    LEFT JOIN baseflasks_tags AS bjt ON bj.id=bjt.flask_id
                    LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id) as j ON bj.id=j.id
                WHERE array_position(j.tags, '${req.query.type}')>0`
            rareFlasksQuery = `SELECT * FROM (${rareFlasksQuery}) as rf WHERE array_position(tags, '${req.query.type}')>0`
        }
        uniqueFlasksQuery = `SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${baseFlasksQuery}) AS bj ON uj.base_id=bj.id`
        if(req.query.name && req.query.name!='null') {
            baseFlasksQuery = `SELECT bf.id FROM base_flasks as bf JOIN (${baseFlasksQuery}) as t1 ON bf.id=t1.id 
                WHERE bf.name LIKE '%${req.query.name}%'`
            rareFlasksQuery = ``
            uniqueFlasksQuery = `
                SELECT uf.id, uf.base_id FROM unique_flasks as uf JOIN (${uniqueFlasksQuery}) as t1 ON uf.id=t1.id 
                WHERE uf.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
            rareFlasksQuery = ``
            uniqueFlasksQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueFlasksQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
            rareFlasksQuery = ``
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
            
        let affixes = `
            SELECT tags.id, a.type, a.stat, tags.tags, tags.stat_order, fae.tags as e_tags FROM flasks_affixes as a JOIN (
                SELECT fa.id, array_agg(t.tag) as tags, fa.stat_order FROM flasks_affixes as fa  
                LEFT JOIN flasksaffixes_tags as fat ON fa.id=fat.stat_id
                LEFT JOIN tags as t ON fat.tag_id=t.id GROUP BY fa.id
            ) as tags ON a.id=tags.id LEFT JOIN (
                SELECT * FROM (SELECT fa.id, array_agg(t.tag) as tags, fa.stat_order FROM flasks_affixes as fa  
                LEFT JOIN flasksaffixes_exclusiontags as faet ON fa.id=faet.stat_id
                LEFT JOIN tags as t ON faet.tag_id=t.id GROUP BY fa.id) as tags
            ) as fae ON fae.id=tags.id`
        rareFlasksQuery = `
            SELECT t.type as i_type, t.subtype as i_subtype, fa.type as stat_type, fa.stat as stat, fa.stat_order as stat_order 
            FROM (${rareFlasksQuery}) as t 
            JOIN (${affixes}) as fa ON ((t.tags && fa.tags) AND NOT (fa.e_tags && t.tags))
            ORDER BY t.type, t.subtype, stat`
        let uniqueStats = `
            SELECT uf.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_flasks as uf
            LEFT JOIN uniqueflasks_stats as ufs ON ufs.item_id=uf.id
            LEFT JOIN unique_stats as us ON ufs.stat_id=us.id GROUP BY uf.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        uniqueFlasksQuery = `
            SELECT uf.*, bf.subtype, b.buffs, b.buff_order, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_flasks as uf 
            JOIN(${uniqueFlasksQuery}) as f ON uf.id=f.id
            JOIN base_flasks as bf ON f.base_id=bf.id
            JOIN (${buffs}) AS b ON f.base_id=b.id
            JOIN (${implicits}) AS i ON f.base_id=i.id
            JOIN (${uniqueStats}) AS s ON f.id=s.id`
        if (req.query.stat_order && req.query.stat_order!=='null') {
            // let stat_order = parseFloat(req.query.stat_order)
            // baseFlasksQuery = `
            //     SELECT bf.* FROM (${baseFlasksQuery}) as bf 
            //     WHERE array_position(bf.impl_order, ${stat_order})>0 OR array_position(bf.impl_order, ${stat_order})>0`
            if (baseFlasksQuery!=='') baseFlasksQuery = `
                SELECT bf.* FROM (${baseFlasksQuery}) as bf 
                WHERE array_cat(bf.impl_order, bf.buff_order) @> ARRAY[${req.query.stat_order}]::real[]`
            // rareFlasksQuery = `SELECT * FROM (${rareFlasksQuery}) as rf WHERE rf.stat_order=${stat_order}`
            // uniqueFlasksQuery = `
            //     SELECT uf.* FROM (${uniqueFlasksQuery}) as uf 
            //     WHERE array_position(uf.impl_order, ${stat_order})>0 OR array_position(uf.stat_order, ${stat_order})>0
            //     OR array_position(uf.buff_order, ${stat_order})>0`
            if (uniqueFlasksQuery!=='') uniqueFlasksQuery = `
                SELECT uf.* FROM (${uniqueFlasksQuery}) as uf 
                WHERE array_cat(array_cat(uf.impl_order, uf.stat_order), uf.buff_order) @> ARRAY[${req.query.stat_order}]::real[]`
        }
        // rareFlasksQuery = `
        //     SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats FROM (${rareFlasksQuery}) as f GROUP BY (i_type, i_subtype)`

        if (rareFlasksQuery!=='') {
            rareFlasksQuery = `
                SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats, array_agg(stat_order) as stats_orders 
                FROM (${rareFlasksQuery}) as f GROUP BY (i_type, i_subtype)`
            if (req.query.stat_order && req.query.stat_order!=='null') 
                rareFlasksQuery = `
                    SELECT i_type, i_subtype, stats FROM (${rareFlasksQuery}) as w WHERE stats_orders @> ARRAY[${req.query.stat_order}]::real[]`
        }

        let baseFlasks = await db.query(baseFlasksQuery)
        let rareFlasks = await db.query(rareFlasksQuery)
        let uniqueFlasks = await db.query(uniqueFlasksQuery)
        
        if(req.query.rarity==='normal') {
            // console.log(baseFlasks.rows.length)
            res.status(200).json({
                baseFlasks: baseFlasks.rows,
                resultsCount: baseFlasks.rows.length
            })
        } else if(req.query.rarity==='rare') {
            // console.log(rareFlasks.rows.length)
            res.status(200).json({
                rareFlasks: rareFlasks.rows,
                resultsCount: rareFlasks.rows.length
            })
        } else if(req.query.rarity==='unique') {
            // console.log(uniqueFlasks.rows.length)
            res.status(200).json({
                uniqueFlasks: uniqueFlasks.rows,
                resultsCount: uniqueFlasks.rows.length
            })
        } else if(req.query.rarity==='any') {
            res.status(200).json({
                baseFlasks: baseFlasks.rows, 
                rareFlasks: rareFlasks.rows,
                uniqueFlasks: uniqueFlasks.rows,
                resultsCount: baseFlasks.rows.length+rareFlasks.rows.length+uniqueFlasks.rows.length
            })
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