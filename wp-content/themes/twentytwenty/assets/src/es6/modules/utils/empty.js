export default function empty (check_val) {
    "use strict";
    let undef;
    let key;
    let emptyValues = [
        undef,
        undefined,
        'undefined',
        null,
        false,
        0,
        '',
        '0'
    ];
    let len         = emptyValues.length;
    for (let i = 0; i < len; i += 1) {
        if (check_val === emptyValues[i]) {
            return true;
        }
    }
    if (typeof check_val === 'object') {
        for (key in check_val) {
            if (check_val.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    return false;
}
