'use strict';

function isError(objectToCheck) {
        return Object.prototype.toString.call(objectToCheck) === "[object Error]";
}

module.exports = isError;