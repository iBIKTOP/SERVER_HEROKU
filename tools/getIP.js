module.exports = {
    getIP: function() {
        const os = require('os');
        const ifaces = os.networkInterfaces();
        const IP;
        
        Object.keys(ifaces).forEach((ifname) => {
            ifaces[ifname].forEach((iface) => {
                if (iface.family !== 'IPv4' || iface.internal !== false) return;
                else IP = iface.address;
            });
        });
        return IP;
    }
};