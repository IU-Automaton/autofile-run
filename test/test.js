'use strict';

var expect    = require('expect.js'),
    path      = require('path'),
    fs        = require('fs'),
    rimraf    = require('rimraf'),
    isDir     = require('./util/is-dir'),
    automaton = require('automaton').create()
;

describe('run', function () {
    var target = path.normalize(__dirname + '/tmp/');

    function clean(done) {
        rimraf(target, done);
    }

    beforeEach(function (done) {
        clean(function (err) {
            if (err) {
                throw err;
            }

            fs.mkdirSync(target);
            done();
        });
    });
    after(clean);

    it('should run command', function (done) {
        var folder = 'foo';

        automaton.run('run', {
            cmd: 'mkdir ' + path.join(target, folder)
        }, function (err) {
            if (err) {
                throw err;
            }

            expect(isDir(target + folder)).to.be(true);
            done();
        });
    });

    it('should run command in a different cwd', function (done) {
        var folder = 'run';

        automaton.run('run', {
            cmd: 'mkdir  ' + folder,
            cwd: target
        }, function (err) {
            if (err) {
                throw err;
            }

            expect(isDir(target + folder)).to.be(true);
            done();
        });
    });
});