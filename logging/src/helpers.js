export function isError(objectToCheck) {
        return Object.prototype.toString.call(objectToCheck) === "[object Error]";
}