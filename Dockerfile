FROM denoland/deno:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Chrome and dependencies
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
  xvfb

# Set the DISPLAY environment variable to use the virtual display
ENV DISPLAY=:99
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
EXPOSE 8000

# Add a script to start xvfb and your application
COPY start.sh /start.sh
RUN chmod +x /start.sh
RUN chmod -R o+rwx /usr/bin/google-chrome

COPY . .
RUN deno cache api.ts

# Run your app
CMD ["/start.sh"]
