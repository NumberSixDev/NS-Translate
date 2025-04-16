const PREFIX = "&c[&fNSTranslate&c]&r";
const VERSION = "1.0.1";
const GITHUB_REPO = "NumberSixDev/NS-Translate";
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

const LANGUAGE_PATTERNS = {
    "ru": /[А-Яа-яЁё]/g,
    "zh": /[\u4e00-\u9fff\u3400-\u4dbf]/g,
    "ja": /[\u3040-\u309f\u30a0-\u30ff]/g,
    "ko": /[\uac00-\ud7af\u1100-\u11ff]/g,
    "ar": /[\u0600-\u06ff]/g,
    "he": /[\u0590-\u05ff]/g,
    "th": /[\u0e00-\u0e7f]/g,
    "hi": /[\u0900-\u097f]/g,
    "bn": /[\u0980-\u09ff]/g,
    "el": /[\u0370-\u03ff\u1f00-\u1fff]/g,
    "uk": /[\u0404\u0406\u0407\u0454\u0456\u0457\u0490\u0491\u0404\u0406\u0407\u0454\u0456\u0457\u0490\u0491]/g,
    "es": /[áéíóúüñ¿¡]/gi,
    "fr": /[àâäæçéèêëîïôœùûüÿ]/gi,
    "de": /[äöüß]/gi,
    "it": /[àèéìíîòóùú]/gi,
    "pt": /[áàâãçéêíóôõúü]/gi,
    "tr": /[çğıöşü]/gi,
    "vi": /[ăâđêôơư]/gi,
    "pl": /[ąćęłńóśźż]/gi,
    "nl": /[áéíóúüëïöää]/gi,
    "sv": /[åäöé]/gi,
    "no": /[æøåéêèàë]/gi,
    "fi": /[äöéèüñ]/gi,
    "da": /[æøåéëêäàö]/gi,
    "id": /[éèá]/gi,
    "ms": /[éèá]/gi,
    "ro": /[ăâîșț]/gi,
    "hu": /[áéíóöőüű]/gi,
    "cs": /[áčďéěíňóřšťúůýž]/gi,
    "en": /\b(the|and|of|to|in|is|that|for|it|with|as|on|be|at|this|by)\b/gi
}

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
    },
    "ru_en": {
        "привет": "hello",
        "здравствуй": "hello",
        "здравствуйте": "hello (formal)",
        "пока": "bye",
        "до свидания": "goodbye",
        "да": "yes",
        "нет": "no",
        "спасибо": "thank you",
        "пожалуйста": "please/you're welcome",
        "извините": "sorry/excuse me",
        "доброе утро": "good morning",
        "добрый день": "good afternoon",
        "добрый вечер": "good evening",
        "спокойной ночи": "good night",
        "как дела": "how are you",
        "помогите": "help",
        "друг": "friend",
        "вода": "water",
        "еда": "food",
        "игрок": "player",
        "игра": "game",
        "меч": "sword",
        "броня": "armor",
        "алмаз": "diamond",
        "крипер": "creeper",
        "крафт": "craft",
        "добывать": "mine",
        "строить": "build",
        "мир": "world/peace"
    }
};

let config = {
    defaultFrom: "en",
    defaultTo: "es",
    showOriginal: true,
    lastUsed: {},
    offlineMode: false,
    autoTranslate: {
        enabled: false,
        targetLang: "en",
        threshold: 0.3,
        showInChat: true,
        excludeCommands: true
    },
    updateChecker: {
        enabled: true,
        autoCheck: true,
        lastCheckedTimestamp: 0,
        checkInterval: 43200000,
        lastVersion: VERSION
    }
};

function loadConfig() {
    try {
        if (FileLib.exists("NSTranslate", "config.json")) {
            const savedConfig = FileLib.read("NSTranslate", "config.json");
            if (savedConfig) {
                config = JSON.parse(savedConfig);
                
                if (!config.autoTranslate) {
                    config.autoTranslate = {
                        enabled: false,
                        targetLang: "en",
                        threshold: 0.3,
                        showInChat: true,
                        excludeCommands: true
                    };
                    saveConfig();
                }
                
                if (config.autoTranslate && config.autoTranslate.showInChat === undefined) {
                    config.autoTranslate.showInChat = true;
                    saveConfig();
                }

                if (!config.updateChecker) {
                    config.updateChecker = {
                        enabled: true,
                        autoCheck: true,
                        lastCheckedTimestamp: 0,
                        checkInterval: 43200000,
                        lastVersion: VERSION
                    };
                    saveConfig();
                }
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

function checkForUpdates(showNoUpdates = false) {
    if (!config.updateChecker.enabled) return;
    
    const currentTime = Date.now();
    
    if (!showNoUpdates && 
        config.updateChecker.lastCheckedTimestamp > 0 && 
        currentTime - config.updateChecker.lastCheckedTimestamp < config.updateChecker.checkInterval) {
        return;
    }
    
    config.updateChecker.lastCheckedTimestamp = currentTime;
    saveConfig();
    
    ChatLib.chat(`${PREFIX} &fChecking for updates...`);
    
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
    
    makeHttpRequest({
        url: apiUrl,
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "NSTranslate-Mod"
        }
    }, (error, responseCode, data) => {
        if (error) {
            ChatLib.chat(`${PREFIX} &cFailed to check for updates: ${error}`);
            return;
        }
        
        try {
            const releaseInfo = JSON.parse(data);
            const latestVersion = releaseInfo.tag_name.replace(/^v/i, "");
            
            config.updateChecker.latestVersion = latestVersion;
            saveConfig();
            
            if (compareVersions(latestVersion, VERSION) > 0) {
                ChatLib.chat(`${PREFIX} &aAn update is available!`);
                ChatLib.chat(`${PREFIX} &fCurrent version: &c${VERSION}`);
                ChatLib.chat(`${PREFIX} &fLatest version: &a${latestVersion}`);
                
                const downloadComponent = new TextComponent(`${PREFIX} &eClick here to view the release and download`)
                    .setHoverValue("&aClick to open in browser")
                    .setClick("open_url", releaseInfo.html_url);
                
                ChatLib.chat(downloadComponent);
            } else if (showNoUpdates) {
                ChatLib.chat(`${PREFIX} &aYou're using the latest version (${VERSION})!`);
            }
        } catch (e) {
            ChatLib.chat(`${PREFIX} &cError parsing update information: ${e.toString()}`);
        }
    });
}

function compareVersions(v1, v2) {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        
        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
    }
    
    return 0;
}

function init() {
    loadConfig();
    ChatLib.chat(`${PREFIX} &fLoaded! Use &c/translate &fto begin translating.`);
    ChatLib.chat(`${PREFIX} &fUse &c/translate help &ffor more information.`);
    ChatLib.chat(`${PREFIX} &fCreated & Updated by &cNumberSix/LabGeek`);
    ChatLib.chat(`${PREFIX} &fVersion: &c${VERSION}`);
    ChatLib.chat(new TextComponent(`${PREFIX} &fWe now have a discord! Click to join!`)
    .setHoverValue(`Click to join!`)
    .setClick("open_url", `https://discord.gg/BpVZDwnJUk`));
    if (config.autoTranslate.enabled) {
        ChatLib.chat(`${PREFIX} &aAutomatic chat translation is enabled. Use &c/translate auto toggle &ato disable.`);
    } else {
        ChatLib.chat(`${PREFIX} &fTry &c/translate auto toggle &fto enable automatic chat translation.`);
    }
    
    if (config.updateChecker.autoCheck) {
        setTimeout(() => {
            checkForUpdates();
        }, 3000);
    }
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

function detectLanguage(text) {
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            if (matches.length / text.length > 0.3) {
                return lang;
            }
        }
    }
    
    for (const dictKey of Object.keys(OFFLINE_DICTIONARY)) {
        if (dictKey.endsWith('_en')) {
            const sourceLang = dictKey.split('_')[0];
            const dict = OFFLINE_DICTIONARY[dictKey];
            
            const words = text.toLowerCase().split(/\s+/);
            const matches = words.filter(word => dict[word] !== undefined);
            
            if (matches.length > 0 && matches.length / words.length > 0.3) {
                return sourceLang;
            }
        }
    }
    
    return "en";
}

function translateOffline(from, to, text) {
    const lowerText = text.toLowerCase();
    const dictionaryKey = `${from}_${to}`;
    
    if (!OFFLINE_DICTIONARY[dictionaryKey]) {
        const reverseKey = `${to}_${from}`;
        if (!OFFLINE_DICTIONARY[reverseKey]) {
            return null;
        }
        
        const reverseDict = {};
        Object.entries(OFFLINE_DICTIONARY[reverseKey]).forEach(([key, value]) => {
            reverseDict[value.toLowerCase()] = key;
        });
        
        if (reverseDict[lowerText]) {
            return reverseDict[lowerText];
        }
        
        const words = lowerText.split(/\s+/);
        const translated = words.map(word => {
            return reverseDict[word] || word;
        });
        
        return translated.join(" ");
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

const translationCache = new Map();
let translationIdCounter = 0;

function createCopyableText(text, translatedText) {
    const translationId = translationIdCounter++;
    translationCache.set(translationId.toString(), translatedText);
    
    return new TextComponent(text)
        .setHoverValue("&eClick to copy")
        .setClick("run_command", `/nstranslatecopy ${translationId}`);
}

register("command", (idStr) => {
    try {
        const translatedText = translationCache.get(idStr);
        if (!translatedText) {
            ChatLib.chat(`${PREFIX} &cError: Translation not found in cache.`);
            return;
        }
        
        const clipboard = java.awt.Toolkit.getDefaultToolkit().getSystemClipboard();
        const stringSelection = new java.awt.datatransfer.StringSelection(translatedText);
        clipboard.setContents(stringSelection, null);
        ChatLib.chat(`${PREFIX} &aCopied to clipboard!`);
    } catch (e) {
        ChatLib.chat(`${PREFIX} &cFailed to copy: ${e.toString()}`);
    }
}).setName("nstranslatecopy");

function translateText(from, to, text, quiet = false) {
    config.lastUsed.from = from;
    config.lastUsed.to = to;
    saveConfig();
    
    if (config.offlineMode) {
        if (!quiet) ChatLib.chat(`${PREFIX} &fTranslating &f(${LANGUAGES[from] || from} → ${LANGUAGES[to] || to})`);
        const translatedText = translateOffline(from, to, text);
        
        if (translatedText) {
            if (config.showOriginal) {
                return {
                    success: true,
                    component: createCopyableText(`${PREFIX} &f${text} &8→ &f${translatedText} &f(offline)`, translatedText),
                    text: translatedText
                };
            } else {
                return {
                    success: true,
                    component: createCopyableText(`${PREFIX} &f${translatedText} &f(offline)`, translatedText),
                    text: translatedText
                };
            }
        } else {
            if (!quiet) ChatLib.chat(`${PREFIX} &cCouldn't translate text offline. Try with simpler phrases or common words.`);
            return { success: false };
        }
    }
    
    if (!quiet) ChatLib.chat(`${PREFIX} &cTranslating &f(${LANGUAGES[from] || from} → ${LANGUAGES[to] || to})`);
    tryTranslationAPI(0, from, to, text, quiet);
    
    return { 
        success: true, 
        pending: true,
        text: "Translation pending..." 
    };
}

function tryTranslationAPI(apiIndex, from, to, text, quiet = false) {
    if (apiIndex >= TRANSLATION_APIS.length) {
        if (!quiet) ChatLib.chat(`${PREFIX} &cAll translation APIs failed. Try &c/translate toggle offline&c.`);
        return;
    }
    
    const api = TRANSLATION_APIS[apiIndex];
    const requestConfig = api.makeRequest(from, to, text);
    
    makeHttpRequest(requestConfig, (error, responseCode, data) => {
        if (error) {
            if (!quiet) ChatLib.chat(`${PREFIX} &fAPI ${apiIndex + 1} (${api.name}) failed: ${error}`);
            tryTranslationAPI(apiIndex + 1, from, to, text, quiet);
            return;
        }
        
        try {
            const translatedText = api.parseResponse(data);
            
            if (config.showOriginal) {
                const component = createCopyableText(`${PREFIX} &c${text} &8→ &f${translatedText}`, translatedText);
                if (!quiet) ChatLib.chat(component);
                return component;
            } else {
                const component = createCopyableText(`${PREFIX} &f${translatedText}`, translatedText);
                if (!quiet) ChatLib.chat(component);
                return component;
            }
        } catch (e) {
            if (!quiet) ChatLib.chat(`${PREFIX} &fAPI ${apiIndex + 1} (${api.name}) error: ${e.message}`);
            tryTranslationAPI(apiIndex + 1, from, to, text, quiet);
        }
    });
}

function isHostReachable(hostname) {
    try {
        const address = java.net.InetAddress.getByName(hostname);
        return address.isReachable(3000);
    } catch (e) {
        return false;
    }
}

register("chat", (message, event) => {
    if (!config.autoTranslate.enabled) return;
    
    const rawMessage = ChatLib.removeFormatting(message);
    
    if (config.autoTranslate.excludeCommands && rawMessage.startsWith("/")) return;
    
    let content = rawMessage;
    const colonIndex = rawMessage.indexOf(": ");
    
    if (colonIndex !== -1) {
        content = rawMessage.substring(colonIndex + 2);
    }
    
    if (!content.trim()) return;
    
    const detectedLang = detectLanguage(content);
    
    if (detectedLang === config.autoTranslate.targetLang) return;
    
    let shouldTranslate = false;
    
    if (Object.keys(LANGUAGE_PATTERNS).includes(detectedLang)) {
        shouldTranslate = true;
    } 
    else if (detectedLang !== config.autoTranslate.targetLang) {
        if (config.autoTranslate.targetLang !== "en" && detectedLang === "en") {
            shouldTranslate = true;
        }
        else if (config.autoTranslate.targetLang === "en" && detectedLang !== "en") {
            shouldTranslate = true;
        }
    }
    
    if (shouldTranslate) {
        ChatLib.chat(`${PREFIX} &7Auto-translating from ${LANGUAGES[detectedLang] || detectedLang}...`);
        
        if (config.offlineMode) {
            const translatedText = translateOffline(detectedLang, config.autoTranslate.targetLang, content);
            
            if (translatedText && config.autoTranslate.showInChat) {
                const component = config.showOriginal 
                    ? createCopyableText(`${PREFIX} &f${content} &8→ &f${translatedText} &f(offline)`, translatedText)
                    : createCopyableText(`${PREFIX} &f${translatedText} &f(offline)`, translatedText);
                ChatLib.chat(component);
            } else if (!translatedText) {
                ChatLib.chat(`${PREFIX} &cCouldn't translate text offline. Try with simpler phrases.`);
            }
        } else {
            const api = TRANSLATION_APIS[0];
            const requestConfig = api.makeRequest(detectedLang, config.autoTranslate.targetLang, content);
            
            makeHttpRequest(requestConfig, (error, responseCode, data) => {
                if (error) {
                    if (TRANSLATION_APIS.length > 1) {
                        const nextApi = TRANSLATION_APIS[1];
                        const nextRequestConfig = nextApi.makeRequest(detectedLang, config.autoTranslate.targetLang, content);
                        
                        makeHttpRequest(nextRequestConfig, (error2, responseCode2, data2) => {
                            if (error2) {
                                ChatLib.chat(`${PREFIX} &cFailed to auto-translate. Check your connection.`);
                                return;
                            }
                            
                            try {
                                const translatedText = nextApi.parseResponse(data2);
                                if (config.autoTranslate.showInChat) {
                                    const component = config.showOriginal
                                        ? createCopyableText(`${PREFIX} &c${content} &8→ &f${translatedText}`, translatedText)
                                        : createCopyableText(`${PREFIX} &f${translatedText}`, translatedText);
                                    ChatLib.chat(component);
                                }
                            } catch (e) {
                                ChatLib.chat(`${PREFIX} &cAuto-translation failed: ${e.message}`);
                            }
                        });
                    } else {
                        ChatLib.chat(`${PREFIX} &cFailed to auto-translate. Check your connection.`);
                    }
                    return;
                }
                
                try {
                    const translatedText = api.parseResponse(data);
                    if (config.autoTranslate.showInChat) {
                        const component = config.showOriginal
                            ? createCopyableText(`${PREFIX} &c${content} &8→ &f${translatedText}`, translatedText)
                            : createCopyableText(`${PREFIX} &f${translatedText}`, translatedText);
                        ChatLib.chat(component);
                    }
                } catch (e) {
                    ChatLib.chat(`${PREFIX} &cAuto-translation failed: ${e.message}`);
                }
            });
        }
    }
}).setCriteria("${message}");

function showHelp() {
    ChatLib.chat(`\n${PREFIX} &fCommands:`);
    ChatLib.chat(`&c/translate <text> &f- Translate using default languages`);
    ChatLib.chat(`&c/translate <from> <to> <text> &f- Translate from one language to another`);
    ChatLib.chat(`&c/translate last <text> &f- Reuse last used languages`);
    ChatLib.chat(`&c/translate set default <from> <to> &f- Set default languages`);
    ChatLib.chat(`&c/translate toggle original &f- Toggle showing original text`);
    ChatLib.chat(`&c/translate toggle offline &f- Toggle offline/online mode`);
    ChatLib.chat(`&c/translate auto toggle &f- Toggle automatic chat translation`);
    ChatLib.chat(`&c/translate auto lang <code> &f- Set target language for auto-translation`);
    ChatLib.chat(`&c/translate update check &f- Check for updates`);
    ChatLib.chat(`&c/translate update toggle &f- Toggle automatic update checking`);
    ChatLib.chat(`&c/translate langs &f- Show available language codes`);
    ChatLib.chat(`&c/translate help &f- Show this help message\n`);
    ChatLib.chat(`&f(Pro tip: You can click on any translation to copy it to your clipboard!)`);
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

try {
    const githubUrl = new java.net.URL("https://api.github.com");
    const hostname = githubUrl.getHost();
    
    ChatLib.chat(`${PREFIX} &fTesting GitHub API connectivity for updates: ${hostname}...`);
    
    new Thread(() => {
        if (isHostReachable(hostname)) {
            ChatLib.chat(`${PREFIX} &fSuccess! GitHub API (${hostname}) is reachable.`);
        } else {
            ChatLib.chat(`${PREFIX} &cFailed! Cannot reach GitHub API (${hostname}).`);
            ChatLib.chat(`${PREFIX} &cUpdate checking may not work properly.`);
        }
    }).start();
} catch (e) {
    ChatLib.chat(`${PREFIX} &cError parsing URL for GitHub API: ${e.toString()}`);
}
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

if (args[0] === "auto" && args[1] === "toggle") {
    config.autoTranslate.enabled = !config.autoTranslate.enabled;
    ChatLib.chat(`${PREFIX} &fAutomatic chat translation: ${config.autoTranslate.enabled ? "&aEnabled" : "&cDisabled"}`);
    if (config.autoTranslate.enabled) {
        ChatLib.chat(`${PREFIX} &fTranslating to: &c${config.autoTranslate.targetLang} &f(${LANGUAGES[config.autoTranslate.targetLang] || config.autoTranslate.targetLang})`);
        ChatLib.chat(`${PREFIX} &fUse &c/translate auto lang <code> &fto change target language.`);
    }
    saveConfig();
    return;
}

if (args[0] === "auto" && args[1] === "lang" && args[2]) {
    const langCode = args[2].toLowerCase();
    if (!LANGUAGES[langCode]) {
        ChatLib.chat(`${PREFIX} &cUnknown language code. Use &c/translate langs &cto see available languages.`);
        return;
    }
    
    config.autoTranslate.targetLang = langCode;
    ChatLib.chat(`${PREFIX} &fSet auto-translation target language to: &c${langCode} &f(${LANGUAGES[langCode]})`);
    saveConfig();
    return;
}

if (args[0] === "update" && args[1] === "check") {
    checkForUpdates(true);
    return;
}

if (args[0] === "update" && args[1] === "toggle") {
    config.updateChecker.autoCheck = !config.updateChecker.autoCheck;
    ChatLib.chat(`${PREFIX} &fAutomatic update checking: ${config.updateChecker.autoCheck ? "&aEnabled" : "&cDisabled"}`);
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
    const result = translateText(config.lastUsed.from, config.lastUsed.to, text);
    if (result.success && !result.pending && result.component) {
        ChatLib.chat(result.component);
    }
    return;
}

if (args.length >= 1 && !LANGUAGES[args[0]] && args[0].length !== 2) {
    const text = args.join(" ");
    const result = translateText(config.defaultFrom, config.defaultTo, text);
    if (result.success && !result.pending && result.component) {
        ChatLib.chat(result.component);
    }
    return;
}

if (args.length >= 3) {
    const from = args[0];
    const to = args[1];
    const text = args.slice(2).join(" ");
    const result = translateText(from, to, text);
    if (result.success && !result.pending && result.component) {
        ChatLib.chat(result.component);
    }
    return;
}

ChatLib.chat(`${PREFIX} &cInvalid syntax. Use &c/translate help &cfor usage information.`);
}).setName("translate").setAliases(["tr", "tl"]);

init();