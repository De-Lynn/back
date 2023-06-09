const Router = require('express')
const weaponController = require('../controllers/weapon.controller')
const armourController = require('../controllers/armour.controller')
const jewelleryController = require('../controllers/jewellery.controller')
const flaskController = require('../controllers/flask.controller')
const statsController = require('../controllers/stats.controller')
const namesController = require('../controllers/names.controller')
const anyController = require('../controllers/any.controller')
const router = new Router()

router.get('/any', anyController.getAny)
router.get('/weapon', weaponController.getWeapons)
router.get('/armour', armourController.getArmour)
router.get('/jewellery', jewelleryController.getJewellery)
router.get('/flask', flaskController.getFlasks)
router.get('/stats', statsController.getStats)
router.get('/stats/:stat_order', statsController.getSimilarStats)
router.get('/names', namesController.getNames)
// router.get('/weapon/normal', weaponController.getBaseWeapons)
// router.get('/weapon/unique', weaponController.getUniqueWeapons)

module.exports = router