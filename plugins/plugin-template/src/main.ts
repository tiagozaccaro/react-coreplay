import { PluginContext } from 'plugin-sdk';

export function activate(ctx: PluginContext) {
  ctx.log('Hello World plugin activated!');
  ctx.registerCommand('hello.sayHi', () => {
    ctx.showNotification('👋 Hello from the Hello World plugin!');
  });
}
