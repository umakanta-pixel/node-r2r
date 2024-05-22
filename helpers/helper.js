const { default: axios } = require("axios");
const fs = require('fs');
const crypto = require("crypto");

exports.directionApiCall = async (params) => {
    try {
        var direction_url = 'https://maps.googleapis.com/maps/api/directions/json?'
            + 'origin=' + encodeURIComponent(params.start_point)
            + '&destination=' + encodeURIComponent(params.end_point)
            + '&mode=' + encodeURIComponent(params.mode)
            + '&key=' + process.env.GOOGLE_MAPS_API_KEY;
        direction_url += (params.mode == 'transit') ? '&transit_mode=train&alternatives=true' : '&transit_mode=driving';
        direction_url += (params.departure) ? '&departure_time=' + (Date.parse(params.departure + '.000Z') / 1000) : '&arrival_time=' + (Date.parse(params.arrival + '.000Z') / 1000);
        const result = await axios.get(direction_url);
        // console.log(direction_url);
        return result.data;
    } catch (error) {
        // this.logErrorToFile(error);
        return [];
    }
}

exports.logErrorToFile = (error) => {
    const logMessage = `${new Date().toISOString()}- ${error.response.data} - ${error.stack.split('\n')}\n`;
    // const logMessage = `${new Date().toISOString()} - ${error.stack}\n`;

    fs.appendFile('error.log', logMessage, (err) => {
        if (err) {
            console.error('Error writing to error.log:', err);
        }
    });
}

function genUuid() {
    function getRandom16Bit() {
        return Math.floor(Math.random() * 0x10000); // Generates a random number between 0 and 65535
    }

    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        getRandom16Bit(), // 32 bits for "time_low"
        getRandom16Bit(),
        getRandom16Bit(), // 16 bits for "time_mid"
        (getRandom16Bit() & 0x0fff) | 0x4000, // 16 bits for "time_hi_and_version" with version 4
        (getRandom16Bit() & 0x3fff) | 0x8000, // 16 bits for "clk_seq_hi_res" with DCE 1.1 variant
        getRandom16Bit(), // 48 bits for "node"
        getRandom16Bit(),
        getRandom16Bit()
    );
}

function sprintf(format, ...args) {
    let i = 0;
    return format.replace(/%([0-9]*)([a-z])/gi, (match, width, type) => {
        let value = args[i++];

        if (type === 'x') {
            // Convert to hexadecimal
            let hexValue = value.toString(16);
            if (width) {
                // Add leading zeroes to meet width requirement
                while (hexValue.length < parseInt(width, 10)) {
                    hexValue = '0' + hexValue;
                }
            }
            return hexValue;
        }

        return value; // If not hexadecimal, return value as is
    });
}

exports.getAmadeusheader = () => {

    const password = "ZiVk5J@KxUgX";
    const wsap = "1ASIWAMAAGNU";
    const userId = "WSAGNAMA";
    const offerId = "LONU125AO";
    const dutyCode = "SU";
    const organisations = "NMC-UK"
    const generator = generatePassword(8, 'luds');
    const buffer = Buffer.from(generator, 'utf-8');
    // Encode the buffer to a Base64 string
    const encodedNonce = buffer.toString('base64');
    const messageID = genUuid();
    const timestamp = getTimestamp();
    const passSHA = customHashBase64(generator, timestamp, password);
    const result = {
        'messageID': messageID,
        'timestamp': timestamp,
        'encodedNonce': encodedNonce,
        'passSHA': passSHA,
        'organisations': organisations,
        'wsap': wsap,
        'userId': userId,
        'password': password,
        'offerId': offerId,
        'dutyCode': dutyCode,
    }
    return result;
}


// Utility function to generate a random password
function generatePassword(length = 8, availableSets = 'luds') {
    const sets = [];

    if (availableSets.includes('l')) {
        sets.push('abcdefghjkmnpqrstuvwxyz'); // Lowercase letters without "i", "o"
    }

    if (availableSets.includes('u')) {
        sets.push('ABCDEFGHJKMNPQRSTUVWXYZ'); // Uppercase letters without "I", "O"
    }

    if (availableSets.includes('d')) {
        sets.push('23456789'); // Digits without "0", "1"
    }

    if (availableSets.includes('s')) {
        sets.push('@#$%^&*()-_=+?/'); // Special characters
    }

    let all = sets.join(''); // All characters from available sets
    let password = '';

    // Ensure at least one character from each set is in the password
    sets.forEach(set => {
        const randomChar = set[Math.floor(Math.random() * set.length)];
        password += randomChar;
    });

    all = all.split(''); // Split all characters into an array

    // Fill the rest of the password with random characters
    const remainingLength = length - sets.length;
    for (let i = 0; i < remainingLength; i++) {
        const randomChar = all[Math.floor(Math.random() * all.length)];
        password += randomChar;
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}

// Function to generate a SHA-1 hash with optional raw output (binary)
function sha1(data, rawOutput = false) {
    const hash = crypto.createHash('sha1'); // Create a SHA-1 hash instance
    hash.update(data); // Add the data to be hashed
    return rawOutput ? hash.digest() : hash.digest('hex'); // Output as binary or hex
}

// Function to replicate the PHP behavior
function customHashBase64(str1, str2, str3) {
    // SHA-1 with raw output (binary)
    const sha1Str3 = sha1(str3, true);

    // Concatenate strings
    const concatenated = str1 + str2 + sha1Str3.toString('binary');

    // Get SHA-1 of concatenated string with raw output
    const sha1Result = sha1(concatenated, true);

    // Base64 encode the result
    const base64Result = sha1Result.toString('base64');

    return base64Result;
}

function getTimestamp() {
         const now = new Date();

        // Format the date as YYYY-MM-DD
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(now.getDate()).padStart(2, '0');

        // Format the time as HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
        return timestamp;
}
