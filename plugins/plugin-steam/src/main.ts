import { PluginContext } from 'plugin-sdk';

export function activate(ctx: PluginContext) {
  ctx.log('Steam plugin activated!');
  ctx.registerCommand('', () => {
    ctx.showNotification('👋 Hello from the Hello World plugin!');
  });
}
