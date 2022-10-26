$a = docker run -dp 3000:3000 `
            -w /app -v "$(pwd):/app" `
            --network todo-app `
            -e MYSQL_HOST=mysql `
            -e MYSQL_USER=root `
            -e MYSQL_PASSWORD=secret `
            -e MYSQL_DB=todos `
            node:12-alpine `
            sh -c "yarn install && yarn run dev"