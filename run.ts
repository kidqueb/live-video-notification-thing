import child_process from 'child_process';
import fetch from 'node-fetch';

async function run() {
	// Auth
	const auth = await (async () => {
		const url = `https://id.twitch.tv/oauth2/token?${new URLSearchParams({
			client_id: process.env.TWITCH_CLIENT_ID || '',
			client_secret: process.env.TWITCH_SECRET || '',
			grant_type: 'client_credentials',
		})}`;
		const res = await fetch(url, {method: 'POST'});
		return res.json();
	})();

	// Me
	const data = await (async () => {
		const url = `https://api.twitch.tv/helix/search/channels?${new URLSearchParams(
			{
				query: 'kidqueb',
			}
		)}`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'client-id': process.env.TWITCH_CLIENT_ID || '',
				Authorization: `Bearer ${auth.access_token}`,
			},
		});
		return res.json();
	})();

	const me = data?.data?.find(
		(stream) => stream.display_name.toLowerCase() === 'kidqueb'
	);

	const props = JSON.stringify({title: me.title});

	child_process.exec(`yarn build --props='${props}'`);
}

run();
