var assert = require("assert"),
    fs = require('fs');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
            assert.equal(1, [1, 2, 3].indexOf(2));
        })
    })

    describe('#pop()', function() {
        it('should return 3', function() {
            assert.equal(3, [1, 2, 3].pop());
        })
    })
})


describe('File', function() {
    describe('#readFile()', function() {
        it('should read test.txt without error', function(done) {
            fs.readFile('test.txt', function(err) {
                if (err) throw err;
                done();
            });
        })

        it('should read test2.txt without error', function(done) {
            fs.readFile('test2.txt', function(err) {
                if (err) throw err;
                done();
            })
        })
    })
})

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {

        })
    })
});