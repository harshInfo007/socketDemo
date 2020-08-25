var expect = require('expect');
var {generateMessage} = require('./message');

describe('generate message', () => {
    it("should generate correct message object", () => {
        var from = "Harsh";
        var text = "Some Message";
        var message = generateMessage(
            from,
            text,
        )

        expect(typeof message.createdAt).toBe('number');
        expect(message).toHaveProperty("from" , from);
        expect(message).toHaveProperty("text" , text);
    });
})