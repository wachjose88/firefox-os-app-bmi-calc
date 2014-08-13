
function debug(msg) {
    if ( window.console && window.console.log ) {
        console.log('DEBUG: ' + msg);
    }
}
function round2c(value) {
    return Math.round( value * 100 ) / 100;
}
