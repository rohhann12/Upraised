const express = require('express');
const {gadgetController} = require('../controller/gadgetsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const gadgetcontroller=new gadgetController()
// Public routes
router.get('/gadgets', gadgetcontroller.getAllGadgets);
router.get('/gadgets/:id', gadgetcontroller.getGadgetById);

// Protected routes
router.post('/gadgets', authenticate, authorize(['admin', 'quartermaster']), gadgetcontroller.createGadget);
router.patch('/gadgets/:id', authenticate, authorize(['admin', 'quartermaster']), gadgetcontroller.updateGadget);
router.delete('/gadgets/:id', authenticate, authorize(['admin', 'quartermaster']), gadgetcontroller.deleteGadget);

// Self-destruct sequence
router.post('/gadgets/:id/self-destruct', authenticate, gadgetcontroller.initiateSelfDestruct);
router.post('/gadgets/:id/self-destruct/confirm', authenticate, gadgetcontroller.confirmSelfDestruct);

module.exports = router;