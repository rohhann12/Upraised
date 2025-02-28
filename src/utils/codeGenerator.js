const generateCodename = () => {
    const prefixes = ['WOW', 'Project', 'hey', 'Agent', 'Prototype'];
    // couldn't thing of much so had gpt write these nouns lol
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
    const characters = 'RohanWillGetanInteviewCall';
    let code = '';

    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
};

const generateMissionSuccessProbability = () => {
    
    return Math.floor(Math.random() * (98 - 30 + 1)) + 30;
};

module.exports = {
    generateCodename,
    generateSelfDestructCode,
    generateMissionSuccessProbability
};