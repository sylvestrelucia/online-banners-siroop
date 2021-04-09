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

PS3='Please choose the banner format you want to archive: '
options1=("voucher-deal" "merchant-deal" "product-deal" "retargeting" "Quit")
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

PS3='Please choose the banner size you want to archive: '
options2=("160x600" "300x250" "300x600" "320x160" "728x90" "800x250" "970x250" "994x250" "all" "Quit")
select opt2 in "${options2[@]}"
do
    case $opt2 in
        "160x600")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "300x250")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "300x600")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "320x160")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "728x90")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "800x250")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "970x250")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "994x250")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
			break
            ;;
        "all")
            printf "${GREEN}You chose $opt2\n${NORMAL}"
        	break
        	;;
        "Quit")
            exit
            ;;
        *) printf invalid option;;
    esac
done

echo -e "${GREEN}Creating the default banner image... ${NORMAL}"

BANNER=$opt1 FORMAT=$opt2 npm run snapshot

echo -e "${GREEN}Building your ZIP file... ${NORMAL}"

BANNER=$opt1 FORMAT=$opt2 npm run archive