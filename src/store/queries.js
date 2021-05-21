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

export const CONFIGS_NODES_RELS = (type, configType) => {
    return `{
    ${type} { 
          labels(label: "${configType}")
          title(label: "${configType}")
          id
          created
          updated
          key
          value
        }
      rels${configType}
      groups${configType}
  }`
}
