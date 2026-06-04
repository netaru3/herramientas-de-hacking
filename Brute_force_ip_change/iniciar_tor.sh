#!/bin/bash


#declaración de variables


#codigo ejecutable

for i in {0..4}
do
    tor -f /tmp/tor$i\rc &
done



