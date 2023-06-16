#!/bin/bash

# Start Xvfb on display 99
# Start Xvfb on display 99, wait for it to be ready, then run the Deno application
Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset & \
    DISPLAY=:99 deno run -A api.ts

