#!/bin/bash

# 1️⃣ Abrir túnel SSH en foreground y ejecutar NestJS en background
ssh -L 3306:localhost:3336 debian@148.113.203.34 -N &
SSH_PID=$!

# 2️⃣ Esperar 2 segundos para asegurar que el túnel esté listo
sleep 2

# 3️⃣ Arrancar NestJS
pnpm start:dev

# 4️⃣ Cuando NestJS termine, cerramos el túnel
kill $SSH_PID
