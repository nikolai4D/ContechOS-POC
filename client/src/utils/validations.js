let required = (propertyType) => {
return v => v && v.length > 0 || `Fyll i ${propertyType}`
}

let minLength = (propertyType, minLength) => {
    return v => v && v.length >= minLength || `${propertyType} måste vara minst ${minLength}`
}
let maxLength = (propertyType, maxLength) => {
    return v => v && v.length <= maxLength || `${propertyType} måste vara mindre än ${maxLength}`
}

let emailFormat = () => {
    let regex  = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return v => v && regex.test(v) || "Måste vara en epostadress";
}

export default {
    required,
    minLength,
    maxLength,
    emailFormat
}