#!/bin/bash
set -ex

NODE_NAME="$1"
dir=$2

cat /dev/null > $dir/ca.db
cat /dev/null > $dir/ca.crt.srl
echo "01" > $dir/ca.serial.txt

cat - ./signing.conf > $dir/signing.conf <<CONF
[ default ]
dir                     = ${dir}               # Top dir
CONF

echo Generating keystore and certificate for node ${NODE_NAME}

openssl req -out "$dir/$NODE_NAME.csr" -new -newkey rsa:2048 -keyout "$dir/$NODE_NAME.key" -subj "/CN=$NODE_NAME/OU=OpenShift/O=Logging/L=Test/C=DE" -days 712 -nodes

echo Sign certificate request with CA
openssl ca \
    -in "$dir/$NODE_NAME.csr" \
    -notext \
    -out "$dir/$NODE_NAME.crt" \
    -config $dir/signing.conf \
    -extensions v3_req \
    -batch \
	-extensions server_ext
