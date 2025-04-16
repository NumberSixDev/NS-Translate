const PREFIX = "&c[&fNSTranslate&c]&r";
const LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "zh": "Chinese",
    "ko": "Korean",
    "ar": "Arabic",
    "hi": "Hindi",
    "bn": "Bengali",
    "tr": "Turkish",
    "vi": "Vietnamese",
    "pl": "Polish",
    "uk": "Ukrainian",
    "nl": "Dutch",
    "sv": "Swedish",
    "no": "Norwegian",
    "fi": "Finnish",
    "da": "Danish",
    "he": "Hebrew",
    "th": "Thai",
    "id": "Indonesian",
    "ms": "Malay",
    "ro": "Romanian",
    "hu": "Hungarian",
    "cs": "Czech",
    "el": "Greek"
};

const OFFLINE_DICTIONARY = {
    "en_es": {
        "hello": "hola",
        "goodbye": "adiós",
        "yes": "sí",
        "no": "no",
        "thank you": "gracias",
        "please": "por favor",
        "sorry": "lo siento",
        "good morning": "buenos días",
        "good afternoon": "buenas tardes",
        "good night": "buenas noches",
        "how are you": "cómo estás",
        "help": "ayuda",
        "friend": "amigo",
        "water": "agua",
        "food": "comida",
        "player": "jugador",
        "game": "juego",
        "sword": "espada",
        "armor": "armadura",
        "diamond": "diamante",
        "creeper": "creeper",
        "craft": "crear",
        "mine": "minar",
        "build": "construir"
    },
    "es_en": {
        "hola": "hello",
        "adiós": "goodbye",
        "sí": "yes",
        "no": "no",
        "gracias": "thank you",
        "por favor": "please",
        "lo siento": "sorry",
        "buenos días": "good morning",
        "buenas tardes": "good afternoon",
        "buenas noches": "good night",
        "cómo estás": "how are you",
        "ayuda": "help",
        "amigo": "friend",
        "agua": "water",
        "comida": "food",
        "jugador": "player",
        "juego": "game",
        "espada": "sword",
        "armadura": "armor",
        "diamante": "diamond",
        "creeper": "creeper",
        "crear": "craft",
        "minar": "mine",
        "construir": "build"
    }
};

let config = {
    defaultFrom: "en",
    defaultTo: "es",
    showOriginal: true,
    lastUsed: {},
    offlineMode: false
};

function loadConfig() {
    try {
        if (FileLib.exists("NSTranslate", "config.json")) {
            const savedConfig = FileLib.read("NSTranslate", "config.json");
            if (savedConfig) {
                config = JSON.parse(savedConfig);
            }
        } else {
            FileLib.mkdir("NSTranslate");
            saveConfig();
        }
    } catch (e) {
        ChatLib.chat(`${PREFIX} &cFailed to load config: ${e}`);
    }
}

function saveConfig() {
    try {
        FileLib.write("NSTranslate", "config.json", JSON.stringify(config, null, 2));
    } catch (e) {
        ChatLib.chat(`${PREFIX} &cFailed to save config: ${e}`);
    }
}

function init() {
    loadConfig();
    ChatLib.chat(`${PREFIX} &fLoaded! Use &c/translate &fto begin translating.`);
    ChatLib.chat(`${PREFIX} &fUse &c/translate help &ffor more information.`);
    ChatLib.chat(`${PREFIX} &fCreated & Updated by &cNumberSix/LabGeek`);
}

const TRANSLATION_APIS = [
    {
        name: "MyMemory",
        url: "https://api.mymemory.translated.net/get",
        makeRequest: function(from, to, text) {
            return {
                url: `${this.url}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            };
        },
        parseResponse: function(data) {
            const json = JSON.parse(data);
            if (json.responseData && json.responseData.translatedText) {
                return json.responseData.translatedText;
            }
            throw new Error(json.responseDetails || "Unknown error");
        }
    },
    {
        name: "FunTranslations",
        url: "https://api.funtranslations.com/translate/default",
        makeRequest: function(from, to, text) {
            return {
                url: `${this.url}?text=${encodeURIComponent(text)}`,
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            };
        },
        parseResponse: function(data) {
            const json = JSON.parse(data);
            if (json.contents && json.contents.translated) {
                return json.contents.translated;
            }
            throw new Error(json.error?.message || "Unknown error");
        }
    }
];

function translateOffline(from, to, text) {
    const lowerText = text.toLowerCase();
    const dictionaryKey = `${from}_${to}`;
    
    if (!OFFLINE_DICTIONARY[dictionaryKey]) {
        ChatLib.chat(`${PREFIX} &cOffline translation not available for ${from} to ${to}`);
        ChatLib.chat(`${PREFIX} &cAvailable offline pairs: ${Object.keys(OFFLINE_DICTIONARY).join(", ")}`);
        return null;
    }
    
    if (OFFLINE_DICTIONARY[dictionaryKey][lowerText]) {
        return OFFLINE_DICTIONARY[dictionaryKey][lowerText];
    }
    
    const words = lowerText.split(/\s+/);
    const translated = words.map(word => {
        return OFFLINE_DICTIONARY[dictionaryKey][word] || word;
    });
    
    return translated.join(" ");
}

function makeHttpRequest(requestConfig, callback) {
    new Thread(() => {
        try {
            const url = new java.net.URL(requestConfig.url);
            const connection = url.openConnection();
            connection.setRequestMethod(requestConfig.method || "GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            if (requestConfig.headers) {
                Object.entries(requestConfig.headers).forEach(([key, value]) => {
                    connection.setRequestProperty(key, value);
                });
            }
            
            const responseCode = connection.getResponseCode();
            let inputStream;
            
            if (responseCode >= 200 && responseCode < 300) {
                inputStream = connection.getInputStream();
            } else {
                inputStream = connection.getErrorStream();
            }
            
            const reader = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
            let line;
            const response = new java.lang.StringBuilder();
            
            while ((line = reader.readLine()) !== null) {
                response.append(line);
            }
            reader.close();
            
            if (responseCode >= 200 && responseCode < 300) {
                callback(null, responseCode, response.toString());
            } else {
                callback(`HTTP Error: ${responseCode}`, responseCode, response.toString());
            }
            
        } catch (e) {
            callback(`Network error: ${e.toString()}`, null, null);
        }
    }).start();
}

function translateText(from, to, text) {
    config.lastUsed.from = from;
    config.lastUsed.to = to;
    saveConfig();
    
    if (config.offlineMode) {
        ChatLib.chat(`${PREFIX} &fTranslating &f(${LANGUAGES[from] || from} → ${LANGUAGES[to] || to})`);
        const translatedText = translateOffline(from, to, text);
        
        if (translatedText) {
            if (config.showOriginal) {
                ChatLib.chat(`${PREFIX} &f${text} &8→ &f${translatedText} &f(offline)`);
            } else {
                ChatLib.chat(`${PREFIX} &f${translatedText} &f(offline)`);
            }
        } else {
            ChatLib.chat(`${PREFIX} &cCouldn't translate text offline. Try with simpler phrases or common words.`);
        }
        return;
    }
    
    ChatLib.chat(`${PREFIX} &cTranslating &f(${LANGUAGES[from] || from} → ${LANGUAGES[to] || to})`);
    tryTranslationAPI(0, from, to, text);
}

function tryTranslationAPI(apiIndex, from, to, text) {
    if (apiIndex >= TRANSLATION_APIS.length) {
        ChatLib.chat(`${PREFIX} &cAll translation APIs failed. Try &c/translate toggle offline&c.`);
        return;
    }
    
    const api = TRANSLATION_APIS[apiIndex];
    const requestConfig = api.makeRequest(from, to, text);
    
    makeHttpRequest(requestConfig, (error, responseCode, data) => {
        if (error) {
            ChatLib.chat(`${PREFIX} &fAPI ${apiIndex + 1} (${api.name}) failed: ${error}`);
            tryTranslationAPI(apiIndex + 1, from, to, text);
            return;
        }
        
        try {
            const translatedText = api.parseResponse(data);
            
            if (config.showOriginal) {
                ChatLib.chat(`${PREFIX} &c${text} &8→ &f${translatedText}`);
            } else {
                ChatLib.chat(`${PREFIX} &f${translatedText}`);
            }
        } catch (e) {
            ChatLib.chat(`${PREFIX} &fAPI ${apiIndex + 1} (${api.name}) error: ${e.message}`);
            tryTranslationAPI(apiIndex + 1, from, to, text);
        }
    });
}

function showHelp() {
    ChatLib.chat(`\n${PREFIX} &fCommands:`);
    ChatLib.chat(`&c/translate <text> &f- Translate using default languages`);
    ChatLib.chat(`&c/translate <from> <to> <text> &f- Translate from one language to another`);
    ChatLib.chat(`&c/translate last <text> &f- Reuse last used languages`);
    ChatLib.chat(`&c/translate set default <from> <to> &f- Set default languages`);
    ChatLib.chat(`&c/translate toggle original &f- Toggle showing original text`);
    ChatLib.chat(`&c/translate toggle offline &f- Toggle offline/online mode`);
    ChatLib.chat(`&c/translate langs &f- Show available language codes`);
    ChatLib.chat(`&c/translate help &f- Show this help message\n`);
}

function showLanguages() {
    ChatLib.chat(`\n${PREFIX} &fAvailable language codes:`);
    Object.entries(LANGUAGES).forEach(([code, name]) => {
        ChatLib.chat(`&c${code} &f- ${name}`);
    });
    
    if (config.offlineMode) {
        ChatLib.chat(`\n${PREFIX} &fAvailable offline translation pairs:`);
        Object.keys(OFFLINE_DICTIONARY).forEach(pair => {
            const [from, to] = pair.split("_");
            ChatLib.chat(`&c${from} &fto &c${to} &f- ${Object.keys(OFFLINE_DICTIONARY[pair]).length} phrases`);
        });
    }
    
    ChatLib.chat("");
}

function testConnectivity() {
    ChatLib.chat(`${PREFIX} &fTesting connectivity to translation services...`);
    
    try {
        const googleAddr = java.net.InetAddress.getByName("www.google.com");
        ChatLib.chat(`${PREFIX} &fBasic internet connectivity: ${googleAddr.isReachable(3000) ? "&fOK" : "&cFAILED"}`);
    } catch (e) {
        ChatLib.chat(`${PREFIX} &cBasic internet connectivity test failed. Check your connection.`);
    }
    
    TRANSLATION_APIS.forEach((api, index) => {
        try {
            const url = new java.net.URL(api.url);
            const hostname = url.getHost();
            
            ChatLib.chat(`${PREFIX} &fTesting API ${index + 1} (${api.name}): ${hostname}...`);
            
            new Thread(() => {
                if (isHostReachable(hostname)) {
                    ChatLib.chat(`${PREFIX} &fSuccess! ${api.name} (${hostname}) is reachable.`);
                } else {
                    ChatLib.chat(`${PREFIX} &cFailed! Cannot reach ${api.name} (${hostname}).`);
                    ChatLib.chat(`${PREFIX} &cTry using offline mode with &c/translate toggle offline`);
                }
            }).start();
        } catch (e) {
            ChatLib.chat(`${PREFIX} &cError parsing URL for ${api.name}: ${e.toString()}`);
        }
    });
}

register("command", (...args) => {
    if (args.length === 0 || args[0] === "help") {
        showHelp();
        return;
    }
    
    if (args[0] === "langs") {
        showLanguages();
        return;
    }
    
    if (args[0] === "toggle" && args[1] === "original") {
        config.showOriginal = !config.showOriginal;
        ChatLib.chat(`${PREFIX} ${config.showOriginal ? "&fShowing" : "&cHiding"} original text.`);
        saveConfig();
        return;
    }
    
    if (args[0] === "toggle" && args[1] === "offline") {
        config.offlineMode = !config.offlineMode;
        ChatLib.chat(`${PREFIX} ${config.offlineMode ? "&cOffline" : "&fOnline"} mode enabled.`);
        if (config.offlineMode) {
            ChatLib.chat(`${PREFIX} &fNote: Offline mode has limited vocabulary.`);
        }
        saveConfig();
        return;
    }
    
    if (args[0] === "set" && args[1] === "default" && args[2] && args[3]) {
        config.defaultFrom = args[2];
        config.defaultTo = args[3];
        ChatLib.chat(`${PREFIX} &fDefault languages set to: &c${args[2]} &f→ &c${args[3]}`);
        saveConfig();
        return;
    }
    
    if (args[0] === "last" && args.length > 1) {
        if (!config.lastUsed.from || !config.lastUsed.to) {
            ChatLib.chat(`${PREFIX} &cNo previous translation found. Please use full syntax.`);
            return;
        }
        const text = args.slice(1).join(" ");
        translateText(config.lastUsed.from, config.lastUsed.to, text);
        return;
    }
    
    if (args.length >= 1 && !LANGUAGES[args[0]] && args[0].length !== 2) {
        const text = args.join(" ");
        translateText(config.defaultFrom, config.defaultTo, text);
        return;
    }
    
    if (args.length >= 3) {
        const from = args[0];
        const to = args[1];
        const text = args.slice(2).join(" ");
        translateText(from, to, text);
        return;
    }
    
    ChatLib.chat(`${PREFIX} &cInvalid syntax. Use &c/translate help &cfor usage information.`);
}).setName("translate").setAliases(["tr", "tl"]);

init();