#!/bin/bash

DIR=/Users/dmfranke/42/GitHub/Transcendence/database

# Source the .env file (assuming it's one directory above the script)
source ${DIR}/../.env

# Run the pg_dump command using DATABASE_URL
docker exec -it transcendence-database-1 pg_dump "${DATABASE_URL}" -f /db_dump.sql

# Check the exit status of the pg_dump command
if [ $? -eq 0 ]; then
  echo "Database backup completed successfully."
else
  echo "Database backup failed."
  exit 1
fi

# Copy the backup file from the container to the host
docker cp transcendence-database-1:/db_dump.sql ${DIR}/db_dump.sql

# Check the exit status of the docker cp command
if [ $? -eq 0 ]; then
  echo "Backup file copied successfully."
else
  echo "Copying backup file failed."
  exit 1
fi

rm ${DIR}/backup.init.sql
mv ${DIR}/init.sql ${DIR}/backup.init.sql & mv ${DIR}/db_dump.sql ${DIR}/init.sql
