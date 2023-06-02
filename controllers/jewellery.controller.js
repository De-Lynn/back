const db = require('../src/db')

class JewelleryController {
    async getJewellery(req, res) {
        let baseJewelleryQuery = 'SELECT * FROM base_jewellery'
        let rareJewelleryQuery = `
            SELECT DISTINCT ON (bj.type, bj.subtype) bj.type, bj.subtype, tag.tags FROM (
                SELECT bj.id, array_agg(t.tag) AS tags FROM base_jewellery AS bj 
                LEFT JOIN basejewellery_tags AS bjt ON bj.id=bjt.jewellery_id
                LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id
            ) as tag JOIN base_jewellery as bj ON bj.id=tag.id`
        let uniqueJewelleryQuery = 'SELECT * FROM unique_jewellery'
        if (req.query.type && req.query.type!=='null') {
            baseJewelleryQuery = `
                SELECT bj.id FROM base_jewellery as bj
                JOIN (SELECT bj.id, array_agg(t.tag) AS tags FROM base_jewellery AS bj
                    LEFT JOIN basejewellery_tags AS bjt ON bj.id=bjt.jewellery_id
                    LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id) as j ON bj.id=j.id
                WHERE array_position(j.tags, '${req.query.type}')>0`
            rareJewelleryQuery = `SELECT * FROM (${rareJewelleryQuery}) as rj WHERE array_position(tags, '${req.query.type}')>0`
        }
        uniqueJewelleryQuery = `SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${baseJewelleryQuery}) AS bj ON uj.base_id=bj.id`
        if(req.query.name && req.query.name!='null') {
            baseJewelleryQuery = `SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t1 ON bj.id=t1.id 
                WHERE bj.name LIKE '%${req.query.name}%'`
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t1 ON uj.id=t1.id 
                WHERE uj.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseJewelleryQuery = `
                SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseJewelleryQuery = `
                SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
            rareJewelleryQuery = ``   
            uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t10 ON uj.id=t10.id
                WHERE uj.req_lvl<=${maxLvl}`
        }
        let implicits = `
            SELECT bj.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_jewellery as bj
            LEFT JOIN basejewellery_implicit as bji ON bj.id=bji.jewellery_id 
            LEFT JOIN implicit as i ON bji.implicit_id=i.id
            GROUP BY bj.id`
        baseJewelleryQuery = `
            SELECT bj.*, i.implicit as implicit, i.impl_order as impl_order FROM base_jewellery as bj 
            JOIN (${baseJewelleryQuery}) as j ON bj.id=j.id 
            JOIN (${implicits}) as i ON j.id=i.id`
        if (rareJewelleryQuery!=='') {
            let affixes = `
            SELECT tags.id, a.type, a.stat, tags.tags, tags.stat_order, iae.tags as e_tags FROM items_affixes as a JOIN (
                SELECT ia.id, array_agg(t.tag) as tags, ia.stat_order FROM items_affixes as ia  
                LEFT JOIN itemsaffixes_tags as iat ON ia.id=iat.stat_id
                LEFT JOIN tags as t ON iat.tag_id=t.id GROUP BY ia.id
            ) as tags ON a.id=tags.id LEFT JOIN (
                SELECT * FROM (SELECT ia.id, array_agg(t.tag) as tags, ia.stat_order FROM items_affixes as ia  
                LEFT JOIN itemsaffixes_exclusiontags as iaet ON ia.id=iaet.stat_id
                LEFT JOIN tags as t ON iaet.tag_id=t.id GROUP BY ia.id) as tags
            ) as iae ON iae.id=tags.id`
            rareJewelleryQuery = `
                SELECT t.type as i_type, t.subtype as i_subtype, ia.type as stat_type, ia.stat as stat, ia.stat_order as stat_order 
                FROM (${rareJewelleryQuery}) as t 
                JOIN (${affixes}) as ia ON ((t.tags && ia.tags) AND NOT (ia.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        }
        let uniqueStats = `
            SELECT uj.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_jewellery as uj
            LEFT JOIN uniquejewellery_stats as ujs ON ujs.item_id=uj.id
            LEFT JOIN unique_stats as us ON ujs.stat_id=us.id GROUP BY uj.id`
        uniqueJewelleryQuery = `
            SELECT uj.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_jewellery as uj 
            JOIN(${uniqueJewelleryQuery}) as j ON uj.id=j.id
            JOIN (${implicits}) AS i ON j.base_id=i.id
            JOIN (${uniqueStats}) AS s ON j.id=s.id`
        if (req.query.stat_order && req.query.stat_order!=='null') {
            baseJewelleryQuery = `SELECT bj.* FROM (${baseJewelleryQuery}) as bj WHERE array_position(bj.impl_order, '${req.query.stat_order}')>0`
            if (rareJewelleryQuery!=='') rareJewelleryQuery = `SELECT * FROM (${rareJewelleryQuery}) as rj WHERE rj.stat_order=${req.query.stat_order}`
            uniqueJewelleryQuery = `
                SELECT uj.* FROM (${uniqueJewelleryQuery}) as uj 
                WHERE array_position(uj.impl_order, '${req.query.stat_order}')>0 OR array_position(uj.stat_order, '${req.query.stat_order}')>0`
        }
        if (rareJewelleryQuery!=='') rareJewelleryQuery = `
            SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats FROM (${rareJewelleryQuery}) as j GROUP BY (i_type, i_subtype)`

        // baseJewelleryQuery = `
        //     SELECT bj.*, array_agg(i.stat) as implicit FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as j ON bj.id=j.id 
        //     LEFT JOIN basejewellery_implicit as bji ON j.id=bji.jewellery_id LEFT JOIN implicit as i ON bji.implicit_id=i.id
        //     GROUP BY bj.id`
        // let implicitsForUniqueJewellery = `
        //     SELECT uj.id, i.implicit as implicit FROM (${uniqueJewelleryQuery}) AS uj 
        //     JOIN (SELECT bj.id, array_agg(i.stat) as implicit FROM base_jewellery as bj 
        //         LEFT JOIN basejewellery_implicit as bji ON bj.id=bji.jewellery_id 
        //         LEFT JOIN implicit as i ON bji.implicit_id=i.id GROUP BY bj.id) AS i ON uj.base_id=i.id`
        // let uniqueStatsForUniqueJewellery = `
        //     SELECT uj.id, array_agg(us.stat) as stats FROM (${uniqueJewelleryQuery}) as uj
        //     LEFT JOIN uniquejewellery_stats as ujs ON ujs.item_id=uj.id
        //     LEFT JOIN unique_stats as us ON ujs.stat_id=us.id GROUP BY uj.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        // uniqueJewelleryQuery = `
        //     SELECT ua.*, i.implicit, s.stats FROM unique_armour as ua 
        //     JOIN (${implicitsForUniqueJewellery}) AS i ON ua.id=i.id
        //     JOIN (${uniqueStatsForUniqueJewellery}) AS s ON ua.id=s.id`

        let baseJewellery = await db.query(baseJewelleryQuery)
        let rareJewellery = await db.query(rareJewelleryQuery)
        let uniqueJewellery = await db.query(uniqueJewelleryQuery)
        
        if(req.query.rarity==='normal') {
            res.status(200).json({baseJewellery: baseJewellery.rows})
        } else if(req.query.rarity==='rare') {
            res.status(200).json({rareJewellery: rareJewellery.rows})
        } else if(req.query.rarity==='unique') {
            res.status(200).json({uniqueJewellery: uniqueJewellery.rows})
        } else if(req.query.rarity==='any') {
            res.status(200).json({
                baseJewellery: baseJewellery.rows, 
                rareJewellery: rareJewellery.rows,
                uniqueJewellery: uniqueJewellery.rows
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

module.exports = new JewelleryController