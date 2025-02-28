const { PrismaClient } = require('@prisma/client');
const {
    generateCodename,
    generateMissionSuccessProbability,
    generateSelfDestructCode
} = require('../utils/codeGenerator');

const prisma = new PrismaClient();

class gadgetService {
    getAllGadgets = async (statusFilter) => {
        const filter = statusFilter ? { where: { status: statusFilter } } : {};

        const gadgets = await prisma.gadget.findMany({
            ...filter,
            orderBy: { updatedAt: 'desc' },
        });

        // Add random mission success probability to each gadget
        return gadgets.map(gadget => ({
            ...gadget,
            missionSuccessProbability: generateMissionSuccessProbability(),
        }));
    };

    getGadgetById = async (id) => {
        const gadget = await prisma.gadget.findUnique({
            where: { id },
        });

        if (!gadget) {
            return null;
        }

        return {
            ...gadget,
            missionSuccessProbability: generateMissionSuccessProbability(),
        };
    };

    createGadget = async (gadgetData) => {
        const codename = generateCodename();

        return prisma.gadget.create({
            data: {
                ...gadgetData,
                codename,
            },
        });
    };

    updateGadget = async (id, gadgetData) => {
        // Make sure we're not trying to update the ID or codename
        const { id: _, codename: __, ...updateData } = gadgetData;

        const gadget = await prisma.gadget.findUnique({
            where: { id },
        });

        if (!gadget) {
            return null;
        }

        return prisma.gadget.update({
            where: { id },
            data: updateData,
        });
    };

    decommissionGadget = async (id) => {
        const gadget = await prisma.gadget.findUnique({
            where: { id },
        });

        if (!gadget) {
            return null;
        }

        return prisma.gadget.update({
            where: { id },
            data: {
                status: 'Decommissioned',
                decommissionedAt: new Date(),
            },
        });
    };

    generateSelfDestructSequence = async (gadgetId) => {
        const gadget = await prisma.gadget.findUnique({
            where: { id: gadgetId },
        });

        if (!gadget || gadget.status !== 'Available') {
            return null;
        }

        // Generate a self-destruct code that expires in 5 minutes
        const code = generateSelfDestructCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.selfDestructCode.create({
            data: {
                gadgetId,
                code,
                expiresAt,
            },
        });

        return { code, expiresAt };
    };

    executeSelfDestruct = async (gadgetId, code) => {
        // Check if the code is valid and not expired
        const selfDestructCode = await prisma.selfDestructCode.findFirst({
            where: {
                gadgetId,
                code,
                expiresAt: { gt: new Date() },
                used: false,
            },
        });

        if (!selfDestructCode) {
            return null;
        }

        // Mark the code as used
        await prisma.selfDestructCode.update({
            where: { id: selfDestructCode.id },
            data: { used: true },
        });

        // Mark the gadget as destroyed
        return prisma.gadget.update({
            where: { id: gadgetId },
            data: { status: 'Destroyed' },
        });
    };
}

module.exports = {
    gadgetService
};