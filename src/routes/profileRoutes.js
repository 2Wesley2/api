const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');

router.post('/', ProfileController.createProfile);
router.get('/', ProfileController.getProfiles);
router.get('/:id', ProfileController.getProfileById);
router.put('/:id', ProfileController.updateProfile);
router.delete('/:id', ProfileController.deleteProfile);

module.exports = router;
