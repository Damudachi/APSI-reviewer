// Module 4 - Activity 1 - Node basics: the HAUnted Sightings core module
//
// This is the pure logic at the heart of the HAUnted Sightings app. No server
// yet - just functions you can import and test. You will import these same
// helpers from your Express routes in later activities.
//
// Implement and EXPORT each function below. Research the concept named in each
// TODO; do not just copy an answer. Read backend-theory/02 for import/export.

// TODO: export a function `slugify(place)` that turns a place name into a URL-safe

// slug: lowercase, trim, and replace every run of non-alphanumeric characters
// with a single hyphen (no leading or trailing hyphen).
//   slugify('Old Gym')               -> 'old-gym'
//   slugify('  Library, 3rd Floor! ')-> 'library-3rd-floor'
// Hint: a regular expression with String.prototype.replace does this in two steps.

// TODO: export a function `spookinessLabel(level)` that maps a spookiness level
// (1..5) to a label, and returns 'Unknown' for anything else.
//   1 -> 'Barely a chill'   2 -> 'Goosebumps'   3 -> 'Spooky'
//   4 -> 'Terrifying'       5 -> 'Run!'

// TODO: export a function `isRecent(reportedAt, now = Date.now())` that returns
// true when `reportedAt` (an ISO date string) is within the last 7 days of `now`
// (and not in the future). Hint: new Date(...).getTime() and compare milliseconds.

// TODO: export a function `validateSighting(sighting)` that returns
// `{ valid, errors }` where `errors` is an array of strings:
//   - `place` must be a non-empty string
//   - `spookiness` must be an integer from 1 to 5
//   - `description`, if present, must be a string
// `valid` is true only when `errors` is empty.

export function slugify(place){
    return place.toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
}

export function spookinessLabel(level){
    if (level === 1){
        return('Barely a chill')
    }
    else if (level === 2){
        return('Goosebumps')
    }
    else if (level === 3){
        return('Spooky')
    }
    else if (level === 4){
        return('Terrifying')
    }
    else if (level === 5){
        return('Run!')
    }
    else{
       return('Unknown') 
    }
}

export function isRecent(reportedAt, now = Date.now()) {
    const reportTime = new Date(reportedAt).getTime();
    
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    const timeDiff = now - reportTime;
    
    return timeDiff >= 0 && timeDiff <= sevenDaysInMs;

    
}

export function validateSighting(sighting) {
    const errors = [];

    if (typeof sighting.place !== 'string' || sighting.place.trim() === '') {
        errors.push('place must be a non-empty string');
    }

    if (!Number.isInteger(sighting.spookiness) || sighting.spookiness < 1 || sighting.spookiness > 5) {
        errors.push('spookiness must be an integer from 1 to 5');
    }

    if (sighting.description !== undefined && typeof sighting.description !== 'string') {
        errors.push('description, if present, must be a string');
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}