import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const pluginsRoot = path.resolve('./plugins'); // where your plugins source folders are
const distPluginsFolder = path.resolve('./build/plugins'); // destination folder for .cpx files

// Helper to run shell commands synchronously
function run(cmd: string, cwd: string) {
  console.log(`> ${cmd} (in ${cwd})`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

// Zip a folder to a .cpx file
function zipFolderToCPX(sourceFolder: string, outputCPXFile: fs.PathLike) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputCPXFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(
        `Zipped ${sourceFolder} → ${outputCPXFile} (${archive.pointer()} bytes)`
      );
      resolve();
    });

    archive.on('error', (err: any) => reject(err));

    archive.pipe(output);
    archive.directory(sourceFolder, false);
    archive.finalize();
  });
}

async function buildAndPackAllPlugins() {
  if (!fs.existsSync(distPluginsFolder)) {
    fs.mkdirSync(distPluginsFolder, { recursive: true });
  }

  const pluginFolders = fs.readdirSync(pluginsRoot).filter((name) => {
    if (name === 'plugin-sdk') return false; // exclude this folder explicitly
    const folderPath = path.join(pluginsRoot, name);
    return fs.statSync(folderPath).isDirectory();
  });

  for (const pluginName of pluginFolders) {
    const pluginPath = path.join(pluginsRoot, pluginName);
    // Step 1: Build plugin (assuming npm build)
    try {
      run('pnpm install', pluginPath); // ensure dependencies
      run('pnpm run build', pluginPath);
    } catch (e) {
      console.error(`Failed to build plugin ${pluginName}`, e);
      continue;
    }

    // Step 2: Zip plugin dist folder (assuming output is ./dist)
    const distFolder = path.join(pluginPath, 'dist');
    if (!fs.existsSync(distFolder)) {
      console.warn(`Plugin ${pluginName} has no dist folder, skipping zipping`);
      continue;
    }

    const outputCPX = path.join(distPluginsFolder, `${pluginName}.cpx`);
    try {
      await zipFolderToCPX(distFolder, outputCPX);
    } catch (e) {
      console.error(`Failed to zip plugin ${pluginName}`, e);
      continue;
    }
  }
}

buildAndPackAllPlugins()
  .then(() => console.log('All plugins built and packed!'))
  .catch((err) => console.error('Error building/packing plugins:', err));
