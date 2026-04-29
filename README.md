Para compresión de los videos:

Base previa:
ffmpeg -i ~/Documents/Toshiba\ video/original.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output.mp4
ffmpeg -i prueba_marker.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output2.mp4



// Nuevo codes para secuencia de imagen

ffmpeg -i prueba_marker_mobile.mov -vf "fps=24,scale=720:-2" -q:v 3 frames/frame_%04d.jpg

ffmpeg -i prueba_marker_mobile.mov -vf "fps=24,scale=720:-2" -c:v libwebp -q:v 80 frames/frame_%04d.webp