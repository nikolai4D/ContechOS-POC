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

