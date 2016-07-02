## Generate random token with length specified as first parameter.
## Example: generateRandomToken 5
function generateRandomToken {
  cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w $1 | head -n 1
}