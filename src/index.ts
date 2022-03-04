import {Checker} from "./Checker";
import {importantTargets} from "./targets/importantTargets";
import {otherTargets} from "./targets/otherTargets";
import {FileGenerator} from "./FileGenerator";
import _ from "lodash";

// Configure .env variables
require('dotenv').config();

const uniqueTargets: string[] = _.uniq([...importantTargets, ...otherTargets]);

const checker = new Checker({
	targets: uniqueTargets,
});

async function printTargets() {
	console.log('Checking for importantTargets...');
	await checker.start();
	console.log('Done;');

	console.log('\nAlive: ');
	checker.getAlive().forEach(target => console.log(target))

	console.log('\nDying: ');
	checker.getDying().forEach(target => console.log(target))

	console.log('\nDead: ');
	checker.getDead().forEach(target => console.log(target))

	console.log('\nError: ');
	checker.getError().forEach(target => console.log(target));

	//Saving
	const gen = new FileGenerator({targets: importantTargets});
	gen.generateAndSave();

	// console.log('End: ', checker);
}


printTargets().then(() => {
	console.log('Printing finished;')
	console.log("----------------------------------------------------------")
});
