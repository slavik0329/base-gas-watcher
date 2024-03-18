const { menubar } = require('menubar');




const mb = menubar({icon: './icon.png'});

mb.on('ready', () => {
	console.log('Menubar app is ready.');
	mb.tray.setTitle(' 0000.1 ETH')
});
