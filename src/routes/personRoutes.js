const express = require('express');
const router = express.Router();
const {
  createPerson,
  getPeople,
  getPersonById,
  updatePerson,
  deletePerson
} = require('../controllers/personController');

router.post('/', createPerson);
router.get('/', getPeople);
router.get('/:id', getPersonById);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

module.exports = router;
