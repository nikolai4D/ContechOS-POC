export const ADD_TOKEN = (email, token) => {
    return `mutation {
          updateUsers(where: {email:"${email}"}, update: {token :"${token}"})
          {
            users 
            {
              email
              token
              name
            }
          }
        }
`
}

export const REMOVE_TOKEN = (token) => {
    return `mutation {
          updateUsers(where: {token:"${token}"}, update: {token : null})
          {
            users 
            {
              email
              name
            }
          }
        }
`
}

