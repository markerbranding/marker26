Para compresión de los videos:



NEO

// Mobile:
ffmpeg -i web_marker.mp4 -vf "fps=24,scale=480:-2" -c:v libwebp -q:v 80 frames/mobile/frame_%04d.webp

// Desktop:
ffmpeg -i web_marker.mp4 -vf "fps=24,scale=720:-2" -c:v libwebp -q:v 80 frames/mobile/frame_%04d.webp





// Mobile:
ffmpeg -i web_marker.mp4 -vf "fps=24,scale=720:-2" -c:v libwebp -q:v 80 frames/mobile/frame_%04d.webp

// Desktop:
ffmpeg -i web_marker.mp4 -vf "fps=24,scale=800:-2" -c:v libwebp -lossless 0 -compression_level 4 -q:v 90 frames/desktop/frame_%04d.webp




// Base original:
ffmpeg -i ~/Documents/Toshiba\ video/original.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output.mp4
ffmpeg -i prueba_marker.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output2.mp4