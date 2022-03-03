import {Checker} from "./Checker";
import {targets} from "./targets";

const checker = new Checker({
	targets: targets,
});

async function printTargets() {
	console.log('Checking for targets...');
	await checker.start();
	console.log('Done;');

	console.log('\nAlive: ');
	checker.getAlive().forEach(target => console.log(target))

	console.log('\nDying: ');
	checker.getDying().forEach(target => console.log(target))

	console.log('\nDead: ');
	checker.getDead().forEach(target => console.log(target))

	console.log('\nError: ');
	checker.getError().forEach(target => console.log(target))

	// console.log('End: ', checker);
}


printTargets().then(() => console.log('Printing finished;'))
