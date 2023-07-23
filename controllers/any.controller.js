const db = require('../src/db')

class AnyController {
    async getAny(req, res) {
        // if (req.query.rarity && req.query.rarity==='normal') {
        //     let baseWeaponsQuery = 'SELECT * FROM base_weapon'
        //     let baseArmourQuery = 'SELECT * FROM base_armour'
        //     let baseJewelleryQuery = 'SELECT * FROM base_jewellery'
        //     let baseFlasksQuery = 'SELECT * FROM base_flasks'
        // } else if (req.query.rarity && req.query.rarity==='rare') {
        //     let rareWeaponsQuery = `
        //         SELECT DISTINCT ON (bw.type, bw.subtype) bw.type, bw.subtype, tag.tags FROM (
        //             SELECT bw.id, array_agg(t.tag) AS tags FROM base_weapon AS bw 
        //             LEFT JOIN baseweapon_tags AS bwt ON bw.id=bwt.weapon_id
        //             LEFT JOIN tags AS t ON bwt.tag_id=t.id group by bw.id
        //         ) as tag JOIN base_weapon as bw ON bw.id=tag.id`
        //     let rareArmourQuery = `
        //         SELECT DISTINCT ON (ba.type, ba.subtype) ba.type, ba.subtype, tag.tags FROM (
        //             SELECT ba.id, array_agg(t.tag) AS tags FROM base_armour AS ba 
        //             LEFT JOIN basearmour_tags AS bat ON ba.id=bat.armour_id
        //             LEFT JOIN tags AS t ON bat.tag_id=t.id group by ba.id
        //         ) as tag JOIN base_armour as ba ON ba.id=tag.id`
        //     let rareJewelleryQuery = `
        //         SELECT DISTINCT ON (bj.type, bj.subtype) bj.type, bj.subtype, tag.tags FROM (
        //             SELECT bj.id, array_agg(t.tag) AS tags FROM base_jewellery AS bj 
        //             LEFT JOIN basejewellery_tags AS bjt ON bj.id=bjt.jewellery_id
        //             LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id
        //         ) as tag JOIN base_jewellery as bj ON bj.id=tag.id`
        //     let rareFlasksQuery = `
        //         SELECT DISTINCT ON (bf.type, bf.subtype) bf.type, bf.subtype, tag.tags FROM (
        //             SELECT bf.id, array_agg(t.tag) AS tags FROM base_flasks AS bf 
        //             LEFT JOIN baseflasks_tags AS bft ON bf.id=bft.flask_id
        //             LEFT JOIN tags AS t ON bft.tag_id=t.id group by bf.id
        //         ) as tag JOIN base_flasks as bf ON bf.id=tag.id`
        // } else if (req.query.rarity && req.query.rarity==='unique') {
        //     let uniqueWeaponsQuery = 'SELECT * FROM unique_weapon'
        //     let uniqueArmourQuery = 'SELECT * FROM unique_armour'
        // }
        //console.log(req.query.stat_order)
        let baseWeaponsQuery = 'SELECT * FROM base_weapon'
        let rareWeaponsQuery = `
            SELECT DISTINCT ON (bw.type, bw.subtype) bw.type, bw.subtype, tag.tags FROM (
                SELECT bw.id, array_agg(t.tag) AS tags FROM base_weapon AS bw 
                LEFT JOIN baseweapon_tags AS bwt ON bw.id=bwt.weapon_id
                LEFT JOIN tags AS t ON bwt.tag_id=t.id group by bw.id
            ) as tag JOIN base_weapon as bw ON bw.id=tag.id`
        let uniqueWeaponsQuery = 'SELECT * FROM unique_weapon'
        let baseArmourQuery = 'SELECT * FROM base_armour'
        let rareArmourQuery = `
            SELECT DISTINCT ON (ba.type, ba.subtype) ba.type, ba.subtype, tag.tags FROM (
                SELECT ba.id, array_agg(t.tag) AS tags FROM base_armour AS ba 
                LEFT JOIN basearmour_tags AS bat ON ba.id=bat.armour_id
                LEFT JOIN tags AS t ON bat.tag_id=t.id group by ba.id
            ) as tag JOIN base_armour as ba ON ba.id=tag.id`
        let uniqueArmourQuery = 'SELECT * FROM unique_armour'
        let baseJewelleryQuery = 'SELECT * FROM base_jewellery'
        let rareJewelleryQuery = `
            SELECT DISTINCT ON (bj.type, bj.subtype) bj.type, bj.subtype, tag.tags FROM (
                SELECT bj.id, array_agg(t.tag) AS tags FROM base_jewellery AS bj 
                LEFT JOIN basejewellery_tags AS bjt ON bj.id=bjt.jewellery_id
                LEFT JOIN tags AS t ON bjt.tag_id=t.id group by bj.id
            ) as tag JOIN base_jewellery as bj ON bj.id=tag.id`
        let uniqueJewelleryQuery = 'SELECT * FROM unique_jewellery'
        let baseFlasksQuery = 'SELECT * FROM base_flasks'
        let rareFlasksQuery = `
            SELECT DISTINCT ON (bf.type, bf.subtype) bf.type, bf.subtype, tag.tags FROM (
                SELECT bf.id, array_agg(t.tag) AS tags FROM base_flasks AS bf 
                LEFT JOIN baseflasks_tags AS bft ON bf.id=bft.flask_id
                LEFT JOIN tags AS t ON bft.tag_id=t.id group by bf.id
            ) as tag JOIN base_flasks as bf ON bf.id=tag.id`
        let uniqueFlasksQuery = 'SELECT * FROM unique_flasks'
        // if (req.query.type && req.query.type!=='null') {
        //     baseArmourQuery = `
        //         SELECT ba.id FROM base_armour as ba 
        //         JOIN (SELECT ba.id, array_agg(t.tag) AS tags FROM base_armour AS ba
        //             LEFT JOIN basearmour_tags AS bat ON ba.id=bat.armour_id
        //             LEFT JOIN tags AS t ON bat.tag_id=t.id group by ba.id) as a ON ba.id=a.id
        //         WHERE array_position(a.tags, '${req.query.type}')>0`
        //     //baseWeaponsQuery = `SELECT * FROM (${baseWeaponsQuery}) as bw WHERE array_position(bw.tags, '${req.query.type}')>0`
        //     //console.log(baseWeaponsQuery)   
        // }
        //uniqueArmourQuery = `SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${baseArmourQuery}) AS ba ON ua.base_id=ba.id`
        if(req.query.name && req.query.name!='null') {
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t1 ON bw.id=t1.id 
                WHERE bw.name LIKE '%${req.query.name}%'`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t1 ON uw.id=t1.id 
                WHERE uw.name LIKE '%${req.query.name}%'`
            baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t1 ON ba.id=t1.id 
                WHERE ba.name LIKE '%${req.query.name}%'`
            rareArmourQuery = ``
            uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t1 ON ua.id=t1.id 
                WHERE ua.name LIKE '%${req.query.name}%'`
            baseJewelleryQuery = `SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t1 ON bj.id=t1.id 
                WHERE bj.name LIKE '%${req.query.name}%'`
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t1 ON uj.id=t1.id 
                WHERE uj.name LIKE '%${req.query.name}%'`
            baseFlasksQuery = `SELECT bf.id FROM base_flasks as bf JOIN (${baseFlasksQuery}) as t1 ON bf.id=t1.id 
                WHERE bf.name LIKE '%${req.query.name}%'`
            rareFlasksQuery = ``
            uniqueFlasksQuery = `
                SELECT uf.id, uf.base_id FROM unique_flasks as uf JOIN (${uniqueFlasksQuery}) as t1 ON uf.id=t1.id 
                WHERE uf.name LIKE '%${req.query.name}%'`
        }
        if (req.query.minCrit && req.query.minCrit!=='null') {
            let minCrit = parseFloat(req.query.minCrit)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t1 ON bw.id=t1.id WHERE bw.crit>=${minCrit}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t1 ON uw.id=t1.id 
                WHERE uw.min_crit>=${minCrit}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxCrit && req.query.maxCrit!=='null') {
            let maxCrit = parseFloat(req.query.maxCrit)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t2 ON bw.id=t2.id WHERE bw.crit<=${maxCrit}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t2 ON uw.id=t2.id
                WHERE uw.max_crit<=${maxCrit}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minAps && req.query.minAps!=='null') {
            let minAps = parseFloat(req.query.minAps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t3 ON bw.id=t3.id WHERE bw.aps>=${minAps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t3 ON uw.id=t3.id
                WHERE uw.min_aps>=${minAps}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxAps && req.query.maxAps!=='null') {
            let maxAps = parseFloat(req.query.maxAps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t4 ON bw.id=t4.id WHERE bw.aps<=${maxAps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t4 ON uw.id=t4.id
                WHERE uw.max_aps<=${maxAps}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minDps && req.query.minDps!=='null') {
            let minDps = parseFloat(req.query.minDps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t5 ON bw.id=t5.id WHERE bw.dps>=${minDps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t5 ON uw.id=t5.id
                WHERE uw.min_dps>=${minDps}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxDps && req.query.maxDps!=='null') {
            let maxDps = parseFloat(req.query.maxDps)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t6 ON bw.id=t6.id WHERE bw.dps<=${maxDps}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t6 ON uw.id=t6.id
                WHERE uw.max_dps<=${maxDps}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minDamage && req.query.minDamage!=='null') {
            let minDamage = parseFloat(req.query.minDamage)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t7 ON bw.id=t7.id WHERE bw.min_damage>=${minDamage}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t7 ON uw.id=t7.id
                WHERE (uw.min_damage+uw.min_max_damage)/2>=${minDamage} OR (uw.max_min_damage+uw.max_damage)/2>=${minDamage}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxDamage && req.query.maxDamage!=='null') {
            let maxDamage = parseFloat(req.query.maxDamage)
            baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t8 ON bw.id=t8.id WHERE bw.max_damage<=${maxDamage}`
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t8 ON uw.id=t8.id
                WHERE (uw.max_min_damage+uw.max_damage)/2<=${maxDamage} OR (uw.min_damage+uw.min_max_damage)/2<=${maxDamage}`
            baseArmourQuery = ``
            rareArmourQuery = ``
            uniqueArmourQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minArmour && req.query.minArmour!=='null') {
            let minArmour = parseInt(req.query.minArmour)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t1 ON ba.id=t1.id WHERE ba.min_armour>=${minArmour}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t1 ON ua.id=t1.id 
                WHERE ua.min_armour>=${minArmour}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxArmour && req.query.maxArmour!=='null') {
            let maxArmour = parseInt(req.query.maxArmour)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t2 ON ba.id=t2.id WHERE ba.max_armour<=${maxArmour}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t2 ON ua.id=t2.id
                WHERE ua.max_armour<=${maxArmour}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minEvasion && req.query.minEvasion!=='null') {
            let minEvasion = parseInt(req.query.minEvasion)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t3 ON ba.id=t3.id WHERE ba.min_evasion>=${minEvasion}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t3 ON ua.id=t3.id
                WHERE ua.min_evasion>=${minEvasion}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxEvasion && req.query.maxEvasion!=='null') {
            let maxEvasion = parseInt(req.query.maxEvasion)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t4 ON ba.id=t4.id WHERE ba.max_evasion<=${maxEvasion}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t4 ON ua.id=t4.id
                WHERE ua.max_evasion<=${maxEvasion}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minEs && req.query.minEs!=='null') {
            let minEs = parseInt(req.query.minEs)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t5 ON ba.id=t5.id WHERE ba.min_es>=${minEs}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t5 ON ua.id=t5.id
                WHERE ua.min_es>=${minEs}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxEs && req.query.maxEs!=='null') {
            let maxEs = parseInt(req.query.maxEs)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t6 ON ba.id=t6.id WHERE ba.max_es<=${maxEs}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t6 ON ua.id=t6.id
                WHERE ua.max_es<=${maxEs}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minBlock && req.query.minBlock!=='null') {
            let minBlock = parseInt(req.query.minBlock)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t7 ON ba.id=t7.id WHERE ba.block>=${minBlock}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t7 ON ua.id=t7.id
                WHERE ua.min_block>=${minBlock}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxBlock && req.query.maxBlock!=='null') {
            let maxBlock = parseInt(req.query.maxBlock)
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t8 ON ba.id=t8.id WHERE ba.block<=${maxBlock}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t8 ON ua.id=t8.id
                WHERE ua.max_block<=${maxBlock}`
            baseWeaponsQuery = ``
            rareWeaponsQuery = ``
            uniqueWeaponsQuery = ``
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minLvl && req.query.minLvl!=='null') {
            let minLvl = parseInt(req.query.minLvl)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t9 ON bw.id=t9.id WHERE bw.req_lvl>=${minLvl}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t9 ON uw.id=t9.id
                WHERE uw.req_lvl>=${minLvl}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t9 ON ba.id=t9.id WHERE ba.req_lvl>=${minLvl}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t9 ON ua.id=t9.id
                WHERE ua.req_lvl>=${minLvl}`
            if (baseJewelleryQuery!=='') baseJewelleryQuery = `
                SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
            rareJewelleryQuery = ``
            if (uniqueJewelleryQuery!=='') uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
            if (baseFlasksQuery!=='') baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t9 ON bj.id=t9.id WHERE bj.req_lvl>=${minLvl}`
            rareFlasksQuery = ``
            if (uniqueFlasksQuery!=='') uniqueFlasksQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueFlasksQuery}) as t9 ON uj.id=t9.id
                WHERE uj.req_lvl>=${minLvl}`
        }
        if (req.query.maxLvl && req.query.maxLvl!=='null') {
            let maxLvl = parseInt(req.query.maxLvl)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t10 ON bw.id=t10.id WHERE bw.req_lvl<=${maxLvl}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t10 ON uw.id=t10.id
                WHERE uw.req_lvl<=${maxLvl}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t10 ON ba.id=t10.id WHERE ba.req_lvl<=${maxLvl}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t10 ON ua.id=t10.id
                WHERE ua.req_lvl<=${maxLvl}`
            if (baseJewelleryQuery!=='') baseJewelleryQuery = `
                SELECT bj.id FROM base_jewellery as bj JOIN (${baseJewelleryQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
            rareJewelleryQuery = ``
            if (uniqueJewelleryQuery!=='') uniqueJewelleryQuery = `
                SELECT uj.id, uj.base_id FROM unique_jewellery as uj JOIN (${uniqueJewelleryQuery}) as t10 ON uj.id=t10.id
                WHERE uj.req_lvl<=${maxLvl}`
            if (baseFlasksQuery!=='') baseFlasksQuery = `
                SELECT bj.id FROM base_flasks as bj JOIN (${baseFlasksQuery}) as t10 ON bj.id=t10.id WHERE bj.req_lvl<=${maxLvl}`
            rareFlasksQuery = ``
            if (uniqueFlasksQuery!=='') uniqueFlasksQuery = `
                SELECT uj.id, uj.base_id FROM unique_flasks as uj JOIN (${uniqueFlasksQuery}) as t10 ON uj.id=t10.id
                WHERE uj.req_lvl<=${maxLvl}`

        }
        if (req.query.minStr && req.query.minStr!=='null') {
            let minStr = parseInt(req.query.minStr)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t11 ON bw.id=t11.id WHERE bw.req_str>=${minStr}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t11 ON uw.id=t11.id
                WHERE uw.req_str>=${minStr}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t11 ON ba.id=t11.id WHERE ba.req_str>=${minStr}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t11 ON ua.id=t11.id
                WHERE ua.req_str>=${minStr}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxStr && req.query.maxStr!=='null') {
            let maxStr = parseInt(req.query.maxStr)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t12 ON bw.id=t12.id WHERE bw.req_str<=${maxStr}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t12 ON uw.id=t12.id
                WHERE uw.req_str<=${maxStr}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t12 ON ba.id=t12.id WHERE ba.req_str<=${maxStr}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t12 ON ua.id=t12.id
                WHERE ua.req_str<=${maxStr}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minDex && req.query.minDex!=='null') {
            let minDex = parseInt(req.query.minDex)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t13 ON bw.id=t13.id WHERE bw.req_dex>=${minDex}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t13 ON uw.id=t13.id
                WHERE uw.req_dex>=${minDex}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t13 ON ba.id=t13.id WHERE ba.req_dex>=${minDex}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t13 ON ua.id=t13.id
                WHERE ua.req_dex>=${minDex}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxDex && req.query.maxDex!=='null') {
            let maxDex = parseInt(req.query.maxDex)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t14 ON bw.id=t4.id WHERE bw.req_dex<=${maxDex}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t14 ON uw.id=t14.id
                WHERE uw.req_dex<=${maxDex}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t14 ON ba.id=t4.id WHERE ba.req_dex<=${maxDex}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t14 ON ua.id=t14.id
                WHERE ua.req_dex<=${maxDex}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.minInt && req.query.minInt!=='null') {
            let minInt = parseInt(req.query.minInt)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t15 ON bw.id=t15.id WHERE bw.req_int>=${minInt}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t15 ON uw.id=t15.id
                WHERE uw.req_int>=${minInt}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t15 ON ba.id=t15.id WHERE ba.req_int>=${minInt}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t15 ON ua.id=t15.id
                WHERE ua.req_int>=${minInt}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        if (req.query.maxInt && req.query.maxInt!=='null') {
            let maxInt = parseInt(req.query.maxInt)
            if (baseWeaponsQuery!=='') baseWeaponsQuery = `SELECT bw.id FROM base_weapon as bw JOIN (${baseWeaponsQuery}) as t16 ON bw.id=t6.id WHERE bw.req_int<=${maxInt}`
            rareWeaponsQuery = ``
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.id, uw.base_id FROM unique_weapon as uw JOIN (${uniqueWeaponsQuery}) as t16 ON uw.id=t16.id
                WHERE uw.req_int<=${maxInt}`
            if (baseArmourQuery!=='') baseArmourQuery = `SELECT ba.id FROM base_armour as ba JOIN (${baseArmourQuery}) as t16 ON ba.id=t6.id WHERE ba.req_int<=${maxInt}`
            rareArmourQuery = ``
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.id, ua.base_id FROM unique_armour as ua JOIN (${uniqueArmourQuery}) as t16 ON ua.id=t16.id
                WHERE ua.req_int<=${maxInt}`
            baseJewelleryQuery = ``
            rareJewelleryQuery = ``
            uniqueJewelleryQuery = ``
            baseFlasksQuery = ``
            rareFlasksQuery = ``
            uniqueFlasksQuery = ``
        }
        let baseWeaponsimplicits = `
            SELECT bw.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_weapon as bw
            LEFT JOIN baseweapon_implicit as bwi ON bw.id=bwi.weapon_id 
            LEFT JOIN implicit as i ON bwi.implicit_id=i.id
            GROUP BY bw.id`
        if (baseWeaponsQuery!=='') baseWeaponsQuery = `
            SELECT bw.*, i.implicit as implicit, i.impl_order as impl_order FROM base_weapon as bw 
            JOIN (${baseWeaponsQuery}) as w ON bw.id=w.id 
            JOIN (${baseWeaponsimplicits}) as i ON w.id=i.id`
        let itemsAffixes = `
            SELECT tags.id, a.type, a.stat, tags.tags, tags.stat_order, iae.tags as e_tags FROM items_affixes as a JOIN (
                SELECT ia.id, array_agg(t.tag) as tags, ia.stat_order FROM items_affixes as ia  
                LEFT JOIN itemsaffixes_tags as iat ON ia.id=iat.stat_id
                LEFT JOIN tags as t ON iat.tag_id=t.id GROUP BY ia.id
            ) as tags ON a.id=tags.id LEFT JOIN (
                SELECT * FROM (SELECT ia.id, array_agg(t.tag) as tags, ia.stat_order FROM items_affixes as ia  
                LEFT JOIN itemsaffixes_exclusiontags as iaet ON ia.id=iaet.stat_id
                LEFT JOIN tags as t ON iaet.tag_id=t.id GROUP BY ia.id) as tags
            ) as iae ON iae.id=tags.id`
        if (rareWeaponsQuery!=='') {
            rareWeaponsQuery = `
                SELECT t.type as i_type, t.subtype as i_subtype, ia.type as stat_type, ia.stat as stat, ia.stat_order as stat_order 
                FROM (${rareWeaponsQuery}) as t 
                JOIN (${itemsAffixes}) as ia ON ((t.tags && ia.tags) AND NOT (ia.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        }
        let uniqueWeaponsStats = `
            SELECT uw.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_weapon as uw
            LEFT JOIN uniqueweapon_stats as uws ON uws.item_id=uw.id
            LEFT JOIN unique_stats as us ON uws.stat_id=us.id GROUP BY uw.id`
        if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
            SELECT uw.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_weapon as uw JOIN(${uniqueWeaponsQuery}) as w ON uw.id=w.id
            JOIN (${baseWeaponsimplicits}) AS i ON w.base_id=i.id
            JOIN (${uniqueWeaponsStats}) AS s ON w.id=s.id`
        let baseArmourImplicits = `
            SELECT ba.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_armour as ba
            LEFT JOIN basearmour_implicit as bai ON ba.id=bai.armour_id 
            LEFT JOIN implicit as i ON bai.implicit_id=i.id
            GROUP BY ba.id`
        if (baseArmourQuery!=='') baseArmourQuery = `
            SELECT ba.*, i.implicit as implicit, i.impl_order as impl_order FROM base_armour as ba 
            JOIN (${baseArmourQuery}) as a ON ba.id=a.id 
            JOIN (${baseArmourImplicits}) as i ON a.id=i.id`
        if (rareArmourQuery!=='') {
            rareArmourQuery = `
                SELECT t.type as i_type, t.subtype as i_subtype, ia.type as stat_type, ia.stat as stat, ia.stat_order as stat_order 
                FROM (${rareArmourQuery}) as t 
                JOIN (${itemsAffixes}) as ia ON ((t.tags && ia.tags) AND NOT (ia.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        } 
        let uniqueArmourStats = `
            SELECT ua.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_armour as ua
            LEFT JOIN uniquearmour_stats as uas ON uas.item_id=ua.id
            LEFT JOIN unique_stats as us ON uas.stat_id=us.id GROUP BY ua.id`
        if (uniqueArmourQuery!=='') uniqueArmourQuery = `
            SELECT ua.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_armour as ua 
            JOIN(${uniqueArmourQuery}) as a ON ua.id=a.id
            JOIN (${baseArmourImplicits}) AS i ON a.base_id=i.id
            JOIN (${uniqueArmourStats}) AS s ON a.id=s.id`
        let baseJewelleryimplicits = `
            SELECT bj.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_jewellery as bj
            LEFT JOIN basejewellery_implicit as bji ON bj.id=bji.jewellery_id 
            LEFT JOIN implicit as i ON bji.implicit_id=i.id
            GROUP BY bj.id`
        if (baseJewelleryQuery!=='') baseJewelleryQuery = `
            SELECT bj.*, i.implicit as implicit, i.impl_order as impl_order FROM base_jewellery as bj 
            JOIN (${baseJewelleryQuery}) as j ON bj.id=j.id 
            JOIN (${baseJewelleryimplicits}) as i ON j.id=i.id`
        if (rareJewelleryQuery!=='') {
            rareJewelleryQuery = `
                SELECT t.type as i_type, t.subtype as i_subtype, ia.type as stat_type, ia.stat as stat, ia.stat_order as stat_order 
                FROM (${rareJewelleryQuery}) as t 
                JOIN (${itemsAffixes}) as ia ON ((t.tags && ia.tags) AND NOT (ia.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        }
        let uniqueJewelleryStats = `
            SELECT uj.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_jewellery as uj
            LEFT JOIN uniquejewellery_stats as ujs ON ujs.item_id=uj.id
            LEFT JOIN unique_stats as us ON ujs.stat_id=us.id GROUP BY uj.id`
        if (uniqueJewelleryQuery!=='') uniqueJewelleryQuery = `
            SELECT uj.*, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_jewellery as uj 
            JOIN(${uniqueJewelleryQuery}) as j ON uj.id=j.id
            JOIN (${baseJewelleryimplicits}) AS i ON j.base_id=i.id
            JOIN (${uniqueJewelleryStats}) AS s ON j.id=s.id`
        let baseFlasksimplicits = `
            SELECT bf.id, array_agg(i.stat) as implicit, array_agg(i.stat_order) as impl_order FROM base_flasks as bf
            LEFT JOIN baseflasks_implicit as bfi ON bf.id=bfi.flask_id 
            LEFT JOIN implicit as i ON bfi.implicit_id=i.id
            GROUP BY bf.id`
        let buffs = `
            SELECT bf.id, array_agg(b.buff) as buffs, array_agg(b.stat_order) as buff_order FROM base_flasks as bf
            LEFT JOIN flasks_buffs as b ON b.flask_id=bf.id GROUP BY bf.id`
        if (baseFlasksQuery!=='') baseFlasksQuery = `
            SELECT bf.*, b.buffs, b.buff_order, i.implicit, i.impl_order FROM base_flasks as bf JOIN (${baseFlasksQuery}) as f ON bf.id=f.id 
            JOIN (${baseFlasksimplicits}) as i ON f.id=i.id
            JOIN (${buffs}) as b ON b.id=f.id`
        if (rareFlasksQuery!=='') {
            let flasksAffixes = `
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
                JOIN (${flasksAffixes}) as fa ON ((t.tags && fa.tags) AND NOT (fa.e_tags && t.tags))
                ORDER BY t.type, t.subtype, stat`
        }
        let uniqueFlasksStats = `
            SELECT uf.id, array_agg(us.stat) as stats, array_agg(us.stat_order) as stat_order FROM unique_flasks as uf
            LEFT JOIN uniqueflasks_stats as ufs ON ufs.item_id=uf.id
            LEFT JOIN unique_stats as us ON ufs.stat_id=us.id GROUP BY uf.id`
        if (uniqueFlasksQuery!=='') uniqueFlasksQuery = `
            SELECT uf.*, bf.subtype, b.buffs, b.buff_order, i.implicit, i.impl_order, s.stats, s.stat_order FROM unique_flasks as uf 
            JOIN(${uniqueFlasksQuery}) as f ON uf.id=f.id
            JOIN base_flasks as bf ON f.base_id=bf.id
            JOIN (${buffs}) AS b ON f.base_id=b.id
            JOIN (${baseFlasksimplicits}) AS i ON f.base_id=i.id
            JOIN (${uniqueFlasksStats}) AS s ON f.id=s.id`

        if (req.query.stat_order && req.query.stat_order!=='null') {
            if (baseWeaponsQuery!=='') 
                baseWeaponsQuery = `SELECT bw.* FROM (${baseWeaponsQuery}) as bw WHERE bw.impl_order @> ARRAY[${req.query.stat_order}]`
            // if (rareWeaponsQuery!=='') {
            //     let rareStats = `SELECT array_agg(rw.stat_order) as so_array FROM (${rareWeaponsQuery}) as rw`
            //     rareWeaponsQuery = `SELECT rw.* FROM (${rareWeaponsQuery}) as rw WHERE (${rareStats}) @> ARRAY[${req.query.stat_order}]::real[]`
            //     // CROSS JOIN (${rareStats}) as rs
            //     // WHERE rs.so_array @> ARRAY[${req.query.stat_order}]`
            //     //WHERE rw.stat_order=${req.query.stat_order}`
            // }
            if (uniqueWeaponsQuery!=='') uniqueWeaponsQuery = `
                SELECT uw.* FROM (${uniqueWeaponsQuery}) as uw WHERE array_cat(uw.impl_order, uw.stat_order) @> ARRAY[${req.query.stat_order}]`
                //array_position(uw.impl_order, '${req.query.stat_order}')>0 OR array_position(uw.stat_order, '${req.query.stat_order}')>0`
            if (baseArmourQuery!=='') 
                baseArmourQuery = `SELECT ba.* FROM (${baseArmourQuery}) as ba WHERE ba.impl_order @> ARRAY[${req.query.stat_order}]`
            // if (rareArmourQuery!=='') {
            //     rareArmourQuery = `SELECT * FROM (${rareArmourQuery}) as ra WHERE ra.stat_order=${req.query.stat_order}`
            // }
            if (uniqueArmourQuery!=='') uniqueArmourQuery = `
                SELECT ua.* FROM (${uniqueArmourQuery}) as ua WHERE array_cat(ua.impl_order, ua.stat_order) @> ARRAY[${req.query.stat_order}]`
                //array_position(ua.impl_order, '${req.query.stat_order}')>0 OR array_position(ua.stat_order, '${req.query.stat_order}')>0`
            if (baseJewelleryQuery!=='') 
                baseJewelleryQuery = `SELECT bj.* FROM (${baseJewelleryQuery}) as bj WHERE bj.impl_order @> ARRAY[${req.query.stat_order}]`
            // if (rareJewelleryQuery!=='') {
            //     rareJewelleryQuery = `SELECT * FROM (${rareJewelleryQuery}) as rj WHERE rj.stat_order=${req.query.stat_order}`
            // }
            if (uniqueJewelleryQuery!=='') uniqueJewelleryQuery = `
                SELECT uj.* FROM (${uniqueJewelleryQuery}) as uj WHERE array_cat(uj.impl_order, uj.stat_order) @> ARRAY[${req.query.stat_order}]`
                //array_position(uj.impl_order, '${req.query.stat_order}')>0 OR array_position(uj.stat_order, '${req.query.stat_order}')>0`
            if (baseFlasksQuery!=='') baseFlasksQuery = `
                SELECT bf.* FROM (${baseFlasksQuery}) as bf 
                WHERE array_cat(bf.impl_order, bf.buff_order) @> ARRAY[${req.query.stat_order}]::real[]`
                //array_position(bf.impl_order, '${req.query.stat_order}')>0 OR array_position(bf.buff_order, '${req.query.stat_order}')>0`
            // if (rareFlasksQuery!=='') {
            //     rareFlasksQuery = `SELECT * FROM (${rareFlasksQuery}) as rf WHERE rf.stat_order=${req.query.stat_order}`
            // }
            if (uniqueFlasksQuery!=='') uniqueFlasksQuery = `
                SELECT uf.* FROM (${uniqueFlasksQuery}) as uf 
                WHERE array_cat(array_cat(uf.impl_order, uf.stat_order), uf.buff_order) @> ARRAY[${req.query.stat_order}]::real[]`
                // array_position(uf.impl_order, '${req.query.stat_order}')>0 OR array_position(uf.stat_order, '${req.query.stat_order}')>0
                // OR array_position(uf.buff_order, '${req.query.stat_order}')>0`
        }
        if (rareWeaponsQuery!=='') {
            rareWeaponsQuery = `
                SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats, array_agg(stat_order) as stats_orders 
                FROM (${rareWeaponsQuery}) as w GROUP BY (i_type, i_subtype)` 
            if (req.query.stat_order && req.query.stat_order!=='null') 
                rareWeaponsQuery = `
                    SELECT i_type, i_subtype, stats FROM (${rareWeaponsQuery}) as w WHERE stats_orders @> ARRAY[${req.query.stat_order}]::real[]`   
        }
        if (rareArmourQuery!=='') {
            rareArmourQuery = `
                SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats, array_agg(stat_order) as stats_orders 
                FROM (${rareArmourQuery}) as a GROUP BY (i_type, i_subtype)`
            if (req.query.stat_order && req.query.stat_order!=='null') 
                rareArmourQuery = `
                    SELECT i_type, i_subtype, stats FROM (${rareArmourQuery}) as a WHERE stats_orders @> ARRAY[${req.query.stat_order}]::real[]`
        }
        if (rareJewelleryQuery!=='') {
            rareJewelleryQuery = `
                SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats, array_agg(stat_order) as stats_orders 
                FROM (${rareJewelleryQuery}) as j GROUP BY (i_type, i_subtype)`
            if (req.query.stat_order && req.query.stat_order!=='null') 
                rareJewelleryQuery = `
                    SELECT i_type, i_subtype, stats FROM (${rareJewelleryQuery}) as j WHERE stats_orders @> ARRAY[${req.query.stat_order}]::real[]`
        }
        if (rareFlasksQuery!=='') {
            rareFlasksQuery = `
                SELECT i_type, i_subtype, array_agg(ARRAY[stat_type, stat]) as stats, array_agg(stat_order) as stats_orders 
                FROM (${rareFlasksQuery}) as f GROUP BY (i_type, i_subtype)`
            if (req.query.stat_order && req.query.stat_order!=='null') 
                rareFlasksQuery = `
                    SELECT i_type, i_subtype, stats FROM (${rareFlasksQuery}) as w WHERE stats_orders @> ARRAY[${req.query.stat_order}]::real[]`
        }

        let baseWeapons = await db.query(baseWeaponsQuery)
        let rareWeapons = await db.query(rareWeaponsQuery)
        let uniqueWeapons = await db.query(uniqueWeaponsQuery)
        let baseArmour = await db.query(baseArmourQuery)
        let rareArmour = await db.query(rareArmourQuery)
        let uniqueArmour = await db.query(uniqueArmourQuery)
        let baseJewellery = await db.query(baseJewelleryQuery)
        let rareJewellery = await db.query(rareJewelleryQuery)
        let uniqueJewellery = await db.query(uniqueJewelleryQuery)
        let baseFlasks = await db.query(baseFlasksQuery)
        let rareFlasks = await db.query(rareFlasksQuery)
        let uniqueFlasks = await db.query(uniqueFlasksQuery)
        
        if(req.query.rarity==='normal') {
            res.status(200).json({
                baseWeapons: baseWeapons.rows,
                baseArmour: baseArmour.rows,
                baseJewellery: baseJewellery.rows,
                baseFlasks: baseFlasks.rows,
                resultsCount: baseWeapons.rows.length+baseArmour.rows.length+baseJewellery.rows.length+baseFlasks.rows.length
            })
        } else if(req.query.rarity==='rare') {
            res.status(200).json({
                rareWeapons: rareWeapons.rows,
                rareArmour: rareArmour.rows,
                rareJewellery: rareJewellery.rows,
                rareFlasks: rareFlasks.rows,
                resultsCount: rareWeapons.rows.length+rareArmour.rows.length+rareJewellery.rows.length+rareFlasks.rows.length
            })
        } else if(req.query.rarity==='unique') {
            //console.log(uniqueWeapons.rows.length)
            res.status(200).json({
                uniqueWeapons: uniqueWeapons.rows,
                uniqueArmour: uniqueArmour.rows,
                uniqueJewellery: uniqueJewellery.rows,
                uniqueFlasks: uniqueFlasks.rows,
                resultsCount: uniqueWeapons.rows.length+uniqueArmour.rows.length+uniqueJewellery.rows.length+uniqueFlasks.rows.length
            })
        } else 
        if(req.query.rarity==='any') {
            res.status(200).json({
                baseWeapons: baseWeapons.rows, rareWeapons: rareWeapons.rows, uniqueWeapons: uniqueWeapons.rows,
                baseArmour: baseArmour.rows, rareArmour: rareArmour.rows, uniqueArmour: uniqueArmour.rows,
                baseJewellery: baseJewellery.rows, rareJewellery: rareJewellery.rows, uniqueJewellery: uniqueJewellery.rows,
                baseFlasks: baseFlasks.rows, rareFlasks: rareFlasks.rows, uniqueFlasks: uniqueFlasks.rows,
                resultsCount: 
                    rareWeapons.rows.length+baseWeapons.rows.length+uniqueWeapons.rows.length+
                    baseArmour.rows.length+rareArmour.rows.length+uniqueArmour.rows.length+
                    baseJewellery.rows.length+rareJewellery.rows.length+uniqueJewellery.rows.length+
                    baseFlasks.rows.length+rareFlasks.rows.length+uniqueFlasks.rows.length
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

module.exports = new AnyController