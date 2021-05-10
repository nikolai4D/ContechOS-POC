export const USER = (email) => {
    return `{ 
	users(where: {email:"${email}"})
  {
	 password
	}
}`
}

export const USER_TOKEN = (token) => {
    return `{ 
	users(where: {token:"${token}"})
  {
	 email
	}
}`
}

