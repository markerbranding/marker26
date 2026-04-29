Para compresión de los videos:

ffmpeg -i ~/Documents/Toshiba\ video/original.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output.mp4

ffmpeg -i prueba_marker.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output2.mp4