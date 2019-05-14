
function formatDate(date) {
    try {

        if (typeof date != "object") {
            throw TypeError("wrong type")
        }
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month === "NaN" || day === "NaN" || year === "NaN") {
            throw TypeError("invalid date")
        }
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    } catch(e) {
        if (e instanceof TypeError && e.message === "wrong type") {
            return false
        } if (e instanceof TypeError && e.message === "invalid date") {
            return false
        } else {
            return false
        }
    }
}



module.exports = {
    formatDate
}
