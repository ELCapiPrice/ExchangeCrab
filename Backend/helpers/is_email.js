
function isEmailAddress(str) {

    const pattern = "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$";    
    return str.match(pattern);    

}

module.exports= {
    isEmailAddress
}