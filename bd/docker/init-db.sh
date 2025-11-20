#!/bin/bash
set -e

echo "Inicializando base de datos..."

for file in /docker-entrypoint-initdb.d/*.sql; do
    if [ -f "$file" ]; then
        echo "Ejecutando: $file"
        psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$file"
    fi
done

echo "Base de datos inicializada correctamente."