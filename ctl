#!/bin/sh
# Control battery, network and CPU frequency.
# 0BSD 2019 Denys Nykula <nykula@ukr.net>
# ctl bat|wl|recon|ear|airpl|cool|turbo
if test "$1" = bat; then watch cat /sys/class/power_supply/*/charge_now
elif test "$1" = wait; then for i in {1..4}; do echo -n .; sleep 1; done
elif test "$1" = wl; then rfkill unblock all; wpa_cli scan; ctl wait
  wpa_cli status; ctl wait; wpa_cli scan_results; wpa_cli status
  echo === `basename $0`: connect, ^D; wpa_cli; ctl recon
elif test "$1" = recon; then ifconfig enp3s0 down; pkill -HUP wpa_supplicant
  if busybox udhcpc -fnqiwlp2s0
  then echo === `basename $0`: ^D to off; wpa_cli; ctl airpl; exit; fi
  ifconfig enp3s0 up; if busybox udhcpc -fnqienp3s0
  then echo === `basename $0`: ^D to off; cat; ctl airpl; fi
elif test "$1" = pair; then echo paired-devices |bluetoothctl |
  awk '/^Device/{print$2}'
elif test "$1" = btoff; then pgrep bluetoothd &&echo power off |bluetoothctl
  killall bluetoothd bluealsa{,-aplay} dbus-daemon
  rm -r /etc/asound.conf /run/dbus*
elif test "$1" = ear; then ctl btoff; mkdir /run/dbus
  dbus-daemon --system; rfkill unblock all; ctl wait
  /usr/libexec/*/bluetoothd -n &ctl wait
  echo -e 'power on\nscan on' |bluetoothctl; bluealsa &ctl wait
  echo === `basename $0`: pair, connect, ^D; bluetoothctl
  bluealsa-aplay `ctl pair` &tee /etc/asound.conf <<EOF
defaults.bluealsa { device "`ctl pair`" }
pcm.!default { type plug slave { pcm "bluealsa" } }
ctl.!default { type bluealsa }
EOF
  echo === `basename $0`: ^D to off; bluetoothctl; ctl btoff
elif test "$1" = airpl; then ctl btoff; rfkill block all
  ifconfig enp3s0 down; kill `pgrep dhcp`; ctl wait
elif test "$1" = cool; then cd /sys/*/cpu/devices
  for i in *; do cat $i/*/c*min* >`ls $i/*/s*max*`; done; watch cat */*/s*cur*
elif test "$1" = turbo; then cd /sys/*/cpu/devices
  for i in *; do cat $i/*/c*max* >`ls $i/*/s*max*`; done; watch cat */*/s*cur*
elif test "$1" = vol; then amixer sget Master |
  awk '/Limits/{printf$5"*0."}/([0-9]+%)/{gsub(/[[\]%]/,"");print$4}' |bc
elif test "$1" = dentry; then
  printf '[Desktop Entry]\nExec=%s\nName=%s\nType=Application\nVersion=1.0\n' "$2" "$3"
else sed '/^# ctl/!d;s/# /usage: /' $0; sed '2!d;s/# /\n/' $0; fi