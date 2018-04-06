export const register = (username, passwordHash) => true;
export const register = (username, passwordHash) => true;

export const login = (email, passwordHash) => {
    const queryEndpoint = `${BASE_URL + '/login?email=' + email + '?password=' + passwordHash}`;
    console.log('Fetching user data from Salesforce');
    console.log(queryEndpoint);
	
    try {
      const response = await fetch(queryEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data) {
      console.log('-User Query DATA Response-\n');
      console.log(data);
      return true;
    } else {
      console.log('-User Query NO DATA Response-\n');
      console.log('Check auth_token and API call.-\n');
      return false;
    }
  } catch (e) {
    console.log(e);
  }

};

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
  const password = 'jpmchase2'; //It seems we don't need to append the security token in this case...?

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

  // Auth token 3/31/17 - Seems like it changed..? TODO: Figure out how to make it more permanent.
  // 00D29000000DglJ!ARUAQNq4VA5wGgB3RONuLHpUqPV7MmcSBwOmLGWj3WZvYk3M4LdiYScaNF8gFQcqa71CXAYW5x3Slu6nzuB.wW1PGiAFwd0C
};
