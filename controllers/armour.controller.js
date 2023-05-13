const db = require('../src/db')

class ArmourController {
    async getArmour(req, res) {
        let baseArmourQuery = 'SELECT * FROM base_armour'
        let uniqueArmourQuery = 'SELECT * FROM unique_armour'
        if (req.query.type && req.query.type!=='null') {
            baseArmourQuery = `
                SELECT ba.id FROM base_armour as ba 
                JOIN (SELECT ba.id, array_agg(t.tag) AS tags FROM base_armour AS ba
                    LEFT JOIN basearmour_tags AS bat ON ba.id=bat.armour_id
                    LEFT JOIN tags AS t ON bat.tag_id=t.id group by ba.id) as a ON ba.id=a.id
                WHERE array_position(a.tags, '${req.query.type}')>0`
            //baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
            //console.log(baseWeaponsQuery)   
        }
        uniqueArmourQuery = `SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${baseArmourQuery}) AS ba ON ua.base_id=ba.id`
        if(req.query.name && req.query.name!='null') {
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t1 ON ba.id=t1.id 
                WHERE ba.name LIKE '%${req.query.name}%'`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t1 ON ua.id=t1.id 
                WHERE ua.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minArmour && req.query.minArmour!=='null') {
            let minArmour = parseInt(req.query.minArmour)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t1 ON ba.id=t1.id WHERE ba.min_armour>=${minArmour}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t1 WHERE crit>=${minCrit}`
            //console.log(baseWeaponsQuery)
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t1 ON ua.id=t1.id 
                WHERE ua.min_armour>=${minArmour}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t1 WHERE min_crit>=${minCrit}`
        }
        if (req.query.maxArmour && req.query.maxArmour!=='null') {
            let maxArmour = parseInt(req.query.maxArmour)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t2 ON ba.id=t2.id WHERE ba.max_armour<=${maxArmour}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t2 WHERE crit<=${maxCrit}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t2 ON ua.id=t2.id
                WHERE ua.max_armour<=${maxArmour}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t2 WHERE max_crit<=${maxCrit}`
        }
        if (req.query.minEvasion && req.query.minEvasion!=='null') {
            let minEvasion = parseInt(req.query.minEvasion)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t3 ON ba.id=t3.id WHERE ba.min_evasion>=${minEvasion}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t3 WHERE aps>=${minAps}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t3 ON ua.id=t3.id
                WHERE ua.min_evasion>=${minEvasion}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t3 WHERE min_aps>=${minAps}`
        }
        if (req.query.maxEvasion && req.query.maxEvasion!=='null') {
            let maxEvasion = parseInt(req.query.maxEvasion)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t4 ON ba.id=t4.id WHERE ba.max_evasion<=${maxEvasion}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t4 WHERE aps<=${maxAps}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t4 ON ua.id=t4.id
                WHERE ua.max_evasion<=${maxEvasion}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t4 WHERE max_aps<=${maxAps}`
        }
        if (req.query.minEs && req.query.minEs!=='null') {
            let minEs = parseInt(req.query.minEs)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t5 ON ba.id=t5.id WHERE ba.min_es>=${minEs}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t5 WHERE dps>=${minDps}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t5 ON ua.id=t5.id
                WHERE ua.min_es>=${minEs}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t5 WHERE min_dps>=${minDps}`
        }
        if (req.query.maxEs && req.query.maxEs!=='null') {
            let maxEs = parseInt(req.query.maxEs)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t6 ON ba.id=t6.id WHERE ba.max_es<=${maxEs}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t6 WHERE dps<=${maxDps}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t6 ON ua.id=t6.id
                WHERE ua.max_es<=${maxEs}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t6 WHERE max_dps<=${maxDps}`
        }
        if (req.query.minBlock && req.query.minBlock!=='null') {
            let minBlock = parseInt(req.query.minBlock)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t7 ON ba.id=t7.id WHERE ba.block>=${minBlock}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t7 WHERE min_damage>=${minDamage}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t7 ON ua.id=t7.id
                WHERE ua.min_block>=${minBlock}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t7 WHERE min_damage>=${minDamage}`
        }
        if (req.query.maxBlock && req.query.maxBlock!=='null') {
            let maxBlock = parseInt(req.query.maxBlock)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t8 ON ba.id=t8.id WHERE ba.block<=${maxBlock}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t8 WHERE max_damage<=${maxDamage}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t8 ON ua.id=t8.id
                WHERE ua.max_block<=${maxBlock}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t8 WHERE max_damage<=${maxDamage}`
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t9 ON ba.id=t9.id WHERE ba.req_lvl>=${minLvl}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t9 WHERE req_lvl>=${minLvl}`
            //console.log(baseWeaponsQuery)
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t9 ON ua.id=t9.id
                WHERE ua.req_lvl>=${minLvl}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t9 WHERE req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t10 ON ba.id=t10.id WHERE ba.req_lvl<=${maxLvl}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t10 WHERE req_lvl<=${maxLvl}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t10 ON ua.id=t10.id
                WHERE ua.req_lvl<=${maxLvl}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t10 WHERE req_lvl<=${maxLvl}`
        }
        if (req.query.minStr && req.query.minStr!=='null') {
            let minStr = parseInt(req.query.minStr)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t11 ON ba.id=t11.id WHERE ba.req_str>=${minStr}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t11 WHERE req_str>=${minStr}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t11 ON ua.id=t11.id
                WHERE ua.req_str>=${minStr}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t11 WHERE req_str>=${minStr}`
        }
        if (req.query.maxStr && req.query.maxStr!=='null') {
            let maxStr = parseInt(req.query.maxStr)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t12 ON ba.id=t12.id WHERE ba.req_str<=${maxStr}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t12 WHERE req_str<=${maxStr}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t12 ON ua.id=t12.id
                WHERE ua.req_str<=${maxStr}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t12 WHERE req_str<=${maxStr}`
        }
        if (req.query.minDex && req.query.minDex!=='null') {
            let minDex = parseInt(req.query.minDex)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t13 ON ba.id=t13.id WHERE ba.req_dex>=${minDex}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t13 ON ua.id=t13.id
                WHERE ua.req_dex>=${minDex}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t13 WHERE req_dex>=${minDex}`
        }
        if (req.query.maxDex && req.query.maxDex!=='null') {
            let maxDex = parseInt(req.query.maxDex)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t14 ON ba.id=t4.id WHERE ba.req_dex<=${maxDex}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t14 WHERE req_dex<=${maxDex}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t14 ON ua.id=t14.id
                WHERE ua.req_dex<=${maxDex}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t14 WHERE req_dex<=${maxDex}`
        }
        if (req.query.minInt && req.query.minInt!=='null') {
            let minInt = parseInt(req.query.minInt)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t15 ON ba.id=t15.id WHERE ba.req_int>=${minInt}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t15 WHERE req_int>=${minInt}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t15 ON ua.id=t15.id
                WHERE ua.req_int>=${minInt}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t15 WHERE req_int>=${minInt}`
        }
        if (req.query.maxInt && req.query.maxInt!=='null') {
            let maxInt = parseInt(req.query.maxInt)
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t16 ON ba.id=t6.id WHERE ba.req_int<=${maxInt}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t16 WHERE req_int<=${maxInt}`
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t16 ON ua.id=t16.id
                WHERE ua.req_int<=${maxInt}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t16 WHERE req_int<=${maxInt}`
        }
        let implicits = `
            SELECT ba.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_armour as ba
            LEFT JOIN basearmour_implicit as bai ON ba.id=bai.armour_id 
            LEFT JOIN implicit as i ON bai.implicit_id=i.id
            GROUP BY ba.id`
        baseArmourQuery = `
            SELECT ba.*, i.implicit as implicit, i.impl_order as impl_order FROM base_armour as ba 
            JOIN (${baseArmourQuery}) as a ON ba.id=a.id 
            JOIN (${implicits}) as i ON a.id=i.id`
        let uniqueStats = `
            SELECT ua.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_armour as ua
            LEFT JOIN uniquearmour_stats as uas ON uas.item_id=ua.id
            LEFT JOIN unique_stats as us ON uas.stat_id=us.id GROUP BY ua.id`
        uniqueArmourQuery = `
            SELECT ua.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_armour as ua 
            JOIN(${uniqueArmourQuery}) as a ON ua.id=a.id
            JOIN (${implicits}) AS i ON a.base_id=i.id
            JOIN (${uniqueStats}) AS s ON a.id=s.id`
        if (req.query.stat_order && req.query.stat_order!=='null') {
            baseArmourQuery = `SELECT ba.* FROM (${baseArmourQuery}) as ba WHERE array_position(ba.impl_order, '${req.query.stat_order}')>0`
            uniqueWeaponsQuery = `
                SELECT ua.* FROM (${uniqueArmourQuery}) as ua 
                WHERE array_position(ua.impl_order, '${req.query.stat_order}')>0 OR array_position(ua.stat_order, '${req.query.stat_order}')>0`
        }
        // baseArmourQuery = `
        //     SELECT ba.*, array_agg(i.stat) as implicit FROM base_armour as ba JOIN (${baseArmourQuery}) as a ON ba.id=a.id 
        //     LEFT JOIN basearmour_implicit as bai ON a.id=bai.armour_id LEFT JOIN implicit as i ON bai.implicit_id=i.id
        //     GROUP BY ba.id`
        // let implicitsForUniqueArmour = `
        //     SELECT ua.id, i.implicit as implicit FROM (${uniqueArmourQuery}) AS ua 
        //     JOIN (SELECT ba.id, array_agg(i.stat) as implicit FROM base_armour as ba 
        //         LEFT JOIN basearmour_implicit as bai ON ba.id=bai.armour_id 
        //         LEFT JOIN implicit as i ON bai.implicit_id=i.id GROUP BY ba.id) AS i ON ua.base_id=i.id`
        // let uniqueStatsForUniqueArmour = `
        //     SELECT ua.id, array_agg(us.stat) as stats FROM (${uniqueArmourQuery}) as ua
        //     LEFT JOIN uniquearmour_stats as uas ON uas.item_id=ua.id
        //     LEFT JOIN unique_stats as us ON uas.stat_id=us.id GROUP BY ua.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        // uniqueArmourQuery = `
        //     SELECT ua.*, i.implicit, s.stats FROM unique_armour as ua 
        //     JOIN (${implicitsForUniqueArmour}) AS i ON ua.id=i.id
        //     JOIN (${uniqueStatsForUniqueArmour}) AS s ON ua.id=s.id`

        let baseArmour = await db.query(baseArmourQuery)
        let uniqueArmour = await db.query(uniqueArmourQuery)
        
        if(req.query.rarity==='normal') {
            res.status(200).json({baseArmour: baseArmour.rows})
        } else if(req.query.rarity==='unique') {
            //console.log(uniqueWeapons.rows.length)
            res.status(200).json({uniqueArmour: uniqueArmour.rows})
        } else if(req.query.rarity==='any') {
            res.status(200).json({baseArmour: baseArmour.rows, uniqueArmour: uniqueArmour.rows})
        }
    }
}

// pool.query('SELECT * FROM base_weapon ORDER BY id ASC', (error, results) => {
//     if(error) {
//         throw error
//     }
//     res.status(200).json(results.rows)
// })

module.exports = new ArmourController