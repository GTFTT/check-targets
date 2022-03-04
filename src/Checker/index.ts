import axios from "axios";
import {ALIVE_MAX_TIME, DYING_MAX_TIME, TARGET_STATUSES} from "../globals";

/**
 * Used to check importantTargets.
 * Remember that you need to call start and after was done you can use results.
 * Remember that axios requires http:// before URL else it returns `econnrefused` error
 */
export class Checker {
	private targets: string[] = [];

	private dead: string[] = [];
	private alive: string[] = [];
	private dying: string[] = [];
	private error: string[] = [];
	private proxy = {
		ip: "23.108.47.124:80",
		auth: "ocelot:oempg4uvlf"
	};

	constructor(options: {
		targets: string[]
	}) {
		this.targets = options.targets;
	}

	/**
	 * Alive importantTargets should be attacked
	 */
	public getAlive() {
		return this.alive;
	}

	/**
	 * Dying importantTargets are not putted down completely, but it can be fixed
	 */
	public getDying() {
		return this.dying;
	}

	/**
	 * Dead can be ignored for now, because server is not responsive(at list from current IP address)
	 */
	public getDead() {
		return this.dead;
	}

	/**
	 * Something gone wrong
	 */
	public getError() {
		return this.error;
	}

	/**
	 * Start checking all sites
	 */
	public async start() {
		const promises: Promise<TARGET_STATUSES>[] = [];

		this.targets.forEach(target => {
			const promise = this.checkTarget(target);
			promise.then(status => {
				switch (status) {
					case TARGET_STATUSES.ALIVE:
						this.alive.push(target);
						break;
					case TARGET_STATUSES.DEAD:
						this.dead.push(target)
						break;
					case TARGET_STATUSES.DYING:
						this.dying.push(target)
						break;
					case TARGET_STATUSES.ERROR:
						this.error.push(target)
						break;
				}
			}).catch(e => {
				console.log('Request failed for target: ', target)
			});

			promises.push(promise);
		});

		await Promise.all(promises);
	}

	private async checkTarget(url: string): Promise<TARGET_STATUSES> {
		const startTime = (new Date()).valueOf();
		let resultStatus = TARGET_STATUSES.ERROR;

		const proxyAddressSplit = this.proxy.ip.split(':')
		const proxyIP = proxyAddressSplit[0]
		const proxyPort = parseInt(proxyAddressSplit[1])
		const proxyAuthSplit = this.proxy.auth.split(':')
		const proxyUsername = proxyAuthSplit[0]
		const proxyPassword = proxyAuthSplit[1]

		const request = axios({
			url,
			method: "get",
			timeout: 10000,
			validateStatus: () => true,
			proxy: {
				host: proxyIP,
				port: proxyPort,
				auth: {
					username: proxyUsername,
					password: proxyPassword
				}
			}
		});

		try{
			const response = await request;
			const endTime = (new Date()).valueOf();
			const requestTime = endTime - startTime;
			let requestStatus;

			if(requestTime <= ALIVE_MAX_TIME)
				requestStatus = TARGET_STATUSES.ALIVE
			else if(requestTime <= DYING_MAX_TIME)
				requestStatus = TARGET_STATUSES.DYING;
			else
				requestStatus = TARGET_STATUSES.DEAD;

			console.log(`${response.status} | ${requestTime} ms | ${requestStatus} | ${url}`);
			resultStatus = requestStatus;
		} catch (e: any) {
			console.log(`ERR | ${e.code} | ${url}`);
			resultStatus = TARGET_STATUSES.ERROR;
		}

		return resultStatus;
	}
}
