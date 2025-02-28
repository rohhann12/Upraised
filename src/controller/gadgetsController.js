const { gadgetService } = require('../services/gadgetsService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const gadgetservice = new gadgetService()

class gadgetController {
    getAllGadgets = async (req, res) => {
        try {
            const statusFilter = req.query.status;
            const gadgets = await gadgetservice.getAllGadgets(statusFilter);

            return res.status(200).json(
                successResponse('Gadgets retrieved successfully', gadgets)
            );
        } catch (error) {
            return res.status(500).json(
                errorResponse('Failed to retrieve gadgets', error)
            );
        }
    };

    getGadgetById = async (req, res) => {
        try {
            const { id } = req.params;
            const gadget = await gadgetservice.getGadgetById(id);

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

    createGadget = async (req, res) => {
        try {
            const { name, description, status } = req.body;

            // Basic validation
            if (!name) {
                return res.status(400).json(
                    errorResponse('Gadget name is required')
                );
            }

            const gadget = await gadgetservice.createGadget({
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

    updateGadget = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;

            const updatedGadget = await gadgetservice.updateGadget(id, {
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

    deleteGadget = async (req, res) => {
        try {
            const { id } = req.params;

            const decommissionedGadget = await gadgetservice.decommissionGadget(id);

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

    initiateSelfDestruct = async (req, res) => {
        try {
            const { id } = req.params;

            const selfDestructSequence = await gadgetservice.generateSelfDestructSequence(id);

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

    confirmSelfDestruct = async (req, res) => {
        try {
            const { id } = req.params;
            const { code } = req.body;

            if (!code) {
                return res.status(400).json(
                    errorResponse('Self-destruct confirmation code is required')
                );
            }

            const destroyedGadget = await gadgetservice.executeSelfDestruct(id, code);

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
}

module.exports = {
    gadgetController
};