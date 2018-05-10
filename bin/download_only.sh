#!/bin/bash
dest=$1
OS=`uname`

# Get current date
DATE=$(date +"%d-%m-%Y")
TODAY_DEST="$dest/$DATE"

if [ -z "$1" ]
  then
    echo "Usage > download.sh /path/to/dest"
fi

function logdb() {
  file_name=$1
  time_in_secs=$2
  ins_date=$3
  $FIBO_HOME/bin/logd -f $file_name -d $ins_date -t $time_in_secs -s 1
}

# functions
# $1 -> file name, $2 -> url, $3 -> username, $4 -> password
function download() {
  start=`date +%s`

  file_name=$1
  url=$2
  if [ -f "$file_name" ]
  then
    echo "$file_name downloaded."
  else
    if [ -z "$3" ]
    then
      wget -O $file_name $url
    else
      wget -O $file_name  --user=$3 --password='' $url
    fi
    echo ">>> done $file_name"
    end=`date +%s`
    runtime=$((end-start))
    logdb $file_name $runtime $DATE
  fi
}

# $1 -> file name, $2 -> url, $3 -> username, $4 -> password
function download_and_unzip() {
  start=`date +%s`
  file_name=$1
  url=$2
  dir=$(dirname "$file_name")
  if [ -f "$file_name" ]
  then
    echo "$file_name downloaded."
  else
    if [ -z "$3" ]
    then
      wget -O $file_name $url
    else
      wget -O $file_name --user=$3 --password='' $url
    fi
    # unzip $file_name -d $dir
    res=$(unzip $file_name -d $dir | grep inflating | sed 's/inflating: //g')
    echo ">>> done $res"
    end=`date +%s`
    runtime=$((end-start))
    logdb $res $runtime $DATE
  fi
}

# If not exist, create the destination
mkdir -p $dest
mkdir -p $TODAY_DEST

# Make the sites folder
mkdir -p "$TODAY_DEST/Namejet"
mkdir -p "$TODAY_DEST/Snapnames"
mkdir -p "$TODAY_DEST/Dropcatch"
mkdir -p "$TODAY_DEST/Godaddy"

####################################################################################
# Download the data                                                                #
####################################################################################
# NameJet
NAMEJET_DOMAIN="http://www.namejet.com/download"

## Pre-Release
NAMEJET_PRE_RELEASE="$NAMEJET_DOMAIN/PreRelease.txt"
download "$TODAY_DEST/Namejet/PreRelease.txt" $NAMEJET_PRE_RELEASE

## Pending Delete
DATE_TODAY=$(date +"%m-%d-%Y" | sed 's/^0//g')
if [ "$OS" == "Darwin" ]
then
 DATE_TOMORROW=$(date -v +1d +"%m-%d-%Y" | sed 's/^0//g')
 DATE_2_DAY_OUT=$(date -v +2d +"%m-%d-%Y" | sed 's/^0//g')
 DATE_3_DAY_OUT=$(date -v +3d +"%m-%d-%Y" | sed 's/^0//g')
 DATE_4_DAY_OUT=$(date -v -1d +"%m-%d-%Y" | sed 's/^0//g')
elif [ "$OS" == "Linux" ]
then
  DATE_TOMORROW=$(date -d "+1 days" +"%m-%d-%Y" | sed 's/^0//g')
  DATE_2_DAY_OUT=$(date -d "+2 days" +"%m-%d-%Y" | sed 's/^0//g')
  DATE_3_DAY_OUT=$(date -d "+3 days" +"%m-%d-%Y" | sed 's/^0//g')
  DATE_4_DAY_OUT=$(date -d "-1 days" +"%m-%d-%Y" | sed 's/^0//g')
elif [ -n "$COMSPEC" -a -x "$COMSPEC" ]
then 
  echo $0: this script does not support Windows \:\(
fi

NAMEJET_TODAY="$NAMEJET_DOMAIN/$DATE_TODAY.txt"
NAMEJET_TOMORROW="$NAMEJET_DOMAIN/$DATE_TOMORROW.txt"
NAMEJET_2_DAY_OUT="$NAMEJET_DOMAIN/$DATE_2_DAY_OUT.txt"
NAMEJET_3_DAY_OUT="$NAMEJET_DOMAIN/$DATE_3_DAY_OUT.txt"
NAMEJET_4_DAY_OUT="$NAMEJET_DOMAIN/$DATE_4_DAY_OUT.txt"

download "$TODAY_DEST/Namejet/$DATE_TODAY.txt" $NAMEJET_TODAY
download "$TODAY_DEST/Namejet/$DATE_TOMORROW.txt" $NAMEJET_TOMORROW
download "$TODAY_DEST/Namejet/$DATE_2_DAY_OUT.txt" $NAMEJET_2_DAY_OUT
download "$TODAY_DEST/Namejet/$DATE_3_DAY_OUT.txt" $NAMEJET_3_DAY_OUT
download "$TODAY_DEST/Namejet/$DATE_4_DAY_OUT.txt" $NAMEJET_4_DAY_OUT

## Auctions & Listing
NAMEJET_AUCTIONS_LISTING="$NAMEJET_DOMAIN/StandardAuctions.csv"
download "$TODAY_DEST/Namejet/StandardAuctions.csv" $NAMEJET_AUCTIONS_LISTING
# NameJet
####################################################################################

####################################################################################
# SnapNames
SNAP_DOMAIN="https://www.snapnames.com/file_dl.sn"
## Expiring Domains
SNAP_EXPIRING="$SNAP_DOMAIN?file=SNallexpiring_list.zip"
SNAP_DELETING="$SNAP_DOMAIN?file=snpdlist.zip"
SNAP_IN_AUCTIONS="$SNAP_DOMAIN?file=snpalist.zip"

download_and_unzip "$TODAY_DEST/Snapnames/SNallexpiring_list.zip" $SNAP_EXPIRING
download_and_unzip "$TODAY_DEST/Snapnames/snpdlist.zip" $SNAP_DELETING
download_and_unzip "$TODAY_DEST/Snapnames/snpalist.zip" $SNAP_IN_AUCTIONS

# unzip "$TODAY_DEST/Snapnames/SNallexpiring_list.zip" -d "$TODAY_DEST/Snapnames/"
# unzip "$TODAY_DEST/Snapnames/snpdlist.zip" -d "$TODAY_DEST/Snapnames/"
# unzip "$TODAY_DEST/Snapnames/snpalist.zip" -d "$TODAY_DEST/Snapnames/"
# SnapNames
####################################################################################

####################################################################################
# DropCatch
DROP_CATCH_DOMAIN="https://www.dropcatch.com/DownloadCenter/ExpiringDomainsCSV"
## Download 5 last days
DATE_TODAY=$(date +"%Y-%m-%d")
if [ "$OS" == "Darwin" ]
then
 DATE_TOMORROW=$(date -v +1d +"%Y-%m-%d")
 DATE_2_DAY_OUT=$(date -v +2d +"%Y-%m-%d")
 DATE_3_DAY_OUT=$(date -v +3d +"%Y-%m-%d")
 DATE_4_DAY_OUT=$(date -v +4d +"%Y-%m-%d")
elif [ "$OS" == "Linux" ]
then
  DATE_TOMORROW=$(date -d "+1 days" +"%Y-%m-%d")
  DATE_2_DAY_OUT=$(date -d "+2 days" +"%Y-%m-%d")
  DATE_3_DAY_OUT=$(date -d "+3 days" +"%Y-%m-%d")
  DATE_4_DAY_OUT=$(date -d "+4 days" +"%Y-%m-%d")
elif [ -n "$COMSPEC" -a -x "$COMSPEC" ]
then 
  echo $0: this script does not support Windows \:\(
fi

DROP_CATCH_TODAY="$DROP_CATCH_DOMAIN?date=$DATE_TODAY"
DROP_CATCH_TOMORROW="$DROP_CATCH_DOMAIN?date=$DATE_TOMORROW"
DROP_CATCH_2_DAY_OUT="$DROP_CATCH_DOMAIN?date=$DATE_2_DAY_OUT"
DROP_CATCH_3_DAY_OUT="$DROP_CATCH_DOMAIN?date=$DATE_3_DAY_OUT"
DROP_CATCH_4_DAY_OUT="$DROP_CATCH_DOMAIN?date=$DATE_4_DAY_OUT"

download_and_unzip "$TODAY_DEST/Dropcatch/$DATE_TODAY.zip" $DROP_CATCH_TODAY
download_and_unzip "$TODAY_DEST/Dropcatch/$DATE_TOMORROW.zip" $DROP_CATCH_TOMORROW
download_and_unzip "$TODAY_DEST/Dropcatch/$DATE_2_DAY_OUT.zip" $DROP_CATCH_2_DAY_OUT
download_and_unzip "$TODAY_DEST/Dropcatch/$DATE_3_DAY_OUT.zip" $DROP_CATCH_3_DAY_OUT
download_and_unzip "$TODAY_DEST/Dropcatch/$DATE_4_DAY_OUT.zip" $DROP_CATCH_4_DAY_OUT

# unzip "$TODAY_DEST/Dropcatch/$DATE_TODAY.zip" -d "$TODAY_DEST/Dropcatch/"
# unzip "$TODAY_DEST/Dropcatch/$DATE_TOMORROW.zip" -d "$TODAY_DEST/Dropcatch/"
# unzip "$TODAY_DEST/Dropcatch/$DATE_2_DAY_OUT.zip" -d "$TODAY_DEST/Dropcatch/"
# unzip "$TODAY_DEST/Dropcatch/$DATE_3_DAY_OUT.zip" -d "$TODAY_DEST/Dropcatch/"
# unzip "$TODAY_DEST/Dropcatch/$DATE_4_DAY_OUT.zip" -d "$TODAY_DEST/Dropcatch/"

# DropCatch
####################################################################################

####################################################################################
# Godaddy
GODADDY_DOMAIN="ftp://ftp.godaddy.com"
## tdnam_all_listings.csv.zip
GODADDY_TDNAM_ALL="$GODADDY_DOMAIN/tdnam_all_listings.csv.zip"
GODADDY_BIDDING="$GODADDY_DOMAIN/bidding_service_auctions.csv.zip"
GODADDY_EXPIRING="$GODADDY_DOMAIN/expiring_service_auctions.csv.zip"

download_and_unzip "$TODAY_DEST/Godaddy/tdnam_all_listings.zip" $GODADDY_TDNAM_ALL "auctions"
download_and_unzip "$TODAY_DEST/Godaddy/bidding_service_auctions.zip" $GODADDY_BIDDING "auctions"
download_and_unzip "$TODAY_DEST/Godaddy/expiring_service_auctions.zip" $GODADDY_EXPIRING "auctions"

# unzip "$TODAY_DEST/Godaddy/tdnam_all_listings.zip" -d "$TODAY_DEST/Godaddy/"
# unzip "$TODAY_DEST/Godaddy/bidding_service_auctions.zip" -d "$TODAY_DEST/Godaddy/"
# unzip "$TODAY_DEST/Godaddy/expiring_service_auctions.zip" -d "$TODAY_DEST/Godaddy/"
# Godaddy
####################################################################################

echo "Done!!!"
