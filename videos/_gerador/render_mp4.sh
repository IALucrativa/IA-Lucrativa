#!/bin/bash
# Uso: render_mp4.sh <pasta> <saida.mp4>
set -e
S=/tmp/claude-0/-home-user-IA-Lucrativa/cf9f494a-2ac2-543d-b0e1-8c1c84ae0be6/scratchpad
cd /home/user/IA-Lucrativa/videos/$1
rm -rf $S/r_$1
NODE_PATH=$(npm root -g) node render.js $S/r_$1 >/dev/null
python3 audio.py $S/r_$1/meta.json $S/r_$1.wav
ffmpeg -v error -y -framerate 30 -i $S/r_$1/f_%04d.png -i $S/r_$1.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart -c:a aac -b:a 160k -shortest $2
rm -rf $S/r_$1 $S/r_$1.wav
echo "ok $1 $(ffprobe -v error -show_entries format=duration -of csv=p=0 $2)"
