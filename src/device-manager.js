const Tuya = require('tuyapi');

const cache = new Map();

module.exports = async (ctx, next) => {
    const { deviceId, localKey } = ctx.query;
    ctx.device = cache.get(deviceId);
    if (ctx.device) return next();

    try {
        const device = new Tuya({ id: deviceId, key: localKey });
        await device.find();
        await device.connect();

        cache.set(deviceId, device);
        ctx.device = device;
        console.log('Connected device:', deviceId);

        device.on('disconnected', () => {
            console.log('Disconnected device:', deviceId);
            cache.delete(deviceId);
        });

        return next();
    } catch (err) {
        console.error('Error establishing device connection', err);
        cache.delete(deviceId);
        ctx.body = { success: false };
    }
}
