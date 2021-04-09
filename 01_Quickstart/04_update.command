#!/bin/bash

BLACK="\033[30m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
PINK="\033[35m"
CYAN="\033[36m"
WHITE="\033[37m"
NORMAL="\033[0;39m"

set -e
cd `dirname $0`
cd ..

PS3='Please choose the banner data you want to update: '
options1=("voucher-deal" "merchant-deal" "product-deal" "Quit")
select opt1 in "${options1[@]}"
do
    case $opt1 in
        "voucher-deal")
            printf "${GREEN}You chose $opt1\n${NORMAL}"
    		break
    		;;
        "merchant-deal")
            printf "${GREEN}You chose $opt1\n${NORMAL}"
			break
            ;;
        "product-deal")
            printf "${GREEN}You chose $opt1\n${NORMAL}"
			break
            ;;
        "retargeting")
            printf "${GREEN}You chose $opt1\n${NORMAL}"
			break
            ;;
        "Quit")
            exit
            ;;
        *) printf invalid option;;
    esac
done

echo "Type in the banner ID that you want to update (8 digits), followed by [ENTER]:"

read id

echo -e "${GREEN}Updating the banner data... ${NORMAL}"

BANNER=$opt1 ID=$id npm run update