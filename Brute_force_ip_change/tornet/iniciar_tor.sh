#!/bin/bash

PROXY=$1

for i in $(seq 0 $((PROXY - 1))); do
    tor -f /tmp/tor${i}rc &
done
