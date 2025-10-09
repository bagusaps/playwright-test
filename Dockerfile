FROM mcr.microsoft.com/playwright:v1.53.2-jammy
ENV TZ=Asia/Bangkok
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps
CMD ["npx", "playwright", "test", "--reporter=list"]