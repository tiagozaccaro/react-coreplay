import ivm from 'isolated-vm'
import fs from 'fs'
import path from 'path'
import chokidar, { FSWatcher } from 'chokidar'
import { app, Notification } from 'electron'
import AdmZip from 'adm-zip'
import { getSettings, saveSettings } from './settings'

const pluginsDir = path.resolve(app.getAppPath(), '../build/plugins')

const pluginWatchers = new Map<string, FSWatcher>()
const pluginIsolates = new Map<string, ivm.Isolate>()

async function unloadPlugin(pluginId: string): Promise<void> {
  const watcher = pluginWatchers.get(pluginId)
  if (watcher) {
    await watcher.close()
    pluginWatchers.delete(pluginId)
  }
  const isolate = pluginIsolates.get(pluginId)
  if (isolate) {
    isolate.dispose()
    pluginIsolates.delete(pluginId)
  }
  console.log(`🛑 Unloaded plugin: ${pluginId}`)
}

export async function loadPluginIsolated(
  pluginId: string,
  settings: Record<string, unknown>
): Promise<void> {
  await unloadPlugin(pluginId)

  const pluginPath = path.join(pluginsDir, pluginId)
  const pkgPath = path.join(pluginPath, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.warn(`⚠️ Plugin package.json missing for ${pluginId}`)
    return
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  const entryPath = path.join(pluginPath, pkg.main || 'dist/main.js')
  if (!fs.existsSync(entryPath)) {
    console.warn(`⚠️ Plugin entry file missing for ${pluginId}`)
    return
  }

  const code = fs.readFileSync(entryPath, 'utf-8')

  const isolate = new ivm.Isolate({ memoryLimit: 64 })
  pluginIsolates.set(pluginId, isolate)

  const context = await isolate.createContext()
  const jail = context.global
  await jail.set('global', jail.derefInto())

  // Deep clone plugin settings to avoid direct mutation
  const pluginSettings = JSON.parse(JSON.stringify(settings[pluginId] || {}))

  const pluginContext = {
    pluginId,
    log: (...args: unknown[]) => console.log(`[PLUGIN:${pluginId}]`, ...args),
    showNotification: (msg: string) =>
      new Notification({ title: `Plugin: ${pluginId}`, body: msg }).show(),
    settings: pluginSettings,
    saveSettings: (newSettings: unknown) => {
      settings[pluginId] = newSettings
      saveSettings(settings)
    }
  }

  await jail.set('pluginContext', {
    pluginId,
    log: new ivm.Reference(pluginContext.log),
    showNotification: new ivm.Reference(pluginContext.showNotification),
    settings: pluginContext.settings,
    saveSettings: new ivm.Reference(pluginContext.saveSettings)
  })

  try {
    await context.eval(code, { timeout: 1000 })

    const activateFn = await jail.get('activate', { reference: true })
    if (activateFn) {
      await activateFn.apply(undefined, [pluginContext], { timeout: 500 })
      console.log(`✅ Activated plugin: ${pluginId}`)
    } else {
      console.warn(`⚠️ No activate function exported by plugin ${pluginId}`)
    }

    const watcher = chokidar.watch(entryPath, { ignoreInitial: true })
    watcher.on('change', () => {
      console.log(`♻️ Reloading plugin: ${pluginId}`)
      loadPluginIsolated(pluginId, settings)
    })
    pluginWatchers.set(pluginId, watcher)
  } catch (err) {
    console.error(`❌ Error loading plugin "${pluginId}":`, err)
    await unloadPlugin(pluginId)
  }
}

export function installPlugin(cpxPath: string): string | null {
  try {
    const zip = new AdmZip(cpxPath)
    const pluginId = path.basename(cpxPath, '.cpx')
    const targetPath = path.join(pluginsDir, pluginId)

    if (fs.existsSync(targetPath)) {
      console.warn(`⚠️ Plugin "${pluginId}" already installed.`)
      return null
    }

    zip.extractAllTo(targetPath, true)
    fs.unlinkSync(cpxPath)
    console.log(`✅ Installed plugin: ${pluginId}`)
    return pluginId
  } catch (err) {
    console.error(`❌ Failed to install plugin from ${cpxPath}:`, err)
    return null
  }
}

export async function removePlugin(pluginId: string): Promise<void> {
  await unloadPlugin(pluginId)

  const pluginPath = path.join(pluginsDir, pluginId)
  if (!fs.existsSync(pluginPath)) {
    console.warn(`⚠️ Plugin "${pluginId}" not found.`)
    return
  }

  const settings = getSettings()
  delete settings[pluginId]
  saveSettings(settings)

  try {
    fs.rmSync(pluginPath, { recursive: true, force: true })
    console.log(`❌ Removed plugin: ${pluginId}`)
  } catch (err) {
    console.error(`❌ Failed to remove plugin "${pluginId}":`, err)
  }
}

export async function loadPlugins(): Promise<void> {
  const settings = getSettings()
  const pluginDirs = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((f) => f.isDirectory())

  for (const dir of pluginDirs) {
    const pluginId = dir.name
    await loadPluginIsolated(pluginId, settings)
  }
}
