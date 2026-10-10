import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Use a locally installed Chrome if REMOTION_BROWSER_EXECUTABLE is set (sandbox only).
const exe = process.env.REMOTION_BROWSER_EXECUTABLE;
if (exe) {
  Config.setBrowserExecutable(exe);
}
