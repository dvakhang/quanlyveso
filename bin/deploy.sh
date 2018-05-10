#!/bin/bash
HOST=officefibo.dynu.net
PORT=48822
USER=fibo
USER
if [ "$1" == "master" ]; then
  PORT=48822
else
  if [ "$1" == "v2.2" ]; then
    PORT=48823
  fi
fi
echo "Deploying on server $HOST:$PORT"
ssh-keyscan -p $PORT -H $HOST >> ~/.ssh/known_hosts
ssh -t -p $PORT $USER@$HOST "/home/fibo/tools/deploy_fibo.sh $1"
