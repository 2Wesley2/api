const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/personController');

router.post('/', PersonController.createPerson);
router.get('/', PersonController.getPeople);
router.get('/:id', PersonController.getPersonById);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);

module.exports = router;
