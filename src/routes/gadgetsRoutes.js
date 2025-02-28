const express = require('express');
const gadgetController = require('../controllers/gadgetController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/gadgets', gadgetController.getAllGadgets);
router.get('/gadgets/:id', gadgetController.getGadgetById);

// Protected routes
router.post('/gadgets', authenticate, authorize(['admin', 'quartermaster']), gadgetController.createGadget);
router.patch('/gadgets/:id', authenticate, authorize(['admin', 'quartermaster']), gadgetController.updateGadget);
router.delete('/gadgets/:id', authenticate, authorize(['admin', 'quartermaster']), gadgetController.deleteGadget);

// Self-destruct sequence
router.post('/gadgets/:id/self-destruct', authenticate, gadgetController.initiateSelfDestruct);
router.post('/gadgets/:id/self-destruct/confirm', authenticate, gadgetController.confirmSelfDestruct);

module.exports = router;