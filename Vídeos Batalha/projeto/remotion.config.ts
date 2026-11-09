import fs from 'fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Se este computador já tem um navegador de render instalado, usa ele
// (assim não precisa baixar outro). Se não tiver, o Remotion pede para baixar.
const navegadorJaInstalado = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(navegadorJaInstalado)) {
  Config.setBrowserExecutable(navegadorJaInstalado);
}
