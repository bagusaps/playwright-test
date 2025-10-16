FROM mcr.microsoft.com/playwright:v1.53.2-jammy
ENV TZ=Asia/Bangkok
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN chown -R pwuser:pwuser /app
USER pwuser
CMD ["npx", "playwright", "test", "--reporter=github,html"]
