import { aboutScaffold } from '../about';
import { mplCmd } from '../utils';

export default async function mplWeb(appName: string) {
  mplCmd(['create-tauri-app', appName]);
  aboutScaffold(appName, 'tauri');
}