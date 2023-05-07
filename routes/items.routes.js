const Router = require('express')
const weaponController = require('../controllers/weapon.controller')
const armourController = require('../controllers/armour.controller')
const jewelleryController = require('../controllers/jewellery.controller')
const flaskController = require('../controllers/flask.controller')
const router = new Router()

router.get('/weapon', weaponController.getWeapons)
router.get('/armour', armourController.getArmour)
router.get('/jewellery', jewelleryController.getJewellery)
router.get('/flask', flaskController.getFlasks)
// router.get('/weapon/normal', weaponController.getBaseWeapons)
// router.get('/weapon/unique', weaponController.getUniqueWeapons)

module.exports = router