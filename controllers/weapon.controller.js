const db = require('../src/db')

class WeaponController {
    async getWeapons(req, res) {
        // const weapon = await db.query('SELECT * FROM base_weapon ORDER BY id ASC')
        // let weapon = await db.query(`WITH tmp_base_weapon AS (SELECT * FROM base_weapon) SELECT * FROM tmp_base_weapon`)
        let baseWeaponsQuery = 'SELECT * FROM base_weapon'
        let rareWeaponsQuery = `
            SELECT DISTINCT ON (bw.type, bw.subtype) bw.type, bw.subtype, tag.tags FROM (
                SELECT bw.id, array_agg(t.tag) AS tags FROM base_weapon AS bw 
                LEFT JOIN baseweapon_tags AS bwt ON bw.id=bwt.weapon_id
                LEFT JOIN tags AS t ON bwt.tag_id=t.id group by bw.id
            ) as tag JOIN base_weapon as bw ON bw.id=tag.id`
        let uniqueWeaponsQuery = 'SELECT * FROM unique_weapon'
        // let weapon = await db.query('\
        //     SELECT bw.*, i.stat FROM base_weapon AS bw JOIN baseweapon_implicit AS bwi \
        //     ON bw.id=bwi.weapon_id JOIN implicit AS i ON bwi.implicit_id=i.id ORDER BY bw.id ASC')
        if (req.query.type && req.query.type!=='null') {
            switch(req.query.type) {
                case 'base_dagger': // Получить все обычные кинжалы
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='Dagger' AND subtype IS NULL`
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='Dagger' AND subtype IS NULL`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='Dagger' AND subtype IS NULL`
                    // weapon = await db.query(`\
                    // SELECT bw.*, i.stat FROM base_weapon AS bw LEFT JOIN baseweapon_implicit AS bwi \
                    // ON bw.id=bwi.weapon_id LEFT JOIN implicit AS i ON bwi.implicit_id=i.id \
                    // WHERE type='Dagger' AND subtype IS NULL ORDER BY bw.id ASC`)
                    break
                case 'one_hand_axe': // Получить все одноручные топоры
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='One Handed Axe'`
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='One Handed Axe'`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='One Handed Axe'`
                    break
                case 'one_hand_sword': // Получить все одноручные мечи
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='One Handed Sword'`
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='One Handed Sword'`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='One Handed Sword'`
                    break
                case 'one_hand_mace': // Получить все одноручные булавы
                    baseWeaponsQuery = `
                        SELECT bw.id FROM base_weapon as bw 
                        JOIN (SELECT bw.id, array_agg(t.tag) AS tags FROM base_weapon AS bw
                        LEFT JOIN baseweapon_tags AS bwt ON bw.id=bwt.weapon_id
                        LEFT JOIN tags AS t ON bwt.tag_id=t.id group by bw.id) as w ON bw.id=w.id
                        WHERE array_position(w.tags, 'mace')>0 AND array_position(w.tags, 'onehand')>0`
                    rareWeaponsQuery = `
                        SELECT * FROM (${rareWeaponsQuery}) as rw 
                        WHERE array_position(tags, 'mace')>0 AND array_position(tags, 'onehand')>0`
                    break
                case 'base_staff': // Получить все обычные посохи
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='Staff' AND subtype IS NULL` 
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='Staff' AND subtype IS NULL`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='Staff' AND subtype IS NULL` 
                    break
                case 'two_hand_axe': // Получить все двуручные топоры
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Axe'` 
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='Two Handed Axe'`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Axe'` 
                    break
                case 'two_hand_mace': // Получить все двуручные булавы
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Mace'` 
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='Two Handed Mace'`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Mace'` 
                    break
                case 'two_hand_sword': // Получить все двуручные мечи
                    baseWeaponsQuery = `SELECT bw.id FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Sword'`
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE type='Two Handed Sword'`
                    // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE type='Two Handed Sword'` 
                    break
                default:
                    baseWeaponsQuery = `
                        SELECT bw.id FROM base_weapon as bw 
                        JOIN (SELECT bw.id, array_agg(t.tag) AS tags FROM base_weapon AS bw
                        LEFT JOIN baseweapon_tags AS bwt ON bw.id=bwt.weapon_id
                        LEFT JOIN tags AS t ON bwt.tag_id=t.id group by bw.id) as w ON bw.id=w.id
                        WHERE array_position(w.tags, '${req.query.type}')>0`
                    rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE array_position(tags, '${req.query.type}')>0`
                    //baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                    //console.log(baseWeaponsQuery)
                    break

                // case 'one_hand_weapon': { // Получить все одноручное базовое оружие
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'bow': { // Получить все луки
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'claw': { // Получить все когти
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'dagger': { // Получить все кинжалы
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'rune_dagger': { // Получить все рунные кинжалы
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'sceptre': { // Получить все скипетры
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'staff': { // Получить все посохи
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'attack_staff': { // Получить все боевые посохи
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'wand': { // Получить все жезлы
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
                // case 'quiver': { // Получить все колчаны
                //     baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
                //     break
                // }
            }
            //weapon = await db.query(`SELECT * FROM base_weapon WHERE type=$1 OR subtype=$1`, [req.query.type])
        }
        uniqueWeaponsQuery = `SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${baseWeaponsQuery}) AS bw ON uw.base_id=bw.id`
        if(req.query.name && req.query.name!='null') {
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t1 ON bw.id=t1.id 
                WHERE bw.name LIKE '%${req.query.name}%'`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t1 ON uw.id=t1.id 
                WHERE uw.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minCrit && req.query.minCrit!=='null') {
            let minCrit = parseFloat(req.query.minCrit)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t1 ON bw.id=t1.id WHERE bw.crit>=${minCrit}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t1 WHERE crit>=${minCrit}`
            //console.log(baseWeaponsQuery)
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t1 ON uw.id=t1.id 
                WHERE uw.min_crit>=${minCrit}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t1 WHERE min_crit>=${minCrit}`
        }
        if (req.query.maxCrit && req.query.maxCrit!=='null') {
            let maxCrit = parseFloat(req.query.maxCrit)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t2 ON bw.id=t2.id WHERE bw.crit<=${maxCrit}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t2 WHERE crit<=${maxCrit}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t2 ON uw.id=t2.id
                WHERE uw.max_crit<=${maxCrit}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t2 WHERE max_crit<=${maxCrit}`
        }
        if (req.query.minAps && req.query.minAps!=='null') {
            let minAps = parseFloat(req.query.minAps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t3 ON bw.id=t3.id WHERE bw.aps>=${minAps}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t3 WHERE aps>=${minAps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t3 ON uw.id=t3.id
                WHERE uw.min_aps>=${minAps}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t3 WHERE min_aps>=${minAps}`
        }
        if (req.query.maxAps && req.query.maxAps!=='null') {
            let maxAps = parseFloat(req.query.maxAps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t4 ON bw.id=t4.id WHERE bw.aps<=${maxAps}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t4 WHERE aps<=${maxAps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t4 ON uw.id=t4.id
                WHERE uw.max_aps<=${maxAps}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t4 WHERE max_aps<=${maxAps}`
        }
        if (req.query.minDps && req.query.minDps!=='null') {
            let minDps = parseFloat(req.query.minDps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t5 ON bw.id=t5.id WHERE bw.dps>=${minDps}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t5 WHERE dps>=${minDps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t5 ON uw.id=t5.id
                WHERE uw.min_dps>=${minDps}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t5 WHERE min_dps>=${minDps}`
        }
        if (req.query.maxDps && req.query.maxDps!=='null') {
            let maxDps = parseFloat(req.query.maxDps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t6 ON bw.id=t6.id WHERE bw.dps<=${maxDps}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t6 WHERE dps<=${maxDps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t6 ON uw.id=t6.id
                WHERE uw.max_dps<=${maxDps}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t6 WHERE max_dps<=${maxDps}`
        }
        if (req.query.minDamage && req.query.minDamage!=='null') {
            let minDamage = parseFloat(req.query.minDamage)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t7 ON bw.id=t7.id WHERE bw.min_damage>=${minDamage}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t7 WHERE min_damage>=${minDamage}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t7 ON uw.id=t7.id
                WHERE (uw.min_damage+uw.min_max_damage)/2>=${minDamage} OR (uw.max_min_damage+uw.max_damage)/2>=${minDamage}` //AND (uw.max_min_damage+uw.max_damage)/2>=${minDamage}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t7 WHERE min_damage>=${minDamage}`
        }
        if (req.query.maxDamage && req.query.maxDamage!=='null') {
            let maxDamage = parseFloat(req.query.maxDamage)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t8 ON bw.id=t8.id WHERE bw.max_damage<=${maxDamage}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t8 WHERE max_damage<=${maxDamage}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t8 ON uw.id=t8.id
                WHERE (uw.max_min_damage+uw.max_damage)/2<=${maxDamage} OR (uw.min_damage+uw.min_max_damage)/2<=${maxDamage}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t8 WHERE max_damage<=${maxDamage}`
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t9 ON bw.id=t9.id WHERE bw.req_lvl>=${minLvl}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t9 WHERE req_lvl>=${minLvl}`
            //console.log(baseWeaponsQuery)
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t9 ON uw.id=t9.id
                WHERE uw.req_lvl>=${minLvl}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t9 WHERE req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t10 ON bw.id=t10.id WHERE bw.req_lvl<=${maxLvl}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t10 WHERE req_lvl<=${maxLvl}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t10 ON uw.id=t10.id
                WHERE uw.req_lvl<=${maxLvl}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t10 WHERE req_lvl<=${maxLvl}`
        }
        if (req.query.minStr && req.query.minStr!=='null') {
            let minStr = parseInt(req.query.minStr)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t11 ON bw.id=t11.id WHERE bw.req_str>=${minStr}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t11 WHERE req_str>=${minStr}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t11 ON uw.id=t11.id
                WHERE uw.req_str>=${minStr}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t11 WHERE req_str>=${minStr}`
        }
        if (req.query.maxStr && req.query.maxStr!=='null') {
            let maxStr = parseInt(req.query.maxStr)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t12 ON bw.id=t12.id WHERE bw.req_str<=${maxStr}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t12 WHERE req_str<=${maxStr}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t12 ON uw.id=t12.id
                WHERE uw.req_str<=${maxStr}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t12 WHERE req_str<=${maxStr}`
        }
        if (req.query.minDex && req.query.minDex!=='null') {
            let minDex = parseInt(req.query.minDex)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t13 ON bw.id=t13.id WHERE bw.req_dex>=${minDex}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t13 ON uw.id=t13.id
                WHERE uw.req_dex>=${minDex}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t13 WHERE req_dex>=${minDex}`
        }
        if (req.query.maxDex && req.query.maxDex!=='null') {
            let maxDex = parseInt(req.query.maxDex)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t14 ON bw.id=t4.id WHERE bw.req_dex<=${maxDex}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t14 WHERE req_dex<=${maxDex}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t14 ON uw.id=t14.id
                WHERE uw.req_dex<=${maxDex}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t14 WHERE req_dex<=${maxDex}`
        }
        if (req.query.minInt && req.query.minInt!=='null') {
            let minInt = parseInt(req.query.minInt)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t15 ON bw.id=t15.id WHERE bw.req_int>=${minInt}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t15 WHERE req_int>=${minInt}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t15 ON uw.id=t15.id
                WHERE uw.req_int>=${minInt}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t15 WHERE req_int>=${minInt}`
        }
        if (req.query.maxInt && req.query.maxInt!=='null') {
            let maxInt = parseInt(req.query.maxInt)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t16 ON bw.id=t6.id WHERE bw.req_int<=${maxInt}`
            // baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as t16 WHERE req_int<=${maxInt}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t16 ON uw.id=t16.id
                WHERE uw.req_int<=${maxInt}`
            // uniqueWeaponsQuery = `SELECT * FROM (${uniqueWeaponsQuery}) as t16 WHERE req_int<=${maxInt}`
        }
        let implicits = `
            SELECT bw.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_weapon as bw
            LEFT JOIN baseweapon_implicit as bwi ON bw.id=bwi.weapon_id 
            LEFT JOIN implicit as i ON bwi.implicit_id=i.id
            GROUP BY bw.id`
        // baseWeaponsQuery = `
        //     SELECT bw.*, array_agg(i.stat) as implicit FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as w ON bw.id=w.id 
        //     LEFT JOIN baseweapon_implicit as bwi ON w.id=bwi.weapon_id LEFT JOIN implicit as i ON bwi.implicit_id=i.id
        //     GROUP BY bw.id`
        baseWeaponsQuery = `
            SELECT bw.*, i.implicit as implicit, i.impl_order as impl_order FROM base_weapon as bw 
            JOIN (${baseWeaponsQuery}) as w ON bw.id=w.id 
            JOIN (${implicits}) as i ON w.id=i.id`
        if (rareWeaponsQuery!=='') {
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
            rareWeaponsQuery = `
                SELECT t.type as i_type, t.subtype as i_subtype, ia.type as stat_type, ia.stat as stat, ia.stat_order as stat_order 
                FROM (${rareWeaponsQuery}) as t 
                JOIN (${affixes}) as ia ON ((t.tags && ia.tags) AND NOT (ia.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        }
        
        // let implicitsForUniqueWeapon = `
        //     SELECT uw.id, i.implicit as implicit FROM (${uniqueWeaponsQuery}) AS uw 
        //     JOIN (SELECT bw.id, array_agg(i.stat) as implicit FROM base_weapon as bw 
        //         LEFT JOIN baseweapon_implicit as bwi ON bw.id=bwi.weapon_id 
        //         LEFT JOIN implicit as i ON bwi.implicit_id=i.id GROUP BY bw.id) AS i ON uw.base_id=i.id`
        let uniqueStats = `
            SELECT uw.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_weapon as uw
            LEFT JOIN uniqueweapon_stats as uws ON uws.item_id=uw.id
            LEFT JOIN unique_stats as us ON uws.stat_id=us.id GROUP BY uw.id`
        uniqueWeaponsQuery = `
            SELECT uw.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_weapon as uw JOIN(${uniqueWeaponsQuery}) as w ON uw.id=w.id
            JOIN (${implicits}) AS i ON w.base_id=i.id
            JOIN (${uniqueStats}) AS s ON w.id=s.id`
        if (req.query.stat_order && req.query.stat_order!=='null') {
            baseWeaponsQuery = `SELECT bw.* FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.impl_order, '${req.query.stat_order}')>0`
            if (rareWeaponsQuery!=='') rareWeaponsQuery = `SELECT * FROM (${rareWeaponsQuery}) as rw WHERE rw.stat_order=${req.query.stat_order}`
            uniqueWeaponsQuery = `
                SELECT uw.* FROM (${uniqueWeaponsQuery}) as uw 
                WHERE array_position(uw.impl_order, '${req.query.stat_order}')>0 OR array_position(uw.stat_order, '${req.query.stat_order}')>0`   
        }
        if (rareWeaponsQuery!=='') rareWeaponsQuery = `
            SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats FROM (${rareWeaponsQuery}) as w GROUP BY (i_type, i_subtype)`
        // let uniqueStatsForUniqueWeapon = `
        //     SELECT uw.id, array_agg(us.stat) as stats FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_stats as uws ON uws.item_id=uw.id
        //     LEFT JOIN unique_stats as us ON uws.stat_id=us.id GROUP BY uw.id`
        // let uniqueExpands = `
        //     SELECT uw.id, array_agg(e.stat) as expands FROM (${uniqueWeaponsQuery}) as uw
        //     LEFT JOIN uniqueweapon_expands as uwe ON uw.id=uwe.item_id
        //     LEFT JOIN expands as e ON uwe.expand_id=e.id`
        // uniqueWeaponsQuery = `
        //     SELECT uw.*, i.implicit, s.stats FROM unique_weapon as uw 
        //     JOIN (${implicitsForUniqueWeapon}) AS i ON uw.id=i.id
        //     JOIN (${uniqueStatsForUniqueWeapon}) AS s ON uw.id=s.id`

        let baseWeapons = await db.query(baseWeaponsQuery)
        let rareWeapons = await db.query(rareWeaponsQuery)
        let uniqueWeapons = await db.query(uniqueWeaponsQuery)

        if(req.query.rarity==='normal') {
            console.log(baseWeapons.rows.length)
            res.status(200).json({baseWeapons: baseWeapons.rows})
        } else if(req.query.rarity==='rare') {
            console.log(rareWeapons.rows.length)
            res.status(200).json({rareWeapons: rareWeapons.rows})
        }else if(req.query.rarity==='unique') {
            console.log(uniqueWeapons.rows.length)
            res.status(200).json({uniqueWeapons: uniqueWeapons.rows})
        } else if(req.query.rarity==='any') {
            console.log(rareWeapons.rows.length+baseWeapons.rows.length+uniqueWeapons.rows.length)
            res.status(200).json({
                baseWeapons: baseWeapons.rows, 
                rareWeapons: rareWeapons.rows,
                uniqueWeapons: uniqueWeapons.rows,
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

module.exports = new WeaponController