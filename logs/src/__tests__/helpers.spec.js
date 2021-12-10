import { isError } from "../helpers";

describe("Test for helpers", () => {
    it('test isError', () => {
        expect(isError(new Error())).toBeTruthy();
        expect(isError(new RangeError())).toBeTruthy();
        expect(isError(new SyntaxError())).toBeTruthy();
        expect(isError({})).toBeFalsy();
        expect(isError([])).toBeFalsy();
        expect(isError("ERROR!!")).toBeFalsy();
    })
})