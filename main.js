const Discord = require("discord.js-selfbot-v11");
const fs = require('fs');
const rl = require("readline-sync");
const request = require("request");
const client = new Discord.Client();
const helper = require("./utils.js");
const util = new helper();

function main(client){
	console.log(`[+] enter the server id you want to dump`);
	let input = rl.prompt();

	if( input == "0" ) {
		return process.exit();
	}
	try {
		util.dump( client, input, () => {
			main( client );
		} );
	}
	catch( err ) {
		console.error( err );
		console.log(`[!] fatal error occurred\n`);
		main( client );
	}
	return;
}

function init(client){
	process.title = 'made by github.com/laine';

	if(!fs.existsSync("./settings.json")){
		console.log(`[!] no settings.json file exists on disk, enter ur token\n`);
		let token = rl.prompt();

		let json = {
			"client": {
				"token": `${ token }`
			}
		}

		fs.appendFile( "./settings.json", JSON.stringify( json, null, "\t" ), ( err ) => {
			if( err )
				console.error( err );

			console.log(`[+] successfully saved`);

			let data = JSON.parse( fs.readFileSync( "./settings.json", { encoding: "utf8" } ) );
			client.login( data.client.token );
		});

		return;
	}

	let data = JSON.parse( fs.readFileSync( "./settings.json", {encoding: "utf8"} ) );
	client.login( data.client.token );
}

init( client );

client.on( 'ready', () => {
	console.log(`[~] hello ${client.user.username}!\n`);
	main( client );
} );