const gadgetService = require('../services/gadgetService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getAllGadgets = async (req, res) => {
    try {
        const statusFilter = req.query.status;
        const gadgets = await gadgetService.getAllGadgets(statusFilter);

        return res.status(200).json(
            successResponse('Gadgets retrieved successfully', gadgets)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to retrieve gadgets', error)
        );
    }
};

const getGadgetById = async (req, res) => {
    try {
        const { id } = req.params;
        const gadget = await gadgetService.getGadgetById(id);

        if (!gadget) {
            return res.status(404).json(
                errorResponse('Gadget not found')
            );
        }

        return res.status(200).json(
            successResponse('Gadget retrieved successfully', gadget)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to retrieve gadget', error)
        );
    }
};

const createGadget = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json(
                errorResponse('Gadget name is required')
            );
        }

        const gadget = await gadgetService.createGadget({
            name,
            description,
            status: status || 'Available',
        });

        return res.status(201).json(
            successResponse('Gadget created successfully', gadget)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to create gadget', error)
        );
    }
};

const updateGadget = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const updatedGadget = await gadgetService.updateGadget(id, {
            name,
            description,
            status,
        });

        if (!updatedGadget) {
            return res.status(404).json(
                errorResponse('Gadget not found')
            );
        }

        return res.status(200).json(
            successResponse('Gadget updated successfully', updatedGadget)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to update gadget', error)
        );
    }
};

const deleteGadget = async (req, res) => {
    try {
        const { id } = req.params;

        const decommissionedGadget = await gadgetService.decommissionGadget(id);

        if (!decommissionedGadget) {
            return res.status(404).json(
                errorResponse('Gadget not found')
            );
        }

        return res.status(200).json(
            successResponse('Gadget decommissioned successfully', decommissionedGadget)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to decommission gadget', error)
        );
    }
};

const initiateSelfDestruct = async (req, res) => {
    try {
        const { id } = req.params;

        const selfDestructSequence = await gadgetService.generateSelfDestructSequence(id);

        if (!selfDestructSequence) {
            return res.status(404).json(
                errorResponse('Gadget not found or not available for self-destruct')
            );
        }

        return res.status(200).json(
            successResponse('Self-destruct sequence initiated', selfDestructSequence)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to initiate self-destruct sequence', error)
        );
    }
};

const confirmSelfDestruct = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;

        if (!code) {
            return res.status(400).json(
                errorResponse('Self-destruct confirmation code is required')
            );
        }

        const destroyedGadget = await gadgetService.executeSelfDestruct(id, code);

        if (!destroyedGadget) {
            return res.status(400).json(
                errorResponse('Invalid or expired self-destruct code')
            );
        }

        return res.status(200).json(
            successResponse('Gadget has been destroyed', destroyedGadget)
        );
    } catch (error) {
        return res.status(500).json(
            errorResponse('Failed to execute self-destruct sequence', error)
        );
    }
};

module.exports = {
    getAllGadgets,
    getGadgetById,
    createGadget,
    updateGadget,
    deleteGadget,
    initiateSelfDestruct,
    confirmSelfDestruct
};