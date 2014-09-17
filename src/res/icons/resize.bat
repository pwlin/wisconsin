@echo off

CALL imconvert app_icon_src.png -strip -size 36x36 app_icon_ldpi_36.png

CALL imconvert app_icon_src.png -strip -resize 36x36 app_icon_ldpi_36.png

CALL imconvert app_icon_src.png -strip -resize 48x48 app_icon_mdpi_48.png

CALL imconvert app_icon_src.png -strip -resize 72x72 app_icon_hdpi_72.png

CALL imconvert app_icon_src.png -strip -resize 96x96 app_icon_xhdpi_96.png

CALL imconvert app_icon_src.png -strip -resize 32x32 app_icon_32.png

CALL base64 -e app_icon_32.png app_icon_32_base64.txt

