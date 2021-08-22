RESULT_NAME="theFiles"

echo "Calculating all files md5 ..."
find $1 -type f -print0 | xargs -0 md5sum > $RESULT_NAME.md5

echo "Sorting ..."
sort $RESULT_NAME.md5 > $RESULT_NAME.sorted.md5

echo "Generating executing script ..."
node proc.js $RESULT_NAME.sorted.md5 > $RESULT_NAME.execute.sh

echo "Please review $RESULT_NAME.execute.sh and run:"
echo "chmod +x $RESULT_NAME.execute.sh"
echo "./$RESULT_NAME.execute.sh"

