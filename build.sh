#!/bin/sh

function help() {
	echo "A simple script to help build JS based Web App projects";
	echo "";
	echo "build dev - use to assemble non compiled JS and non compressed CSS for debugging";
	echo "build dist - use to assemble compiled JS and CSS for distribution";
	echo "";
}

echo "Starting build script...";
echo "User running script: $USER";
echo "Checking SASS version...";
sass -v

if [ $1 ]
then
	case $1 in
		"dev")
			echo "Building for dev...";
			npm install
			bower install
			grunt dev
			echo "Cleaning up...";
			rm -rf .sass-cache
			rm -rf node_modules
			echo "Dev build complete!";;
		"dist")
			echo "Building for distribution...";
	    	npm install
	    	bower install
	    	grunt compile
			echo "Cleaning up...";
			rm -rf .sass-cache
			rm -rf node_modules
			rm -rf src
			rm -rf jasmine
	    	echo "Distribution build complete!";;
		*)
			help;;
	esac
else
	help;
fi