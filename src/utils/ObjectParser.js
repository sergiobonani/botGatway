function findValueElement(object, key) {
    let value;

    Object.keys(object).some(function (k) {
        if (k === key) {
            if(object[k] instanceof Array) {
                value = object[k][0]
            } else {
                value = object[k];
            }
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findValueElement(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

module.exports = { findValueElement }