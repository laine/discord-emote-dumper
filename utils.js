const fs = require("fs");
const request = require("request");

class utils {
	constructor(){};

	sanitize( string ) {
		const illegal_chars = [ '\\', '/', ':', '*', '?', '"', '<', '>', '|' ];

		for( let i = 0; i < string.length; i++ ) {
			if( illegal_chars.includes( string.charAt( i ) ) )
				string = string.replace( string.charAt( i ), '-' );
		}
		return string;
	}

	download( uri, filename, callback ) {
  		request.head( uri, function( err, res, body ){
    		request( uri ).pipe( fs.createWriteStream( filename ) ).on( 'close', callback );
  		});
  		return;
	};

	dump( client, inputID, _callback ) {
		const root = `./dumps`;
		let time = Date.now();
		let guild = client.guilds.find( guild => guild.id === inputID );
		let status = 0;

		if(!guild){
			console.log( "[!] something went wrong, please try again...");
			return _callback();
		}

		let emojis = guild.emojis.array();

		if( !fs.existsSync( root ) ) fs.mkdirSync( root );

		console.log( "[!] creating dump directory" );
		fs.mkdirSync( `${ root }/${ this.sanitize( guild.name ) }_dump_${ time }` );
		console.log( `[+] downloading ${ emojis.length } emojis.`);

		for( let i = 0; i < emojis.length; i++ ) {
			let name = emojis[ i ].identifier.split( ":" )[ 0 ];
			let ext = emojis[ i ].animated ? "gif" : "png";
			
			this.download( emojis[ i ].url, `${`${ root }/${ this.sanitize( guild.name ) }_dump_${ time }`}/${ name }.${ ext }`, () => {
				console.log( `[+] downloaded emoji: ${ name }`);
				++status;

				if( status >= emojis.length ) {
					status = 0;
					console.log( `[!] finished dumping guild: ${ inputID }!\n`);
					_callback();
				}
			} );
		}
	}
}

module.exports = utils;