
// src/utils/codeGenerator.js
const generateCodename = () => {
    const prefixes = ['The', 'Project', 'Operation', 'Agent', 'Prototype'];
    const nouns = [
        'Nightingale', 'Kraken', 'Shadow', 'Phoenix', 'Tempest',
        'Oracle', 'Specter', 'Titan', 'Vortex', 'Whisper',
        'Falcon', 'Mirage', 'Avalanche', 'Sentinel', 'Enigma'
    ];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${prefix} ${noun}`;
};

const generateSelfDestructCode = () => {
    // Generate a 6-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
};

const generateMissionSuccessProbability = () => {
    // Generate a random number between 30 and 98
    return Math.floor(Math.random() * (98 - 30 + 1)) + 30;
};

module.exports = {
    generateCodename,
    generateSelfDestructCode,
    generateMissionSuccessProbability
};