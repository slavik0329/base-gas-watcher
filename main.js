const { menubar } = require('menubar');
const https = require('https');







const mb = menubar({icon: './icon.png'});

mb.on('ready', () => {
	console.log('Menubar app is ready.');




// Replace with your Geth node RPC URL
	const nodeUrl = 'https://mainnet.base.org';

// Prepare the JSON-RPC request payload to get the latest block
	const data = JSON.stringify({
		jsonrpc: '2.0',
		method: 'eth_getBlockByNumber',
		params: ['latest', false], // false indicates that we do not need detailed transaction info
		id: 1,
	});

	const options = {
		hostname: new URL(nodeUrl).hostname,
		port: new URL(nodeUrl).port,
		path: new URL(nodeUrl).pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length,
		},
	};

	const req = https.request(options, (res) => {
		let responseBody = '';

		res.on('data', (chunk) => {
			responseBody += chunk;
		});

		res.on('end', () => {
			try {
				const response = JSON.parse(responseBody);
				// Extract the base fee per gas from the latest block and convert from hex to Wei
				const baseFeePerGasWei = parseInt(response.result.baseFeePerGas, 16);
				// Convert Wei to Gwei for readability
				const baseFeePerGasGwei = baseFeePerGasWei / 1e9;
				console.log('Base Fee Per Gas:', baseFeePerGasGwei, 'Gwei');
				mb.tray.setTitle(` ${baseFeePerGasGwei.toPrecision(4)} gwei`)

			} catch (error) {
				console.error('Error parsing response:', error);
			}
		});
	});

	req.on('error', (error) => {
		console.error('Error making request:', error);
	});

	req.write(data);
	req.end();


});
