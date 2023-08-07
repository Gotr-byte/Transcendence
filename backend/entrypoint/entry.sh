#!/bin/bash

# Apply Prisma Migrations with expect
spawn prisma migrate dev --name "update"

# Wait for the application to exit
wait

exec $@