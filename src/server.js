const Koa = require('koa');
const Router = require('koa-router');
const deviceManager = require('./device-manager');

const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();

app.use(deviceManager);

router.get('/on', async ctx => {
    try {
        await ctx.device.set({ set: true });
        ctx.body = { success: true, state: 'on' };
        console.log('ON:', ctx.query.deviceId);
    } catch (err) {
        ctx.body = { success: false };
        console.error('Error turning device on', err);
    }
});

router.get('/off', async ctx => {
    try {
        await ctx.device.set({ set: false });
        ctx.body = { success: true, state: 'off' };
        console.log('OFF:', ctx.query.deviceId);
    } catch (err) {
        ctx.body = { success: false };
        console.error('Error turning device off', err);
    }
});

router.get('/state', async ctx => {
    try {
        ctx.body = { success: true, state: await ctx.device.get() ? 'on' : 'off' };
    } catch (err) {
        ctx.body = { success: false };
        console.error('Error checking device state', err);
    }
})

app.use(router.routes());
app.use(router.allowedMethods())
app.listen(port);
console.log(`>>> Listening on ${port}`);
