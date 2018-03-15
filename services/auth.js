export const register = (username, passwordHash) => true;

export const login = (username, passwordHash) => true;

export const logout = () => true;

export const loggedIn = () => false;

//TODO: Wire it up with saga.
//TODO: Add additional service types for other queries (data write, read)
export const getAuthToken = () => {
	//GRABBING AUTH TOKEN
	let auth_token = '';
	const grant_type = 'password';
	const client_id =
		'3MVG9Vik22TUgUphE4Ci7YrLJUWXWmDsMRbP_vZUSuotxwrxduN9uO46e6wPDw_vLHPdcQP2e3Hu6axkpM0fB';
	const client_secret = '150414908105213374';
	const username = 'edwardchen93@gmail.com';
	const password = 'jpmchase1'; //It seems we don't need to append the security token in this case...?

	const URL =
		'https://test.salesforce.com/services/oauth2/token?' +
		'grant_type=' +
		grant_type +
		'&client_id=' +
		client_id +
		'&client_secret=' +
		client_secret +
		'&username=' +
		username +
		'&password=' +
		password;
	fetch(URL, {
		method: 'POST',
		headers: {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
		.then(response => response.json())
		.then(responseJSON => {
			console.log('Auth token:' + responseJSON.access_token);
			auth_token = responseJSON.access_token;
			return auth_token;
		})
		.catch(error => {
			console.error(error);
			return '';
		});

	//This should return the auth token below (1 per app? user?):
	//00D29000000DglJ!ARUAQI5pKVmtu2S7PO0wTGSjfgv5CwrvOHnXn51aUs4zt_Ay0F25cYMA6xV5BS8xYJHq60Jir9T5eB85zGkMYe799gYncRNy
};
