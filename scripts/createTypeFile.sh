#!/use/bin/env bash


names=$(echo $@ | sed "s/ //g")

IFS_old=$IFS
IFS=,

for i in $names
do
  if [ -n $i ] && [ ! -f ./src/types/override/$i.d.ts ]
  then
    cat > ./src/types/override/$i.d.ts <<EOF
import { $i } from 'sequelize';

export { $i };
EOF
  fi
done

IFS=$IFS_old
