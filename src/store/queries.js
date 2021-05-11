export const USER = (email) => {
    return `{ 
	users(where: {email:"${email}"})
  {
	 password
	}
}`
}

export const USER_BY_TOKEN = (token) => {
    return `{ 
	users(where: {token:"${token}"})
  {
	 email
	}
}`
}

